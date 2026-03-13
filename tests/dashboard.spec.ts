import { test, expect } from "../src/fixtures";

test.describe("Dashboard", () => {
  test("should load dashboard after login", async ({
    authenticatedPage,
    dashboardPage,
  }) => {
    const isLoaded = await dashboardPage.isLoaded();
    expect(isLoaded).toBe(true);
  });

  test("should show Time at Work widget", async ({
    authenticatedPage,
    dashboardPage,
  }) => {
    const isVisible = await dashboardPage.isTimeAtWorkWidgetVisible();
    expect(isVisible).toBe(true);
  });

  test("should navigate to Assign Leave from dashboard", async ({
    authenticatedPage,
    dashboardPage,
    page,
  }) => {
    await dashboardPage.clickAssignLeave();
    expect(page.url()).toContain("assignLeave");
  });

  test("should navigate to My Leave from dashboard", async ({
    authenticatedPage,
    dashboardPage,
    page,
  }) => {
    await dashboardPage.clickMyLeave();
    expect(page.url()).toContain("viewMyLeaveList");
  });
});
