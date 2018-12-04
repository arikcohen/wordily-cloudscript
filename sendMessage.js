let App = {
  get TitleData() {
      // Please, consider caching the title data that is needed
      return server.GetTitleData({}).Data;
  }
}

handlers.sendFacebookBotMessage = function (args, context ) {
    // arguments 
    // messageTitle=null, messageImage=null, messageSubTitle=null, buttonTitle="Play", payload=null, context_id=null, player_id=null


    let titleData = App.TitleData;    
    let accessToken = titleData.FBIGBotAccessToken;
    
    if (accessToken == undefined)
    {
       throw ("Bot Access Token must be in TitleData with a Key of FBIGBotAccessToken");
    }

    var uriSendMessage = `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`;



    var messageBody = `
    {
        "recipient":{
          "id":"1983609171705685"
        },
        "message":{
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title":"${args.messageTitle}",
                  "image_url":"${args.messageImage}",
                  "subtitle":"${args.messageSubTitle}",
                  
                  "buttons":[
                    {
                      "type":"game_play",                      
                      "title":"${args.buttonTitle}"
                    }              
                  ]      
                }
              ]
            }
          }
        }
    }`;
    log.info("context", context);    
    log.info("body", messageBody);
    var responseString = http.request(uriSendMessage, "post", messageBody, "application/json");
    log.info("response from Bot", responseString);
}

