import { Browser, Page } from "@playwright/test";

export async function CreatePlayerContexts(
    playerAmount: number,
    browser: Browser,
  ) {
    const contextsArr = [];
    for (let i = 0; i < playerAmount; i++) {
      contextsArr.push(browser.newContext());
    }
    const playerContexts = await Promise.all(contextsArr);
    const playerPages: Page[] = await Promise.all(
      playerContexts.map((context) => context.newPage()),
    );
  
    await Promise.all(
      playerPages.map((page) => page.goto("http://localhost:3000")),
    );
  
    return { playerContexts, playerPages };
  }
  