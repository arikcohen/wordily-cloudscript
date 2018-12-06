// update statistics for a Solitaire Game
handlers.processSolitaireGameResult = function (args, context) {
	let data = context.playStreamEvent;
	var request = {
		PlayFabId: currentPlayerId, Statistics:
			[
				{
				StatisticName: "SolitaireGamesPlayed",
				Value: 1
				},
				{
					StatisticName: "SolitaireGamesBestScore",
					Value: data.score
				},
				{
					StatisticName: "DailyBestGameScore",
					Value: data.score
				},
				{
					StatisticName: "SolitaireGamesTotalScore",
					Value: data.score
                },                
                {
                    StatisticName: "SolitaireGamesBestWordScore",
                    Value: data.bestWordScore
                }
			]
	};
	server.UpdatePlayerStatistics(request);	
};
