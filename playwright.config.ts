import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 0,
  workers: 1,
  reporter: "html",
  use: {
    launchOptions: {
      args: ["--disable-features=PasswordProtectionWarningTrigger"],
    },
    baseURL: "https://opensource-demo.orangehrmlive.com",
    extraHTTPHeaders: {
      Accept: "application/json",
    },
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
