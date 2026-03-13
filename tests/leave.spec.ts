import { test, expect } from "../src/fixtures";

test.describe("Leave", () => {
  test("should load Assign Leave page", async ({
    authenticatedPage,
    leavePage,
  }) => {
    await leavePage.navigate();
    const isLoaded = await leavePage.isLoaded();
    expect(isLoaded).toBe(true);
  });

  test("should show employee name input on Assign Leave page", async ({
    authenticatedPage,
    leavePage,
    page,
  }) => {
    await leavePage.navigate();
    expect(page.url()).toContain("assignLeave");
  });
});
