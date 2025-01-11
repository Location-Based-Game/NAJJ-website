import { Inventory, ItemTypes, LetterBlock } from "../types";
import { v4 as uuidv4 } from "uuid";

const letters =
  "AAAAABBCCDDDDEEEEEEFFFGGGGHHHIIIIIIJJKKLLLLMMMNNNOOOOOOPPPQRRRRRRSSSSSSTTTTTUUUUUVVWWXYYYZ___".split(
    "",
  );

export function getLetterBlocks(currentItems: Inventory, playerId: string) {
  const letterBlocks: Record<string, LetterBlock> = {};
  const lettersOnStandCount = Object.values(currentItems).filter((item) => {
    if (item.type !== ItemTypes.LetterBlock) return false;
    //check if letter is on grid
    return !item.isPlaced;
  }).length;

  //give letterBlocks for every letter that is not placed on grid
  for (let i = 0; i < 7 - lettersOnStandCount; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    const randomLetter = letters[randomIndex];
    const itemId = `${randomLetter}-${uuidv4()}`;
    letterBlocks[itemId] = {
      itemData: { letter: randomLetter },
      playerId,
      itemId,
      type: ItemTypes.LetterBlock,
      isPlaced: false,
      gridPosition: [],
      isDestroyed: false
    };
  }

  return letterBlocks;
}
