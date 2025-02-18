import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/tailwindUtils";
import { RootState } from "@/store/store";
import { WordData } from "@schemas/wordDataSchema";
import { TileType } from "@types";
import { motion, AnimatePresence, MotionProps } from "framer-motion";
import { Star } from "lucide-react";
import { forwardRef, HTMLAttributes } from "react";
import { useSelector } from "react-redux";

const doubleLetterColor = "bg-[#72B2B9]";
const tripleLetterColor = "bg-[#435196]";
const doubleWordColor = "bg-[#E85A5A]";
const tripleWordColor = "bg-[#F38B23]";

type WordItem = HTMLAttributes<HTMLDivElement> & {
  wordData: WordData;
  showBonusPoints?: boolean;
  hasExitAnimation?: boolean;
};

export default function WordItem({
  wordData,
  showBonusPoints = false,
  hasExitAnimation = true,
  ...props
}: WordItem) {
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
      layout={!showBonusPoints}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={hasExitAnimation ? { opacity: 0, y: 20 } : {}}
      transition={{ layout: { duration: 0.3, type: "spring" } }}
      className={cn("flex gap-2", props.className)}
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
      {showBonusPoints && (
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
      )}
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
          "whitespace-nowrap rounded-full py-1 pl-2 pr-3 text-xs font-light text-white",
          backgroundColor,
        )}
      >
        {label}
      </motion.div>
    );
  },
);

BonusPoints.displayName = "BonusPoints";
