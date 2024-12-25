import { Separator } from "@/components/ui/separator";
import { useValidatedWordContext } from "./YourTurnUI";

export default function CurrentTurnWordsList() {
  const { wordsData } = useValidatedWordContext();
  return (
    <div className="absolute left-4 top-4 flex flex-col gap-2">
      {wordsData.map((data, i) => {
        return (
          <div
            key={i}
            className="inline-flex h-9 w-fit items-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm text-secondary-foreground transition-colors"
          >
            <span className="font-normal">{data.word}</span>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <span className="font-bold">{data.score}</span>
          </div>
        );
      })}
    </div>
  );
}
