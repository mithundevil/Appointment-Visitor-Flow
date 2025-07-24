export async function logoutAndLogin(page, email) {
  if (page.isClosed()) {
    console.warn('Page is already closed. Skipping logout.');
    return;
  }

  try {
    console.log('Opening menu to find Logout...');

    // Wait and click the profile/menu link
    const menuLink = page.getByRole('link');
    await menuLink.waitFor({ state: 'visible', timeout: 5000 });
    await menuLink.click();

    // Wait and click Logout
    const logoutBtn = page.getByRole('button', { name: 'Logout' });
    await logoutBtn.waitFor({ state: 'visible', timeout: 5000 });
    await logoutBtn.click();

    console.log('Logged out successfully.');
  } catch (err) {
    console.error('Logout failed:', err.message);
    if (!page.isClosed()) {
      await page.screenshot({ path: 'logout-error.png' });
    }
    throw err;
  }

  // Re-login
  if (!page.isClosed()) {
    await page.getByRole('textbox', { name: 'Enter your email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Mintern@123');
    await page.getByRole('button', { name: 'Sign-in' }).click();
  } else {
    console.warn('Page is closed. Cannot re-login.');
  }
}
