const { test, expect } = require('@playwright/test');
const fs = require('fs'); // Also add this if you're using readFileSync
const { printToast } = require('../utils/toast');

test('Approval by Internal Employee', async ({ page }) => {
    const passId = fs.readFileSync('pass-id.txt', 'utf-8');
    await page.goto('https://staging.gateease.in/');
  
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill('divya.m@company.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Mintern@123');
    await page.getByRole('button', { name: 'Sign-in' }).click();
  
    await page.locator('div').filter({ hasText: /^Approval Queue$/ }).click();
    await page.getByText('VISITORAPPOINTMENTPARTY').click();
    await page.locator('div').filter({ hasText: /^APPOINTMENT$/ }).click();
    await page.locator('(//tbody/tr)[2]/td[7]/button[1]').click();
    await page.getByText('Select Type').click();
    await page.getByText('Approve').click();
    await page.getByRole('textbox', { name: 'Comments' }).fill('Approved by automation');
    await page.getByRole('button', { name: 'Update' }).click();
    await printToast(page);
  });