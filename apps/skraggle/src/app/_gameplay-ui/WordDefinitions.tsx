import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import panelStyles from "@styles/panel.module.css";
import { cn } from "@/lib/tailwindUtils";
import { useEffect, useRef, useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { onValue, ref } from "firebase/database";
import { rtdb } from "../firebaseConfig";
import {
  urbanDictionaryDefinitionSchema,
  UrbanDictionaryDefinition,
} from "@schemas/urbanDictionaryDefinitionSchema";
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

export default function WordDefinitions() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { splashScreenComplete } = useUnityReactContext();
  const containerRef = useRef<HTMLDivElement>(null!);
  const { firstTurnPassed } = useSelector(
    (state: RootState) => state.turnState,
  );
  const [definitions, setDefinitions] = useState<UrbanDictionaryDefinition[]>(
    [],
  );
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
      const data = urbanDictionaryDefinitionSchema
        .array()
        .parse(snapshot.val());

      setDefinitions(data);
      setOpen(true);
    });

    return () => unsubscribe();
  }, [gameId, firstTurnPassed, splashScreenComplete]);

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
                    "pointer-events-auto absolute top-4 z-20 w-[36rem] border-none p-4 text-white",
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
                  <Accordion type="single" collapsible>
                    {definitions.map((e, i) => {
                      return (
                        <AccordionItem
                          value={e.word}
                          key={i}
                          className="drop-shadow-dark"
                        >
                          <AccordionTrigger className="outline-none">
                            {e.word}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div>{e.definition}</div>
                            <div>{e.example}</div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                  <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
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
