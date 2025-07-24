import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const fakeVideoPath = path.resolve(__dirname, '../fake-video.y4m');
const pdfFilePath = path.resolve(__dirname, '../Attendance_Jun_2025.pdf');
const { printToast } = require('../utils/toast');

// Configuration for camera
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

test('Visitor Registration and Pass ID Capture', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://staging.gateease.in/');

  // Login
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill('visitormaster@gmail.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Mintern@123');
  await page.getByRole('button', { name: 'Sign-in' }).click();

  // Navigate and fill form (same as your full logic)
  // Navigation
  await page.locator('div').filter({ hasText: /^Visitor Management$/ }).click();
  await page.getByRole('main').locator('div').filter({ hasText: 'APPOINTMENT' }).nth(2).click();
  await page.getByRole('button', { name: 'Add' }).click();

  // Fill Form
  await page.getByRole('textbox', { name: 'Name' }).fill('Rakesh');
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('+91 78465-128462');
  await page.getByRole('textbox', { name: 'Email' }).fill('rakedfdf@gmail.com');
  await page.getByRole('textbox', { name: 'Address' }).fill('Kodaiiii');
  await page.getByRole('textbox', { name: 'Zip Code' }).fill('629801');
  await page.getByRole('textbox', { name: 'Organization' }).fill('party 1');
  await page.getByRole('textbox', { name: 'Appointment Date' }).fill('2025-07-24');
  await page.getByRole('textbox', { name: 'Entry Time' }).fill('12:10');
  await page.getByRole('textbox', { name: 'Exit Time' }).fill('12:15');
  await page.setInputFiles('input[type="file"]', pdfFilePath);
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Next' }).click();

  // Internal employee
  await page.getByRole('textbox', { name: 'Department' }).click();
  await page.locator('.overflow-y-auto.custom-scrollbar > div:nth-child(2)').first().click();
  await page.getByRole('textbox', { name: 'Type to Filter' }).click();
  await page.getByText('V. Aravind (EMP2034)').click();
  await page.getByText('Select Type').click();
  await page.getByText('Meeting').click();
  await page.getByRole('spinbutton', { name: 'Person Accompanying' }).fill('2');
  await page.getByRole('textbox', { name: 'Vehicle Number' }).fill('TN47S5645');
  await page.getByRole('textbox', { name: 'Material Details' }).fill('Raw material');
  await page.getByRole('textbox', { name: 'Purpose' }).fill('Meeting with HR for project');
  await page.getByRole('button', { name: 'Next' }).click();

  // Approval section
  await page.getByRole('textbox', { name: 'Department' }).click();
  await page.locator('div').filter({ hasText: /^HR$/ }).click();
  await page.getByRole('textbox', { name: 'Approver' }).click();
  await page.getByText('M. DivyaHR Assistant').click();
  await page.getByRole('textbox', { name: 'Premise In Gate' }).click();
  await page.locator('div').filter({ hasText: /^Main Gate Entry$/ }).first().click();
  await page.getByRole('textbox', { name: 'Select Type' }).click();
  await page.getByText('Main Gate Entry').nth(1).click();
  await page.getByRole('button', { name: 'Next' }).click()
  
  await page.getByRole('button', { name: 'Submit' }).click();
  await printToast(page);

  // Capture Pass ID
  const passIdLocator = page.locator('text=/APP\\d{3,}/').first();
  await passIdLocator.waitFor({ state: 'visible', timeout: 15000 });
  const passIdText = await passIdLocator.textContent();
  const match = passIdText?.match(/APP\d{3,}/);
  const passId = match ? match[0] : 'UNKNOWN';
  fs.writeFileSync('pass-id.txt', passId);
  console.log('✅ Pass ID:', passId);
});