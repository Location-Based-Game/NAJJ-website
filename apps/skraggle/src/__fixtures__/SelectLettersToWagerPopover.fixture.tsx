"use client";

import { SelectLettersToWagerPopoverContent } from "@/app/_gameplay-ui/_challenge-words/SelectLettersToWagerPopover";
import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import { ItemTypes } from "@types";
import { useState } from "react";
import { useFixtureInput } from "react-cosmos/client";

export default function SelectLettersToWagerPopoverFixture() {
  const [itemAmount] = useFixtureInput("Item Amount", 1);

  const [letterSelection, setLetterSelection] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <SelectLettersToWagerPopoverContent
      letterSelection={letterSelection}
      setLetterSelection={setLetterSelection}
      letterBlocks={[...new Array(itemAmount)].map((_) => {
        return {
          itemData: { letter: "Y", isBlank: false },
          playerId: "testPlayer",
          itemId: "",
          type: ItemTypes.LetterBlock,
          isPlaced: false,
          gridPosition: [],
          standOrder: 0,
          isDestroyed: false,
        };
      })}
      handleSubmit={async () => {}}
      open={open}
      setOpen={setOpen}
    >
      <div className="mt-2 flex w-full justify-center">
        <PopoverTrigger asChild>
          <Button>Wager Letters</Button>
        </PopoverTrigger>
      </div>
    </SelectLettersToWagerPopoverContent>
  );
};
