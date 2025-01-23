import { useGameplayUIContext } from "../GameplayUIContextProvider";
import WordItem from "../_your-turn/WordItem";
import { ChallengeWordType } from "@schemas/challengerSchema";
import { cn } from "@/lib/tailwindUtils";
import SelectLettersToWagerPopover from "./SelectLettersToWagerPopover";
import ChallengerList from "./ChallengerList";

interface ChallengeWordsList {
  showChallengeButton: boolean;
}

export default function ChallengeWordsList({
  showChallengeButton,
}: ChallengeWordsList) {
  const { challengeWords } = useGameplayUIContext();

  const challengeWordItem = (wordId: string, wordData: ChallengeWordType) => (
    <div
      key={wordId}
      className={cn(
        "flex w-full items-center justify-end gap-2",
        showChallengeButton ? "justify-end" : "justify-center",
      )}
    >
      <WordItem wordData={wordData} hasExitAnimation={false} />
      {showChallengeButton && <SelectLettersToWagerPopover wordId={wordId} />}
      <ChallengerList wordData={wordData} />
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {Object.entries(challengeWords).map(([wordId, wordData]) => {
        return challengeWordItem(wordId, wordData);
      })}
    </div>
  );
}
