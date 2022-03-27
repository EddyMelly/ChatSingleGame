export const DEBUG = false;

export const debugPlayerNames = [
  'meet_the_seed',
  'wzdew',
  'chaosshield',
  'mindlessness',
  'ceremor',
  'jeremy',
  'chris',
  'matt',
];

export const startDebugGame = (game) => {
  game.playerTeams.forEach((element, index) => {
    element.user = debugPlayerNames[index];
    game.allPlayers.push({
      userName: debugPlayerNames[index],
      team: element,
    });

    game.contestantPanels.giveUserName(
      debugPlayerNames[index],
      element.teamColour
    );
    game.activePlayers.push(element);
  });

  game.startGlassGame();
};
