// update statistics for a Solitaire Game
handlers.processSolitaireGameResult = function (args, context) {
	
	var request = {
		PlayFabId: currentPlayerId, Statistics:
			[
				{
				StatisticName: "SolitaireGamesPlayed",
				Value: 1
				},
				{
					StatisticName: "SolitaireGamesBestScore",
					Value: 100
				},
				{
					StatisticName: "SolitaireGamesTotalScore",
					Value: 100
				}
			]
	};
	server.UpdatePlayerStatistics(request);
	log.debug(args);
	log.info(context);
};
