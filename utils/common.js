import fs from 'fs/promises';

export async function login(page, email, password) {
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
  await page.getByRole('button', { name: 'Sign-in' }).click();
}

export async function savePassId(id) {
  await fs.writeFile('data/pass-id.txt', id, 'utf8');
}

export async function readPassId() {
  return (await fs.readFile('data/pass-id.txt', 'utf8')).trim();
}
