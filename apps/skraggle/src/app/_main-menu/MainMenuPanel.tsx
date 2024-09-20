import MainButtons from "./MainButtons";

interface MainMenuPanel {
  setPlayGame: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MainMenuPanel() {
  return (
    <div className="pointer-events-auto z-10 flex h-[34rem] w-[24rem] flex-col items-center justify-center gap-4 rounded-lg bg-gray-900 bg-opacity-80 px-8 backdrop-blur-lg">
      <MainButtons />
    </div>
  );
}
