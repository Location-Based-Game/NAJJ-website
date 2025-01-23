import { Loader2 } from "lucide-react";
import styles from "@styles/panel.module.css";

export default function Rejoining() {
  return (
    <div className={styles.darkenedBackground}>
      <div className="flex animate-pulse items-center text-white">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <h2 className="text-lg">Rejoining Game...</h2>
      </div>
    </div>
  );
}
