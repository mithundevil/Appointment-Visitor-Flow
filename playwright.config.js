import { defineConfig } from '@playwright/test';
export default {
  reporter: [['html', { open: 'never' }]], // or 'on', 'never', 'always'
    testDir: './tests',
    retries: 0,
    workers: 4,
    use: {
      headless: false,
      baseURL: 'https://staging.gateease.in',
      screenshot:"on",
      video:"on",
      trace:"on"
    },
  };
  