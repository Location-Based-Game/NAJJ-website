import { test, expect } from "@playwright/test";
import { CreatePlayerContexts } from "./utils/createPlayerContexts";

test.describe("nav breadcrumb mobile", () => {
  test.beforeEach(() => {
    test.setTimeout(120000);
  });

  test.use({
    viewport: { width: 412, height: 915 },
  });

  test('go to "Sign In to Create" then go to home', async ({ browser }) => {
    const { playerPages } = await CreatePlayerContexts(1, browser);
    const p1 = playerPages[0];

    const headerLocator = p1.locator("header");
    const homeBreadCrumb = headerLocator.getByText("Home");
    await expect(homeBreadCrumb).toBeVisible();
    await p1.getByRole("button", { name: "Create Game" }).click();

    const signInToCreateBreadCrumb =
      headerLocator.getByText("Sign In to Create");
    await expect(signInToCreateBreadCrumb).toBeVisible();
    const ellipsis = headerLocator.getByLabel("Toggle menu");
    await expect(ellipsis).toBeVisible();
    await ellipsis.click();

    //check if tapping outside of dropdown closes it
    const homeMenuItem = p1.getByRole("menuitem", { name: "Home" });
    await expect(homeMenuItem).toBeVisible();
    await p1.locator("html").click();
    await expect(homeMenuItem).toBeHidden();

    await ellipsis.click();
    await expect(homeMenuItem).toBeVisible();
    await homeMenuItem.click();
    await expect(ellipsis).toBeHidden();
    await expect(signInToCreateBreadCrumb).toBeHidden();
  });

  test('go to "Create Game" then go to home', async ({ browser }) => {
    const { playerPages } = await CreatePlayerContexts(1, browser);
    const p1 = playerPages[0];

    const headerLocator = p1.locator("header");
    const homeBreadCrumb = headerLocator.getByText("Home");
    await expect(homeBreadCrumb).toBeVisible();
    await p1.getByRole("button", { name: "Create Game" }).click();
    const ellipsis = headerLocator.getByLabel("Toggle menu");
    await expect(ellipsis).toBeVisible();

    //Sign in page
    const hostName = "host-player";
    await p1.getByPlaceholder("name").fill(hostName);
    await p1.getByRole("button", { name: "Continue" }).click();

    //Create game page
    const code1 = await p1.locator("#join-code").textContent();
    const createGameBreadCrumb = headerLocator.getByText("Create Game");
    await expect(createGameBreadCrumb).toBeVisible();
    await ellipsis.click();
    const homeMenuItem = p1.getByRole("menuitem", { name: "Home" });
    const signInToCreateMenuItem = p1.getByRole("menuitem", { name: "Sign In to Create" });
    await Promise.all([
        expect(homeMenuItem).toBeVisible(),
        expect(signInToCreateMenuItem).toBeVisible()
    ])
    await homeMenuItem.click()

    //Leave game dialogue appears - leave
    await expect(p1.getByLabel("Leave Game?")).toBeVisible();
    await p1.getByRole("button", { name: "Leave" }).click();
    await expect(p1.getByLabel("Leave Game?")).toBeHidden();

    //Return to home page
    await Promise.all([
      expect(createGameBreadCrumb).toBeHidden(),
      expect(ellipsis).toBeHidden(),
      expect(homeBreadCrumb).toBeVisible(),
    ]);

    //check if the two codes that were generated are deleted
    await p1.getByRole("button", { name: "Join Game" }).click();
    await p1.getByLabel("Enter Join Code").fill(code1!);
    await p1.getByRole("button", { name: "Continue" }).click();
    await expect(p1.getByText("Invalid Code!")).toBeVisible();
  });
});
