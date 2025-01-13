"use client";
import { WordDefinitionsView } from "@/app/_gameplay-ui/WordDefinitions";
import { useState } from "react";

export default () => {
  const [open, setOpen] = useState(true);
  return (
    <WordDefinitionsView
      open={open}
      setOpen={setOpen}
      definitions={[
        {
          definition: "Test definition",
          author: "",
          word: "Test Word",
          example: "Booyeah",
          isRealWord: false,
        },
      ]}
    />
  );
};
