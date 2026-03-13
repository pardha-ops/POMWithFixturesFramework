import { test, expect } from "../src/fixtures";

test.describe("PIM", () => {
  test("should load PIM employee list", async ({
    authenticatedPage,
    pimPage,
  }) => {
    await pimPage.navigate();
    const isLoaded = await pimPage.isLoaded();
    expect(isLoaded).toBe(true);
  });

  test("should show records found count", async ({
    authenticatedPage,
    pimPage,
  }) => {
    await pimPage.navigate();
    const count = await pimPage.getRecordsFoundCount();
    expect(count).toBeGreaterThan(0);
  });

  test("should display employee table headers", async ({
    authenticatedPage,
    pimPage,
    page,
  }) => {
    await pimPage.navigate();
    await expect(pimPage.columnHeaderFirstName).toBeVisible();
    await expect(pimPage.columnHeaderLastName).toBeVisible();
    await expect(pimPage.columnHeaderJobTitle).toBeVisible();
  });

  test("should reset search filters", async ({
    authenticatedPage,
    pimPage,
  }) => {
    await pimPage.navigate();
    await pimPage.employeeIdInput.fill("001");
    await pimPage.resetSearch();
    const value = await pimPage.employeeIdInput.inputValue();
    expect(value).toBe("");
  });
});
