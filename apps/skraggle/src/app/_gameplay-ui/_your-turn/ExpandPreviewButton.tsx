import { useUnityReactContext } from "@/app/UnityPlayer";
import { Button } from "@/components/ui/button";

export default function ExpandPreviewButton() {
  const { sendMessage } = useUnityReactContext();

  return (
    <Button
      variant="ghost"
      onClick={() => {
        sendMessage("Receiver", "ExpandPreview");
      }}
      className="pointer-events-auto absolute right-[2vw] top-4 h-[17vh] w-[17vw] hover:bg-accent/20"
    ></Button>
  );
}
