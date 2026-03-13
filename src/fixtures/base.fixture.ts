import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/auth/LoginPage";
import { DashBoardPage } from "../pages/auth/DashboardPage";
import { PimPage } from "../pages/pim/PimPage";
import { LeavePage } from "../pages/leave/LeavePage";
import { users } from "../data/users";

// ── Fixture Type Definitions ──────────────────────────────────────────────────

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashBoardPage;
  pimPage: PimPage;
  leavePage: LeavePage;
};

type AuthFixtures = {
  authenticatedPage: void; // performs login, returns nothing
};

type AllFixtures = PageFixtures & AuthFixtures;

// ── Fixture Implementations ───────────────────────────────────────────────────

export const test = base.extend<AllFixtures>({
  // Page Object Fixtures — instantiate and inject page classes
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashBoardPage(page));
  },

  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },

  leavePage: async ({ page }, use) => {
    await use(new LeavePage(page));
  },

  // Auth Fixture — navigates to login page, logs in as admin
  // Tests that use this fixture start already authenticated
  authenticatedPage: async ({ page, loginPage }, use) => {
    // SETUP — runs before every test that requests this fixture
    await loginPage.navigate();
    await loginPage.login(users.admin.username, users.admin.password);
    await page.waitForURL("**/dashboard/index");

    // Hand control to the test
    await use();

    // TEARDOWN — runs after every test, even on failure
    await loginPage.logout();
  },
});
