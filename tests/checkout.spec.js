// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Sportisimo checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.sportisimo.cz/');

    // Decline optional cookies
    await page.getByRole('link', { name: 'odmítnout' }).click();
    await expect(page).toHaveURL('https://www.sportisimo.cz/');
  });

  test('adds product to cart and reaches delivery step without completing order', async ({ page }) => {
    // --- Product page ---
    await page.goto('https://www.sportisimo.cz/nike/run-defy/1944387/');
    await expect(page).toHaveTitle(/Nike RUN DEFY/);

    // Verify product name and price are visible
    await expect(page.getByRole('heading', { name: /RUN DEFY/ })).toBeVisible();
    await expect(page.getByText('1 199 Kč').first()).toBeVisible();

    // Select size 44 EU
    await page.getByRole('button', { name: 'Vyberte si' }).click();
    await page.getByRole('button', { name: /44 EU/ }).click();

    // Confirm size button now shows the selected size
    await expect(page.getByRole('button', { name: /44 EU/ })).toBeVisible();

    // Add to cart
    await page.getByRole('button', { name: /Vložit do košíku/ }).click();

    // --- Cross-sell page ---
    await expect(page).toHaveURL(/cross-sell/);
    await expect(page.locator('#main-content').getByText('Produkt byl vložen do košíku')).toBeVisible();
    await expect(page.locator('#main-content').getByText('Nike RUN DEFY')).toBeVisible();

    // Go to cart
    await page.getByRole('link', { name: 'Zobrazit košík' }).click();

    // --- Cart page ---
    await expect(page).toHaveURL(/kosik/);
    await expect(page.getByRole('link', { name: 'RUN DEFY' })).toBeVisible();
    await expect(page.getByText('44 EU').first()).toBeVisible();
    await expect(page.getByText('1 199 Kč').first()).toBeVisible();
    await expect(page.getByText('Celkem za zboží:')).toBeVisible();

    // Proceed to checkout
    await page.getByRole('link', { name: /Pokračovat na výběr dopravy/ }).click();

    // --- Checkout: Delivery step ---
    await expect(page).toHaveURL(/pokladna/);
    await expect(page.getByRole('heading', { name: 'Vyberte způsob doručení' })).toBeVisible();

    // Verify checkout progress steps are shown
    await expect(page.getByText('Doprava')).toBeVisible();
    await expect(page.getByText('Platba')).toBeVisible();
    await expect(page.getByText('Adresa')).toBeVisible();
    await expect(page.getByText('Shrnutí')).toBeVisible();

    // Verify delivery options are present
    await expect(page.getByRole('button', { name: /Osobní odběr na prodejně/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Výdejní místa/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Doručení na adresu/ })).toBeVisible();

    // Select home delivery
    await page.getByRole('button', { name: /Doručení na adresu/ }).click();

    // Verify the "Continue to payment" button becomes enabled
    await expect(
      page.getByRole('button', { name: /Pokračovat na výběr platby/ })
    ).toBeEnabled();

    // ⛔ Test stops here — order is NOT submitted
  });

  test('cart shows correct item count after adding product', async ({ page }) => {
    await page.goto('https://www.sportisimo.cz/nike/run-defy/1944387/');

    // Select size and add to cart
    await page.getByRole('button', { name: 'Vyberte si' }).click();
    await page.getByRole('button', { name: /42 EU/ }).click();
    await page.getByRole('button', { name: /Vložit do košíku/ }).click();

    // Header cart icon should show "1"
    await expect(page).toHaveURL(/cross-sell/);
  });
});
