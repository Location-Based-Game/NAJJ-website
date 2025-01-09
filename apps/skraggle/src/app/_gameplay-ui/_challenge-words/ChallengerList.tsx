import { ChallengeWordType } from "@schemas/challengeWordSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface ChallengerList {
  wordData: ChallengeWordType;
}

const MotionAvatar = motion(Avatar);

export default function ChallengerList({ wordData }: ChallengerList) {
  const players = useSelector((state: RootState) => state.players);

  if (wordData.challengers === undefined) return;
  return (
    <div className="flex gap-2">
      {Object.entries(wordData.challengers).map(([playerId, value]) => {
        return (
          <MotionAvatar
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={playerId}
            layout
            transition={{ duration: 0.3, type: "spring" }}
          >
            <AvatarFallback
              style={{ background: players[playerId].color }}
              className="font-bold text-white"
            >
              <span className="drop-shadow-dark">
                {players[playerId].name.substring(0, 2)}
              </span>
            </AvatarFallback>
          </MotionAvatar>
        );
      })}
    </div>
  );
}
