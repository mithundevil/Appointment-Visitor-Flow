const { test, expect } = require('@playwright/test');
const fs = require('fs'); // Also add this if you're using readFileSync
const { printToast } = require('../utils/toast');
const { logoutAndLogin } = require('../utils/auth');

const path = require('path');
const fakeVideoPath = path.resolve(__dirname, '../fake-video.y4m');

test.use({
  permissions: ['camera'],
  launchOptions: {
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      `--use-file-for-fake-video-capture=${fakeVideoPath}`,
    ],
  },
});


test('Scan, Punch In, Punch Out, Premise Out', async ({ page }) => {
  test.setTimeout(120000);
    const passId = fs.readFileSync('pass-id.txt', 'utf-8');
  
    // Scan (Meena)
    await page.goto('https://staging.gateease.in/');
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('meena.a@company.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Mintern@123');
    await page.getByRole('button', { name: 'Sign-in' }).click();
  
    await page.locator('rect').nth(2).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Enter Pass ID' }).fill(passId);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Turn On' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Capture' }).click();
    await page.getByRole('button', { name: 'Premise In' }).click();
    await printToast(page);
    await page.waitForTimeout(3000);
  
    // Punch In (Kumar)
    await logoutAndLogin(page, 'kumar.r@company.com');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Enter Pass ID' }).fill(passId);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Punch In' }).click();
    await printToast(page);
  
    // Punch Out (Kumar)
    await logoutAndLogin(page, 'kumar.r@company.com');
    await page.locator('rect').nth(1).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Enter Pass ID' }).fill(passId);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Punch Out' }).click();
    await page.getByText('Select Type').click();
    await page.getByText('Main Gate Entry').click();
    await page.getByRole('textbox', { name: 'Purpose' }).fill('Leaving premises');
    await page.getByRole('button', { name: 'Punch out', exact: true }).click();
    await printToast(page);
  
    // Premise Out (Meena)
    await logoutAndLogin(page, 'meena.a@company.com');
    await page.locator('rect').nth(1).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Enter Pass ID' }).fill(passId);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Premise Out' }).click();
    await printToast(page);
  });