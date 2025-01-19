import { test, expect, Page, Browser } from "@playwright/test";
import { CreatePlayerContexts } from "./utils/createPlayerContexts";

test.describe("nav breadcrumb desktop", () => {
  test.beforeEach(() => {
    test.setTimeout(120000);
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
    await headerLocator.getByRole("button", { name: "Home" }).click();
    await expect(signInToCreateBreadCrumb).toBeHidden();
  });

  test('go to "Create Game" then go to home', async ({ browser }) => {
    const { playerPages } = await CreatePlayerContexts(1, browser);
    const p1 = playerPages[0];

    const headerLocator = p1.locator("header");
    const homeBreadCrumb = headerLocator.getByText("Home");
    await expect(homeBreadCrumb).toBeVisible();
    await p1.getByRole("button", { name: "Create Game" }).click();

    //Sign in page
    const signInToCreateBreadCrumb =
      headerLocator.getByText("Sign In to Create");
    await expect(signInToCreateBreadCrumb).toBeVisible();
    await expect(
      headerLocator.getByRole("button", { name: "Home" }),
    ).toBeVisible();
    const hostName = "host-player";
    await p1.getByPlaceholder("name").fill(hostName);
    await p1.getByRole("button", { name: "Continue" }).click();

    //Create game page first time
    const code1 = await p1.locator("#join-code").textContent();
    const createGameBreadCrumb = headerLocator.getByText("Create Game");
    await expect(createGameBreadCrumb).toBeVisible();
    await expect(signInToCreateBreadCrumb).toBeVisible();
    await signInToCreateBreadCrumb.click();

    //Leave game dialogue appears - cancel and reopen
    await expect(p1.getByLabel("Leave Game?")).toBeVisible();
    await p1.getByRole("button", { name: "Cancel" }).click();
    await expect(p1.getByLabel("Leave Game?")).toBeHidden();
    await signInToCreateBreadCrumb.click();

    //Leave game dialogue appears - leave
    await expect(p1.getByLabel("Leave Game?")).toBeVisible();
    await p1.getByRole("button", { name: "Leave" }).click();
    await expect(p1.getByLabel("Leave Game?")).toBeHidden();
    await expect(createGameBreadCrumb).toBeHidden();

    //Return to sign in page
    await expect(p1.getByPlaceholder("name")).toBeVisible();
    await p1.getByPlaceholder("name").click();
    await p1.getByPlaceholder("name").fill(hostName);
    await p1.getByRole("button", { name: "Continue" }).click();

    //Create game page second time
    const code2 = await p1.locator("#join-code").textContent();
    await Promise.all([
      expect(createGameBreadCrumb).toBeVisible(),
      expect(signInToCreateBreadCrumb).toBeVisible(),
      expect(homeBreadCrumb).toBeVisible(),
    ]);
    await homeBreadCrumb.click();

    //Leave game dialogue appears - leave
    await expect(p1.getByLabel("Leave Game?")).toBeVisible();
    await p1.getByRole("button", { name: "Leave" }).click();
    await expect(p1.getByLabel("Leave Game?")).toBeHidden();
    await expect(createGameBreadCrumb).toBeHidden();

    //Return to home page
    await Promise.all([
      expect(createGameBreadCrumb).toBeHidden(),
      expect(signInToCreateBreadCrumb).toBeHidden(),
      expect(homeBreadCrumb).toBeVisible(),
    ]);

    //check if the two codes that were generated are deleted
    await p1.getByRole("button", { name: "Join Game" }).click();
    await p1.getByLabel("Enter Join Code").fill(code1!);
    await p1.getByRole("button", { name: "Continue" }).click();
    await expect(p1.getByText("Invalid Code!")).toBeVisible();
    await homeBreadCrumb.click();
    await p1.getByRole("button", { name: "Join Game" }).click();
    await p1.getByLabel("Enter Join Code").fill(code2!);
    await p1.getByRole("button", { name: "Continue" }).click();
    await expect(p1.getByText("Invalid Code!")).toBeVisible();
  });
});