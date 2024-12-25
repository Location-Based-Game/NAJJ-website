import type { Item } from "./schemas/itemSchema";

export type GameStates = "Menu" | "TurnsDiceRoll" | "FirstTurn" | "Gameplay";

export type GameRoom = {
  id: string;
  gameState: GameStates;
  players: PlayersData;
  inventories: Inventories;
  grid: Inventory;
  currentTurn: number;
};

export enum ItemTypes {
  StartingDice,
  LetterBlock,
}

export type StartingDice = Item<{ diceValue: number; playerAmount: number }>;

export type Inventory = Record<string, Item<any>>;
export type Inventories = Record<string, Inventory>;

export type PlayerData = {
  name: string;
  color: string;
  turn: number;
  isOnline: boolean;
};

export type PlayersData = Record<string, PlayerData>;

export enum TileType
{
    Blank,
    DoubleLetterScore,
    TripleLetterScore,
    DoubleWordScore,
    TripleWordScore,
    CenterStart
}