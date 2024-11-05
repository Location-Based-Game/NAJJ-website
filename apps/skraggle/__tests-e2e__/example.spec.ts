import { test, expect, Page } from "@playwright/test";

test("Skraggle with different sessions", async ({ browser }) => {
  test.setTimeout(120000);

  const playerContexts = await Promise.all([
    browser.newContext(),
    browser.newContext(),
    browser.newContext(),
    browser.newContext(),
    browser.newContext()
  ])

  const playerPages:Page[] = await Promise.all(playerContexts.map(context => context.newPage()))

  await Promise.all(playerPages.map(page => page.goto("http://localhost:3000")))
  const p1 = playerPages[0]

  const hostName = "host player"
  await expect(
    p1.getByRole("button", { name: "Create Game" }),
  ).toBeVisible();
  await p1.getByRole("button", { name: "Create Game" }).click();
  await expect(p1.getByPlaceholder("name")).toBeVisible();
  await p1.getByPlaceholder("name").fill(hostName);
  await p1.getByRole("button", { name: "Continue" }).click();

  await Promise.all([
    expect(p1.getByText("join code")).toBeVisible(),
    expect(p1.getByRole("cell", { name: hostName })).toBeVisible(),
    expect(p1.locator("#react-qrcode-logo")).toBeVisible()
  ])

  const code = await p1.locator("#join-code").textContent();
  const [, ...otherPlayers] = playerPages
  await Promise.all(otherPlayers.map((page, index) => SignInOtherPlayer(page, index)))

  async function SignInOtherPlayer(page: Page, index: number) {
    const playerName = `player ${index}`
    await page.getByRole("button", { name: "Join Game" }).click();
    await expect(page.getByLabel("Enter Join Code")).toBeVisible();
    await page.getByLabel("Enter Join Code").fill(code!);
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByPlaceholder("name").fill(playerName);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("cell", { name: playerName })).toBeVisible();
    await expect(page.getByRole("cell", { name: hostName })).toBeVisible();
  }

  await p1.getByRole("button", { name: "Start" }).click();
  await expect(p1.getByRole("button", { name: "Start" })).toBeHidden({timeout: 20000});
  await Promise.all(otherPlayers.map((page) => {
    expect(page.getByRole("button", { name: "Ready!" })).toBeHidden({timeout: 20000});
  }))

  for (let i = 0; i < playerPages.length; i++) {
    await PlaceDice(playerPages[i]);
  }

  async function PlaceDice(page: Page) {
    await page.mouse.move(605, 658, {steps: 15});
    await page.mouse.down();
  
    await page.mouse.move(589, 315, {steps: 15});
    await page.mouse.up();
  
    await page.mouse.move(671, 654, {steps: 15});
    await page.mouse.down();
  
    await page.mouse.move(687, 319, {steps: 15});
    await page.mouse.up();
  }
});
