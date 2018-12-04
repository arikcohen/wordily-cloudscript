handlers.processFBIG_Webhook_Game_Message = function (args, context ) {
    log.info("tags", context.playerProfile.Tags);
    

    // check to see if current player already has been linked to the bot
    if (context.playerProfile.Tags.includes("BotSubscribed")
    {
        // already linked to bot
        return;
    }
    else
    {
        //create linking by storing the page specific id into the player's data
        server.UpdateUserInternalData( {
           Data: {
               FBIG_PSID : context.playStreamEvent.sender
           }
        });

        server.AddPlayerTag({ 
            TagName: "BotSubscribed"
        });

        log.info ("linked player for bot messages");
    }


}
