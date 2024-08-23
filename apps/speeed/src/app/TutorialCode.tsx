"use client";

import { useToast } from "@/components/ui/use-toast";
import { Suspense, useEffect, useState } from "react";
//@ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//@ts-ignore
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./speeed.module.css";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

function Code() {
  const { toast } = useToast();
  const [isClosed, setIsClosed] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const search = searchParams.get("tutorialCode");
    if (search === "hackerText") {
      setIsClosed(false);
    }
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    router.push(pathname);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      toast({
        title: "Copied to Clipboard!",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {!isClosed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`w-screen fixed h-screen flex justify-center items-center z-30 py-20`}
        >
          <div className={`${styles.tutorial} relative w-fit h-full`}>
            <div className="absolute top-6 right-8 text-gray-300 flex gap-4">
              <button
                onClick={handleCopyCode}
                className="border-[1px] bg-[#2c2c2c] transition-colors hover:bg-[#1a1a1a] border-gray-500 rounded-md px-4 py-2"
              >
                Copy Code
              </button>
              <button
                onClick={handleClose}
                className="border-[1px] bg-[#2c2c2c] transition-colors hover:bg-[#1a1a1a] border-gray-500 rounded-md px-4 py-2"
              >
                Close
              </button>
            </div>
            <SyntaxHighlighter
              showLineNumbers
              lineNumberStyle={{ opacity: "0.2" }}
              language="csharp"
              style={a11yDark}
              customStyle={{ padding: "3rem", height: "100%", overflowX: "hidden" }}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function TutorialCode() {
  return (
    <Suspense>
      <Code />
    </Suspense>
  );
}

const codeString = `using System.Collections;
using System.Text;
using TMPro;
using UnityEngine;

public class HackerText : MonoBehaviour
{
    private TextMeshProUGUI _text;
    private string _defaultText;

    void Start()
    {
        _text = GetComponent<TextMeshProUGUI>();
        _defaultText = _text.text;
    }

    private IEnumerator StartAnimation()
    {
        int letterIndex = 0;

        while (letterIndex <= _defaultText.Length)
        {
            int randomCount = 0;

            while (randomCount < 5)
            {
                _text.text = RandomizeText(_defaultText, letterIndex);
                yield return new WaitForSeconds(0.02f);
                randomCount++;
            }

            letterIndex++;
        }
    }

    private string RandomizeText(string text, int startIndex)
    {
        string randomCharacters = "ABCDEFGHJKLNOPQRSTUVXYZ234567890";

        for (int i = startIndex; i < text.Length; i++)
        {
            StringBuilder sb = new StringBuilder(text);
            sb[i] = randomCharacters[Random.Range(0, randomCharacters.Length)];
            text = sb.ToString();
        }
        return text;
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            StartCoroutine(StartAnimation());
        }
    }
}`;
