import useLogOut from "@/hooks/useLogOut";
import { fetchApi } from "@/lib/fetchApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import { ItemTypes, LetterBlock } from "@types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import TileIcon from "@/components/TileIcon";
import { letterPoints } from "../../../../functions/src/lib/letterPoints";
import { ChallengeWordSchemaType } from "../../../../functions/src/endpoints/challengeWord";
import { Button } from "@/components/ui/button";
import { SwordsIcon } from "lucide-react";
import { useGameplayUIContext } from "../GameplayUIContextProvider";
import { motion } from "framer-motion";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";

const MotionButton = motion(Button);
interface SelectLettersToWagerPopover {
  wordId: string;
}

export default function SelectLettersToWagerPopover({
  wordId,
}: SelectLettersToWagerPopover) {
  const { getCurrentItems } = useGameplayUIContext();
  const [letterBlocks, setLetterBlocks] = useState<LetterBlock[]>([]);
  const [letterSelection, setLetterSelection] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [isChallenged, setIsChallenged] = useState(false);
  const { logOutOnError } = useLogOut();
  const { callUnityFunction } = useUnityReactContext();

  const getLettersOnStand = async () => {
    const { currentItems } = await getCurrentItems();
    Object.keys(currentItems).forEach((key) => {
      currentItems[key].itemData = JSON.parse(currentItems[key].itemData);
    });

    const letterBlocksArr = Object.values(currentItems).filter(
      (e) =>
        (e.type as ItemTypes) === ItemTypes.LetterBlock &&
        e.standOrder !== undefined,
    );

    letterBlocksArr.sort((a, b) => a.standOrder! - b.standOrder!);
    setLetterBlocks(letterBlocksArr as LetterBlock[]);
  };

  const handleSubmit = async () => {
    setOpen(false);
    setIsChallenged(true);

    const wageredLetters = letterSelection
      .map((index) => letterBlocks[parseInt(index)])
      .reduce<Record<string, LetterBlock>>((obj, current) => {
        obj[current.itemId] = current;
        return obj;
      }, {});

    const data: ChallengeWordSchemaType = {
      wordId,
      wageredLetters,
    };

    await fetchApi("challengeWord", data).catch((error) => {
      logOutOnError(error);
    });

    Object.keys(wageredLetters).forEach((itemId) => {
      callUnityFunction("SelectWageredLetters", itemId);
    });
  };

  return (
    <SelectLettersToWagerPopoverContent
      letterSelection={letterSelection}
      setLetterSelection={setLetterSelection}
      letterBlocks={letterBlocks}
      handleSubmit={handleSubmit}
      open={open}
      setOpen={setOpen}
    >
      <PopoverTrigger asChild>
        <MotionButton
          layout
          transition={{ duration: 0.3, type: "spring" }}
          disabled={isChallenged}
          className="px-2"
          onClick={async () => getLettersOnStand()}
        >
          <SwordsIcon />
        </MotionButton>
      </PopoverTrigger>
    </SelectLettersToWagerPopoverContent>
  );
}

interface SelectLettersToWagerPopoverContent {
  letterSelection: string[];
  setLetterSelection: React.Dispatch<React.SetStateAction<string[]>>;
  letterBlocks: LetterBlock[];
  handleSubmit: () => Promise<void>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export function SelectLettersToWagerPopoverContent({
  letterSelection,
  setLetterSelection,
  letterBlocks,
  handleSubmit,
  open,
  setOpen,
  children,
}: SelectLettersToWagerPopoverContent) {
  const getPointsFromSelection = () => {
    const letter = (index: string) =>
      letterBlocks[parseInt(index)].itemData.letter;

    const totalPoints = letterSelection
      .map((index) => {
        if (!(letter(index) in letterPoints)) {
          return 0;
        }
        return letterPoints[letter(index)];
      })
      .reduce((a, b) => a + b, 0);

    return totalPoints;
  };

  return (
    <Popover open={open} onOpenChange={(open) => {
      if (open) {
        setLetterSelection([])
      }
      setOpen(open);
    }}>
      {children}
      <PopoverContent className="flex flex-col gap-2 p-3 w-auto">
        <ToggleGroup type="multiple" onValueChange={setLetterSelection}>
          {letterBlocks.map((e, i) => {
            return (
              <ToggleGroupItem
                value={i.toString()}
                key={i}
                className="hover:bg-primary/30 data-[state=on]:bg-primary p-0"
              >
                <TileIcon letter={e.itemData.letter} showPoints />
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
        <Button
          className={letterBlocks.length > 4 ? "w-full" : "w-[12rem]"}
          disabled={letterSelection.length === 0}
          onClick={handleSubmit}
        >
          {letterSelection.length === 0 ? (
            "Select letters to wager"
          ) : (
            <>
              Wager&nbsp;
              <span className="font-bold">{getPointsFromSelection()}</span>
              &nbsp;{getPointsFromSelection() === 1 ? "point" : "points"}
            </>
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
