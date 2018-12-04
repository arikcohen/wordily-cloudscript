handlers.processFBIG_Webhook_Game_Message = function (args, context ) {
      
    // check to see if current player already has been linked to the bot
    if (context.playerProfile.Tags.includes(`title.${script.titleId}.BotSubscribed)`))
    {
        // already linked to bot
        log.info ("player already linked for bot messages");
        return;
    }
    else
    {
        //create linking by storing the page specific id into the player's data
        server.UpdateUserInternalData( {
            PlayFabId: currentPlayerId,
            Data: {
                FBIG_PSID : context.playStreamEvent.sender
            }
        });

        server.AddPlayerTag({ 
            PlayFabId: currentPlayerId,
            TagName: "BotSubscribed"
        });

        log.info ("linked player for bot messages");
    }

    

}
