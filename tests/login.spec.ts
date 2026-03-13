import { test, expect } from "../src/fixtures";

test.describe("Login", () => {
  test("should login successfully with valid credentials", async ({
    loginPage,
    page,
  }) => {
    await loginPage.navigate();
    await loginPage.login("admin", "admin123");
    await page.waitForURL("**/dashboard/index");
    expect(page.url()).toContain("dashboard");
  });

  test("should show error with invalid credentials", async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login("invalid", "invalid123");
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Invalid credentials");
  });

  test("should navigate to login page", async ({ loginPage }) => {
    await loginPage.navigate();
    const isOnLoginPage = await loginPage.isOnLoginPage();
    expect(isOnLoginPage).toBe(true);
  });

  test("should logout successfully", async ({
    authenticatedPage,
    loginPage,
    page,
  }) => {
    // authenticatedPage fixture already logged in
    await loginPage.logout();
    expect(page.url()).toContain("/auth/login");
  });
});
