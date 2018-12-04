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
    // arguments 
    // messageTitle=null, messageImage=null, messageSubTitle=null, buttonTitle="Play", payload=null, context_id=null, player_id=null


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

    let recipientId = "1983609171705685";

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
                 {`;

      if (args.messageTitle) {
          messageBody += `
                  "title":"${args.messageTitle}",`;
      }

      if (!isEmpty(args.messageImage)) {
        messageBody += `
                  "image_url":"${args.messageImage}",`
      }

      if (args.messageSubTitle) {
        messageBody += `
                  "subtitle":"${args.messageSubTitle}",`
      }

      if (args.buttonTitle) {
        messageBody += `
                  "image_url":"${args.messageImage}",`
      }
      

      messageBody += `
                  "buttons":[
                    {
                      "type":"game_play",`;
      if (args.buttonTitle) {                                            
        messageBody += `
                      "title":"${args.buttonTitle}"`;
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

