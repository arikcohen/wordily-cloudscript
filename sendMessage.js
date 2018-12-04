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

handlers.sendFacebookBotMessage = function (args, context ) {
    // required arguments 
    // messageTitle, messageImage, 
    
    // optional arguements
    // messageSubTitle=null, buttonTitle="Play"

    // optional arguments coming soon 
    // payload, context_id, player_id
    


    let titleInternalData = App.TitleInternalData;    
    let accessToken = titleInternalData.FBIGBotAccessToken;
    
    if (accessToken == null)
    {                    
       return { 
         error: {
          "message" : "Bot Page Access Token must be in TitleInternalData with a Key of FBIGBotAccessToken"
        }
       }       
       
    }

    var uriSendMessage = `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`;
    
    
    // check to see if the player has been connected for bot messages
    let tagToCheck =`title.${script.titleId}.BotSubscribed`;
    log.info("context.playerProfile", context.playerProfile);

    if (!context.playerProfile.Tags.includes(tagToCheck)) {
      return { 
        error: {
         "message" : `Player ${currentPlayerId} has not been subscribed for bot messages`
       }
      }       
    }

    let userData = server.GetUserInternalData({
      PlayFabId: currentPlayerId,      
      Keys: ["FBIG_PSID"]
    }).Data;
    
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
                  "title":"${args.messageTitle}",            
                  "image_url":"${args.messageImage}",`      

      if (!isEmpty(args.messageSubTitle)) {
        messageBody += `
                  "subtitle":"${args.messageSubTitle}",`
      }      
      
      messageBody += `
                  "buttons":[
                    {
                      "type":"game_play"`;

      if (!isEmpty(args.buttonTitle)) {                                            
        messageBody += `
                      ,"title":"${args.buttonTitle}"`;
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
    
    var response =  JSON.parse(http.request(uriSendMessage, "post", messageBody, "application/json"));

    if (response.error != null) {
        log.error ("Send Message Failed", response.error);
    }
    return response;
}

