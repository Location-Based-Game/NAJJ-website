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
import { CurrentItemsType } from "@schemas/currentItemsSchema";
import { ItemTypes, LetterBlock } from "@types";

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
      {showChallengeButton && (
        <SelectLettersToWagerPopover />
      )}
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

  const getLettersOnStand = async () => {
    const { currentItems } = await getCurrentItems();
    Object.keys(currentItems).forEach(key => {
      currentItems[key].itemData = JSON.parse(currentItems[key].itemData);
    })

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
      <PopoverContent className="flex flex-col gap-2">
        <div className="flex gap-4">
          {letterBlocks.map((e, i) => {
            return <Button key={i}>{e.itemData.letter}</Button>;
          })}
        </div>
        <Button>Wager</Button>
      </PopoverContent>
    </Popover>
  );
}
