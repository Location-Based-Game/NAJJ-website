import { useGameplayUIContext } from "./GameplayUIContextProvider";
import { Button } from "@/components/ui/button";
import { SwordsIcon } from "lucide-react";
import WordItem from "./_your-turn/WordItem";
import { ChallengeWordType } from "@schemas/challengeWordSchema";
import { cn } from "@/lib/tailwindUtils";

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
        <Button className="px-2">
          <SwordsIcon />
        </Button>
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
