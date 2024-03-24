import { expect, test } from '@playwright/test';

test.describe('Endpoints Presets suite', () => {
  test('Endpoints Suite', async ({ page }) => {
    const baseURL = 'http://localhost:3080/';
    const timeout = 5000;
    const endpointName = 'ChatGPT OpenAI';

    await page.goto(baseURL, { timeout });

    // Click on the new conversation menu
    await page.getByTestId('new-conversation-menu').click();

    // Click on the desired endpoint item
    const endpointItem = page.getByRole('menuitemradio', { name: endpointName });
    await endpointItem.click();

    // Check if the active class is set on the selected endpoint
    expect(await endpointItem.getAttribute('class')).toContain('active');

    // Clean up by clicking on the new conversation menu again
    await page.getByTestId('new-conversation-menu').click();
  });
});
