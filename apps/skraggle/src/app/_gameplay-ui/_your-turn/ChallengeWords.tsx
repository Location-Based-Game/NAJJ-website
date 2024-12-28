import { ChallengeWordType } from "@schemas/challengeWordSchema";
import { useGameplayUIContext } from "../GameplayUIContextProvider";
import { Button } from "@/components/ui/button";
import { SwordsIcon } from "lucide-react";
import WordItem from "./WordItem";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/fetchApi";
import useLogOut from "@/hooks/useLogOut";

export default function ChallengeWords() {
  const { challengeWords, getCurrentItems } = useGameplayUIContext();
  const { logOutOnError } = useLogOut();

  const handleChallengeTimeout = async () => {
    const { currentItems } = await getCurrentItems();
    await fetchApi("endTurnGetNewLetters", { currentItems }).catch((error) => {
      logOutOnError(error);
    });
  };

  return (
    <div className="absolute top-4 flex flex-col items-center gap-2">
      <div className="relative overflow-hidden rounded-md bg-secondary px-3 py-2 text-secondary-foreground">
        <motion.div
          className="absolute bottom-0 right-0 h-full w-full origin-left bg-[#d4d4d4]"
          animate={{ scaleX: 0 }}
          transition={{ duration: 10, ease: "linear" }}
          onAnimationComplete={handleChallengeTimeout}
        />
        <span className="animate-pulse text-gray-600">
          Waiting for challengers
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        {Object.values(challengeWords).map((wordData, i) => {
          return <ChallengeItem key={i} wordData={wordData} />;
        })}
      </div>
    </div>
  );
}

function ChallengeItem({ wordData }: { wordData: ChallengeWordType }) {
  return (
    <div className="flex w-full items-center justify-end gap-2">
      <WordItem wordData={wordData} />
      <Button className="px-2">
        <SwordsIcon />
      </Button>
    </div>
  );
}
