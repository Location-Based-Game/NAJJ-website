import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import panelStyles from "@styles/panel.module.css";
import { cn } from "@/lib/tailwindUtils";
import React, { useEffect, useRef, useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { onValue, ref } from "firebase/database";
import { rtdb } from "../firebaseConfig";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  WordDefinition,
  wordDefinitionSchema,
} from "@schemas/wordDefinitionSchema";

export default function WordDefinitions() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { splashScreenComplete } = useUnityReactContext();
  const { firstTurnPassed } = useSelector(
    (state: RootState) => state.turnState,
  );
  const [definitions, setDefinitions] = useState<WordDefinition[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!gameId) return;
    if (!firstTurnPassed) return;
    if (!splashScreenComplete) return;

    const currentDefinitionsRef = ref(
      rtdb,
      `activeGames/${gameId}/currentDefinitions`,
    );
    const unsubscribe = onValue(currentDefinitionsRef, (snapshot) => {
      if (!firstTurnPassed) return;

      if (!snapshot.exists()) return;
      const data = wordDefinitionSchema.array().safeParse(snapshot.val());
      if (!data.success) return;
      setDefinitions(data.data);
      setOpen(true);
    });

    return () => unsubscribe();
  }, [gameId, firstTurnPassed, splashScreenComplete]);

  return (
    <WordDefinitionsView
      open={open}
      setOpen={setOpen}
      definitions={definitions}
    />
  );
}

interface WordDefinitionsView {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  definitions: WordDefinition[];
}

export function WordDefinitionsView({
  open,
  setOpen,
  definitions,
}: WordDefinitionsView) {
  const containerRef = useRef<HTMLDivElement>(null!);
  return (
    <>
      <div
        className="absolute flex h-full w-full justify-center"
        ref={containerRef}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <DialogPortal container={containerRef.current} forceMount>
              <DialogContent asChild>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className={cn(
                    "pointer-events-auto absolute top-4 z-20 w-full border-none text-white sm:w-[36rem]",
                    panelStyles.woodBorder,
                  )}
                >
                  <VisuallyHidden>
                    <DialogTitle>Definitions</DialogTitle>
                  </VisuallyHidden>
                  <VisuallyHidden>
                    <DialogDescription>List of Definitions</DialogDescription>
                  </VisuallyHidden>
                  <div className={panelStyles.woodBackground}></div>
                  <Accordion
                    type="single"
                    className={panelStyles.darkenedBackground}
                    collapsible
                  >
                    <Definitions definitions={definitions} />
                  </Accordion>
                  <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <Cross2Icon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </motion.div>
              </DialogContent>
            </DialogPortal>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  );
}

function Definitions({ definitions }: { definitions: WordDefinition[] }) {
  const removeBrackets = (string: string) => {
    return string.replaceAll("[", "").replaceAll("]", "");
  };

  return definitions.map((e, i) => {
    if (!e.definition) {
      return (
        <div
          key={i}
          className="flex flex-1 flex-wrap items-center gap-1 py-4 pl-[3.25rem] pr-5 outline-none transition-all"
        >
          <div className="mr-4 text-left text-xl font-bold text-sidebar-foreground">
            {e.word}
          </div>
          <div className="rounded-md bg-black/20 px-2 py-1 text-sm text-gray-400">
            NOT A REAL WORD
          </div>
        </div>
      );
    }

    return (
      <AccordionItem value={e.word} key={i} className={"drop-shadow-dark"}>
        <AccordionTrigger className="px-5 text-xl font-bold text-sidebar-foreground outline-none">
          {e.word}
        </AccordionTrigger>
        <AccordionContent className="text-md relative px-[3.25rem] py-5 before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-full before:bg-[#310f0246] before:mix-blend-multiply">
          <div className="text-xs text-white/50">DEFINITION</div>
          <div>{removeBrackets(e.definition)}</div>
          {e.example && (
            <>
              <div className="mt-3 text-xs text-white/50">EXAMPLE</div>
              <div>{removeBrackets(e.example)}</div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    );
  });
}
