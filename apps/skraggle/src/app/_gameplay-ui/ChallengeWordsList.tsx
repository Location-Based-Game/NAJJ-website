import { useGameplayUIContext } from "./GameplayUIContextProvider";
import { Button } from "@/components/ui/button";
import { SwordsIcon } from "lucide-react";
import WordItem from "./_your-turn/WordItem";
import { ChallengeWordType } from "@schemas/challengeWordSchema";
import { cn } from "@/lib/tailwindUtils";
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
import { letterPoints } from "@/lib/letterPoints";

interface ChallengeWordsList {
  showChallengeButton: boolean;
}

export default function ChallengeWordsList({
  showChallengeButton,
}: ChallengeWordsList) {
  const { challengeWords } = useGameplayUIContext();
  const challengeWordItem = (key: number, wordData: ChallengeWordType) => (
    <div
      key={key}
      className={cn(
        "flex w-full items-center justify-end gap-2",
        showChallengeButton ? "justify-end" : "justify-center",
      )}
    >
      <WordItem wordData={wordData} />
      {showChallengeButton && <SelectLettersToWagerPopover />}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {Object.values(challengeWords).map((wordData, i) => {
        return challengeWordItem(i, wordData);
      })}
    </div>
  );
}

function SelectLettersToWagerPopover() {
  const { getCurrentItems } = useGameplayUIContext();
  const [letterBlocks, setLetterBlocks] = useState<LetterBlock[]>([]);
  const [letterSelection, setLetterSelection] = useState<string[]>([]);

  const getPointsFromSelection = () => {
    const letter = (index: string) =>
      letterBlocks[parseInt(index)].itemData.letter;

    const totalPoints = letterSelection
      .map((index) => letterPoints[letter(index)])
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="px-2" onClick={async () => getLettersOnStand()}>
          <SwordsIcon />
        </Button>
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
        <Button className="w-full" disabled={letterSelection.length === 0}>
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
