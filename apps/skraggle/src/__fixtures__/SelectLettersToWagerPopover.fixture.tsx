"use client";

import { SelectLettersToWagerPopoverContent } from "@/app/_gameplay-ui/_challenge-words/SelectLettersToWagerPopover";
import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import { ItemTypes } from "@types";
import { useState } from "react";

export default () => {
  const [letterSelection, setLetterSelection] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <SelectLettersToWagerPopoverContent
      letterSelection={letterSelection}
      setLetterSelection={setLetterSelection}
      letterBlocks={[
        {
          itemData: { letter: "Y" },
          playerId: "testPlayer",
          itemId: "",
          type: ItemTypes.LetterBlock,
          isPlaced: false,
          gridPosition: [],
          standOrder: 0,
          isDestroyed: false,
        },
      ]}
      handleSubmit={async () => {}}
      open={open}
      setOpen={setOpen}
    >
      <div className="w-full flex justify-center mt-2">
        <PopoverTrigger asChild>
          <Button>Wager Letters</Button>
        </PopoverTrigger>
      </div>
    </SelectLettersToWagerPopoverContent>
  );
};
