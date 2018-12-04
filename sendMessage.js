handlers.sendFacebookBotMessage = function (args, context ) {
    // arguements 
    // messageTitle=null, messageImage=null, messageSubTitle=null, buttonTitle="Play", payload=null, context_id=null, player_id=null

    var accessToken = "EAAadeyVj81kBAL4s0dq4z5fzLPu7Flpyi9OPTeLsgGBHp1ZAxbieWuYtPka31lf70wIgxMOyFlsUzQuMka41anYZCpBWzT25ekqCCyhkBAvoBH6dl8GYODBSyNWNFsrxuppCjxUJVrY2Gz9lTBezExV0HDXm7Hi3k7EXYhWgZDZD";
    var uriSendMessage = `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`;

    var messageBody = `
    {
        "recipient":{
          "id":"<PSID>"
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
    log.info("body", messageBody);
    var responseString = http.request(uriSendMessage, "post", messageBody, "application/json");
    log.info("response from Bot", responseString);
}

