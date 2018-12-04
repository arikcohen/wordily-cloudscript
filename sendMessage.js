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
       let errString = "Bot Access Token must be in TitleInternalData with a Key of FBIGBotAccessToken";
       log.error("Bot Access Token must be in TitleInternalData with a Key of FBIGBotAccessToken");
       throw ("Bot Access Token must be in TitleInternalData with a Key of FBIGBotAccessToken");
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
    var response =  JSON.parse(http.request(uriSendMessage, "post", messageBody, "application/json"));

    log.info("response from Bot", response);
    return response;
}

