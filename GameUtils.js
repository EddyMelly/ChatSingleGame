import { COLOUR } from './SharedConstants.js';
import Player from './Player.js';

export const getEmptyPlayerTeams = (game) => {
  return [
    {
      teamColour: COLOUR.ORANGE,
      user: null,
      player: new Player(game, COLOUR.ORANGE),
      isMod: false,
    },
    {
      teamColour: COLOUR.TEAL,
      user: null,
      player: new Player(game, COLOUR.TEAL),
      isMod: false,
    },
    {
      teamColour: COLOUR.PURPLE,
      user: null,
      player: new Player(game, COLOUR.PURPLE),
      isMod: false,
    },
    {
      teamColour: COLOUR.PINK,
      user: null,
      player: new Player(game, COLOUR.PINK),
      isMod: false,
    },
    {
      teamColour: COLOUR.RED,
      user: null,
      player: new Player(game, COLOUR.RED),
      isMod: false,
    },
    {
      teamColour: COLOUR.BLUE,
      user: null,
      player: new Player(game, COLOUR.BLUE),
      isMod: false,
    },
    {
      teamColour: COLOUR.GREEN,
      user: null,
      player: new Player(game, COLOUR.GREEN),
      isMod: false,
    },
    {
      teamColour: COLOUR.YELLOW,
      user: null,
      player: new Player(game, COLOUR.YELLOW),
      isMod: false,
    },
  ];
};
