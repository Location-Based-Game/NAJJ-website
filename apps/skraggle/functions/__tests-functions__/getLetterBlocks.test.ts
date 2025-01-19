import { Inventory, ItemTypes } from "../../types";
import { getLetterBlocks } from "../src/lib/getLetterBlocks";

describe("getLetterBlocks function", () => {
  test("gets 7 letter blocks from empty inventory and items have the right data", () => {
    const inventory = getLetterBlocks({}, "testPlayerId") as Inventory;
    expect(Object.keys(inventory).length).toBe(7);
    expect(
      Object.values(inventory).every((item) => {
        return (
          item.playerId === "testPlayerId" &&
          item.type === ItemTypes.LetterBlock &&
          !item.isPlaced &&
          item.gridPosition.length === 0 &&
          !item.isDestroyed
        );
      }),
    ).toBeTruthy();

    expect(
      Object.values(inventory).every((item) => {
        return (
          "letter" in item.itemData && typeof item.itemData.letter === "string"
        );
      }),
    ).toBeTruthy();
  });

  test("gets 7 letter blocks from inventory with non letter blocks", () => {
    const inventory = getLetterBlocks(
      {
        someDice: {
          itemData: {},
          playerId: "testPlayerId",
          itemId: "dice 1",
          type: ItemTypes.StartingDice,
          isPlaced: false,
          gridPosition: [],
          isDestroyed: false,
        },
      },
      "testPlayerId",
    );
    expect(Object.keys(inventory).length).toBe(7);
  });

  test("gets 6 letter blocks from inventory with 1 letter block", () => {
    const inventory = getLetterBlocks(
      {
        letterBlock: {
          itemData: {},
          playerId: "testPlayerId",
          itemId: "test letter block",
          type: ItemTypes.LetterBlock,
          isPlaced: false,
          gridPosition: [],
          isDestroyed: false,
        },
      },
      "testPlayerId",
    );
    expect(Object.keys(inventory).length).toBe(6);
  });

  test("gets 0 letter blocks from inventory with 7 letter blocks", () => {
    const letterBlockData = {
      itemData: {},
      playerId: "testPlayerId",
      itemId: "test letter block",
      type: ItemTypes.LetterBlock,
      isPlaced: false,
      gridPosition: [],
      isDestroyed: false,
    };

    const inventory = getLetterBlocks(
      {
        letterBlock1: letterBlockData,
        letterBlock2: letterBlockData,
        letterBlock3: letterBlockData,
        letterBlock4: letterBlockData,
        letterBlock5: letterBlockData,
        letterBlock6: letterBlockData,
        letterBlock7: letterBlockData,
      },
      "testPlayerId",
    );
    expect(Object.keys(inventory).length).toBe(0);
  });
});
