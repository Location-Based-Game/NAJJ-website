import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Skraggle - Play Online for Free!/);
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('button', { name: 'Create Game' })).toBeVisible();
  await page.getByRole('button', { name: 'Create Game' }).click();
  await expect(page.getByPlaceholder('name')).toBeVisible();
  await page.getByPlaceholder('name').click();
  await page.getByPlaceholder('name').fill('hsef');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('join code')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'hsef' })).toBeVisible();
  await expect(page.locator('#react-qrcode-logo')).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();
});

test('Skraggle with different sessions', async ({ browser }) => {
  // Create two separate browser contexts for different sessions
  const player1Context = await browser.newContext();
  const player2Context = await browser.newContext();

  // Open a new page for each player
  const player1Page = await player1Context.newPage();
  const player2Page = await player2Context.newPage();

  // Navigate both players to the game URL
  await player1Page.goto('http://localhost:3000');
  await player2Page.goto('http://localhost:3000');

  await expect(player1Page.getByRole('button', { name: 'Create Game' })).toBeVisible();
  await player1Page.getByRole('button', { name: 'Create Game' }).click();
  await expect(player1Page.getByPlaceholder('name')).toBeVisible();
  await player1Page.getByPlaceholder('name').click();
  await player1Page.getByPlaceholder('name').fill('hsef');
  await player1Page.getByRole('button', { name: 'Continue' }).click();
  await expect(player1Page.getByText('join code')).toBeVisible();
  await expect(player1Page.getByRole('cell', { name: 'hsef' })).toBeVisible();
  await expect(player1Page.locator('#react-qrcode-logo')).toBeVisible();
  const code = await player1Page.locator('#join-code').textContent();

  await player2Page.getByRole('button', { name: 'Join Game' }).click();
  await expect(player2Page.getByLabel('Enter Join Code')).toBeVisible();
  await player2Page.getByLabel('Enter Join Code').click();
  await player2Page.getByLabel('Enter Join Code').fill(code!);
  await player2Page.getByRole('button', { name: 'Continue' }).click();
  await player2Page.getByPlaceholder('name').click();
  await player2Page.getByPlaceholder('name').fill('hi');
  await player2Page.getByRole('button', { name: 'Continue' }).click();
  await player2Page.getByRole('cell', { name: 'hi' }).click();
  await expect(player2Page.getByRole('cell', { name: 'hi' })).toBeVisible();
  await expect(player2Page.getByRole('cell', { name: 'hsef' })).toBeVisible();
})