import { Button } from "@/components/ui/button";
import { useUnityReactContext } from "../UnityPlayer";

export default function YourTurnUI() {
  const { sendMessage } = useUnityReactContext();

  return (
    <>
      <Button
        onClick={() => {
          sendMessage("Receiver", "EndTurn");
        }}
        className="absolute top-4"
      >
        End Turn
      </Button>
      <button
        onClick={() => {
          sendMessage("Receiver", "ExpandPreview");
        }}
        className="pointer-events-auto absolute right-[2vw] top-4 h-[17vh] w-[17vw]"
      ></button>
    </>
  );
}
