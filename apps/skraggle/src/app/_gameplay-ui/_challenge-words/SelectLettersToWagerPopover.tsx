import useLogOut from "@/hooks/useLogOut";
import { fetchApi } from "@/lib/fetchApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
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
  const { callUnityFunction } = useUnityReactContext()

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

    const wageredItems = letterSelection
      .map((index) => letterBlocks[parseInt(index)])
      .reduce<Record<string, LetterBlock>>((obj, current) => {
        obj[current.itemId] = current;
        return obj;
      }, {});

    const data: ChallengeWordSchemaType = {
      wordId,
      wageredItems,
    };

    await fetchApi("challengeWord", data).catch((error) => {
      logOutOnError(error);
    });

    Object.keys(wageredItems).forEach(itemId => {      
      callUnityFunction("SelectWageredLetters", itemId)
    })
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
      <PopoverContent className="flex flex-col gap-2 p-2">
        <ToggleGroup type="multiple" onValueChange={setLetterSelection}>
          {letterBlocks.map((e, i) => {
            return (
              <ToggleGroupItem
                value={i.toString()}
                key={i}
                className="p-2 hover:bg-primary/30 data-[state=on]:bg-primary"
              >
                <TileIcon letter={e.itemData.letter} showPoints />
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
        <Button
          className="w-full"
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
