import { useValidatedWordContext } from "./YourTurnUI";
import { AnimatePresence } from "framer-motion";
import WordItem from "./WordItem";

export default function CurrentTurnWordsList() {
  const { wordsData } = useValidatedWordContext();
  return (
    <div className="absolute left-4 top-4 flex flex-col gap-2">
      <AnimatePresence>
        {Object.values(wordsData).map((data, i) => {
          return <WordItem key={i} wordData={data} showBonusPoints />;
        })}
      </AnimatePresence>
    </div>
  );
}
