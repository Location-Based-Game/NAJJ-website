import { letterPoints } from "../../shared/letterPoints";
import styles from "./tileIcon.module.css";

interface TileIcon {
  letter: string;
  showPoints?: boolean;
}

export default function TileIcon({ letter, showPoints = false }: TileIcon) {
  letter = letter.toUpperCase();
  if (letter === "_") letter = " "
  
  return (
    <div className={styles.tileIcon}>
      <span className="z-[2] text-lg font-black text-black">{letter}</span>
      <span className="absolute translate-x-[-1px] translate-y-[-1px] text-lg font-black text-gray-200">
        {letter}
      </span>
      {showPoints && (
        <span className="absolute inline-block top-3 right-[2px] text-[0.5rem] text-black text-left">
          {letterPoints[letter]}
        </span>
      )}
    </div>
  );
}