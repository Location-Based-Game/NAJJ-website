import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { Button } from "@/components/ui/button";
import { useGameplayUIContext } from "../GameplayUIContextProvider";

export default function ExpandPreviewButton() {
  const { sendMessage } = useUnityReactContext();
  const { showExpandPreviewButton, setShowExpandPreviewButton } =
    useGameplayUIContext();

  return (
    <Button
      variant="ghost"
      onClick={() => {
        sendMessage("Receiver", "ExpandPreview");
        setShowExpandPreviewButton(false);
      }}
      disabled={!showExpandPreviewButton}
      className="pointer-events-auto absolute right-[2%] top-[2%] h-[17%] w-[17%] transition-opacity hover:bg-accent/20 disabled:opacity-0"
    ></Button>
  );
}
