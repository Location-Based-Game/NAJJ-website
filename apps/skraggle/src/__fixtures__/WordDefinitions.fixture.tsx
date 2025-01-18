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
          definition: "Test definition 1",
          author: "",
          word: "Test Word 1",
          example: "Booyeah",
          isRealWord: true,
        },
        {
          definition: "Test definition 2",
          author: "",
          word: "Test Word 2",
          example: "",
          isRealWord: true,
        },
        {
          definition: "",
          author: "",
          word: "Test Word 3",
          example: "",
          isRealWord: false,
        },
      ]}
    />
  );
};
