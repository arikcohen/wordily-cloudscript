function isEmpty(str) {
  return (!str || 0 === str.length);
}

let App = {
  get TitleData() {
      // Please, consider caching the title data that is needed
      return server.GetTitleData({}).Data;
  },

  get TitleInternalData() {
    // Please, consider caching the title data that is needed
    return server.GetTitleInternalData({}).Data;
}
}


/////////////////////////////////////////////////////////////////////////////////////
//  The sendFacebookBotMessage will send a generic template message to the player via 
//  the Facebook Graph API to send a message to the player.
//  
//  For more details on the generic template see: 
//  https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic/
// 
//  You must configure the FBIGBotAccessToken key in TitleInternalData to have the page 
//  access token for your messenger bot.
//
//  You must have the player's PSID (Page Specific ID) stored in the FBIG_PSID key in
//  UserInternalData 
//
//
//  There are two ways to send the message specifics:
//    1.  Include an argument of TitleInternalDataKey that provides a JSON representation 
//        of the message data format.
//
//    2.  Include the following arguments to define the message data format
//          - title (required): The title to display in the template. 80 character limit.
//          - subtitle (optional): The subtitle to display in the template. 80 character limit
//          - image_url (optional): The URL of the image to display in the template
//          - button_title (optional): The text to display on the Play button (defaults to Play)


handlers.sendFacebookBotMessage = function (args, context) {
    

    let titleInternalData = App.TitleInternalData;    
    let accessToken = titleInternalData.FBIGBotAccessToken;

    // check to see if the Access Token is present in the Title Internal Data
    if (accessToken == null)
    {                    
       return { 
         error: {
          "message" : "Bot Page Access Token must be in TitleInternalData with a Key of FBIGBotAccessToken"
        }
       }       
       
    }
  
    // check to see if the Player has a PSID that can be sent to
    let userData = server.GetUserInternalData({
      PlayFabId: currentPlayerId,      
      Keys: ["FBIG_PSID"]
    }).Data;
    
    if (userData.FBIG_PSID == null) {
      return { 
        error: {
          "message" : `Player ${currentPlayerId} has not been subscribed for bot messages`
        }
      }
    }

    let recipientId = userData["FBIG_PSID"].Value;

    var messageBody = `
    {
        "recipient":{
          "id":"${recipientId}"
        },
        "message":{
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title":"${args.title}",`
      
      if (!isEmpty(args.image_url)) {
        messageBody += `            
                  "image_url":"${args.image_url}",`      
      }
      
      if (!isEmpty(args.messageSubTitle)) {
        messageBody += `
                  "subtitle":"${args.subtitle}",`
      }      
      
      messageBody += `
                  "buttons":[
                    {
                      "type":"game_play"`;

      if (!isEmpty(args.button_title)) {                                            
        messageBody += `
                      ,"title":"${args.button_title}"`;
      }
      messageBody += `              
                    }              
                  ]      
                }
              ]
            }
          }
        }
    }`;        
    

    let uriSendMessage = `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`;

    var response =  JSON.parse(http.request(uriSendMessage, "post", messageBody, "application/json"));

    if (response.error != null) {
        log.error ("Send Message Failed", response.error);
    }
    else {
      server.UpdatePlayerStatistics({
        PlayFabId: currentPlayerId, 
        Statistics: [
          {
              StatisticName: "FBIG_MessagesSentSinceLogin",
              Value:1
          }
        ]
      });
    }

    
    return response;
}

