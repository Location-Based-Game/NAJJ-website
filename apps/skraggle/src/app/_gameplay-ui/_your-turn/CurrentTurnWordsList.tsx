import { Separator } from "@/components/ui/separator";
import { useValidatedWordContext } from "./YourTurnUI";
import { motion, AnimatePresence, MotionProps } from "framer-motion";
import { TileType } from "@types";
import { cn } from "@/lib/tailwindUtils";
import { Star } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { forwardRef } from "react";
import { WordData } from "@schemas/wordDataSchema";

export default function CurrentTurnWordsList() {
  const { wordsData } = useValidatedWordContext();
  return (
    <div className="absolute left-4 top-4 flex flex-col gap-2">
      <AnimatePresence>
        {wordsData.map((data, i) => {
          return <WordItem key={i} wordData={data} />;
        })}
      </AnimatePresence>
    </div>
  );
}

const doubleLetterColor = "bg-[#72B2B9]";
const tripleLetterColor = "bg-[#435196]";
const doubleWordColor = "bg-[#E85A5A]";
const tripleWordColor = "bg-[#F38B23]";

function WordItem({ wordData }: { wordData: WordData }) {
  const { state } = useSelector((state: RootState) => state.gameState);

  const highestBonus = Math.max(...wordData.scoreMultipliers) as TileType;
  const getBonusColor = () => {
    switch (highestBonus) {
      case TileType.DoubleLetterScore:
        return doubleLetterColor;
      case TileType.TripleLetterScore:
        return tripleLetterColor;
      case TileType.DoubleWordScore:
        return doubleWordColor;
      case TileType.TripleWordScore:
        return tripleWordColor;
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const tripleMultiplier = wordData.scoreMultipliers.filter(
    (e) => (e as TileType) === TileType.TripleWordScore,
  ).length;
  const doubleMultiplier = wordData.scoreMultipliers.filter(
    (e) => (e as TileType) === TileType.DoubleWordScore,
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex gap-2"
    >
      <div
        className={cn(
          "relative inline-flex h-9 w-fit items-center whitespace-nowrap rounded-md px-4 py-2 text-sm text-white transition-colors",
          getBonusColor(),
        )}
      >
        {state === "FirstTurn" && (
          <div className="absolute left-[-0.5rem] flex size-6 items-center justify-center rounded-full border-[1px] border-[#e48e8e] bg-[#E85A5A]">
            <Star fill="white" size={12} className="opacity-80" />
          </div>
        )}
        <span className={cn("font-normal", state === "FirstTurn" && "ml-2")}>
          {wordData.word}
        </span>
        <Separator
          orientation="vertical"
          className={cn(
            "mx-3 h-4",
            highestBonus === 0 ? "bg-[#c4c4c4]" : "opacity-80",
          )}
        />
        <span className="font-bold">{wordData.score}</span>
      </div>
      <div className="flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {tripleMultiplier !== 0 && (
            <BonusPoints
              label={`× ${tripleMultiplier * 3}`}
              backgroundColor={tripleWordColor}
              key={0}
            />
          )}
          {doubleMultiplier !== 0 && (
            <BonusPoints
              label={`× ${doubleMultiplier * 2}`}
              backgroundColor={doubleWordColor}
              key={1}
            />
          )}
          {wordData.tripleBonus !== 0 && (
            <BonusPoints
              label={`+ ${wordData.tripleBonus}`}
              backgroundColor={tripleLetterColor}
              key={2}
            />
          )}
          {wordData.doubleBonus !== 0 && (
            <BonusPoints
              label={`+ ${wordData.doubleBonus}`}
              backgroundColor={doubleLetterColor}
              key={3}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

type BonusPoints = {
  label: string;
  backgroundColor: string;
} & React.HTMLAttributes<HTMLDivElement> &
  MotionProps;

const BonusPoints = forwardRef<HTMLDivElement, BonusPoints>(
  ({ label, backgroundColor }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, y: 15 }}
        ref={ref}
        layout
        className={cn(
          "rounded-full py-1 pl-2 pr-3 text-xs font-light text-white whitespace-nowrap",
          backgroundColor,
        )}
      >
        {label}
      </motion.div>
    );
  },
);
