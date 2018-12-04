handlers.sendFacebookBotMessage = function (messageTitle=null, messageImage=null, messageSubTitle=null, buttonTitle="Play", payload=null, context_id=null, player_id=null ) {
    var accessToken = "EAAadeyVj81kBAL4s0dq4z5fzLPu7Flpyi9OPTeLsgGBHp1ZAxbieWuYtPka31lf70wIgxMOyFlsUzQuMka41anYZCpBWzT25ekqCCyhkBAvoBH6dl8GYODBSyNWNFsrxuppCjxUJVrY2Gz9lTBezExV0HDXm7Hi3k7EXYhWgZDZD";
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
                  "title":"${messageTitle}",
                  "image_url":"${messageImage}",
                  "subtitle":"${messageSubTitle}",
                  
                  "buttons":[
                    {
                      "type":"game_play",                      
                      "title":"${buttonTitle}"
                    }              
                  ]      
                }
              ]
            }
          }
        }
    }`;

    var responseString = http.request(uriSendMessage, "post", messageBody, "application/json");
}
