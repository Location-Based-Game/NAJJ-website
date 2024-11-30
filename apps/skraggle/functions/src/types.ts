export type GameStates = "Menu" | "TurnsDiceRoll" | "Gameplay"

export type GameRoom = {
  id: string;
  gameState: GameStates;
  players: PlayersData;
  currentTurn: number;
};

export enum ItemTypes {
  StartingDice,
  LetterBlock,
}

export type ItemType<T> = {
  type: ItemTypes;
  data: T;
};
export type Inventory = Record<string, ItemType<any>>;
export type Inventories = Record<string, Inventory>;

export type PlayerData = {
  name: string;
  color: string;
  turn: number;
};

export type PlayersData = Record<string, PlayerData>;