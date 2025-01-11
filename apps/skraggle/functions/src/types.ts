import { ChallengeWordsRecord } from "./schemas/challengeWordSchema";
import type { Item } from "./schemas/itemSchema";

export type GameStates = "Menu" | "TurnsDiceRoll" | "FirstTurn" | "Gameplay";

export type GameRoom = {
  id: string;
  gameState: GameStates;
  players: PlayersData;
  inventories: Inventories;
  grid: Inventory;
  currentTurn: number;
  challengeWords?: {
    words: ChallengeWordsRecord;
    placedLetters: Inventory
  }
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
  points: number;
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

export type LetterBlock = Item<{ letter: string }>;
