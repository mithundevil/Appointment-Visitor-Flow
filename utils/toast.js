import { expect } from '@playwright/test';

export async function printToast(page) {
  const toastLocator = page.locator('.Toastify__toast-body');
  await expect(toastLocator.first()).toBeVisible({ timeout: 10000 });
  const toastMessage = await toastLocator.first().textContent();
  console.log('Toast Message:', toastMessage);
}
