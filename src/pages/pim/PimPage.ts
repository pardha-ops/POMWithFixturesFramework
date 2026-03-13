import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class PimPage extends BasePage {
  readonly columnHeaderFirstName: Locator;
  readonly columnHeaderLastName: Locator;
  readonly columnHeaderJobTitle: Locator;
  readonly employeeIdInput: Locator;
  private readonly resetButton: Locator;
  private readonly recordsFoundSpan: Locator;
  private readonly employeeTable: Locator;

  constructor(protected readonly page: Page) {
    super(page);
    this.columnHeaderFirstName = page.getByRole("columnheader", {
      name: "First (& Middle) Name",
    });
    this.columnHeaderLastName = page.getByRole("columnheader", {
      name: "Last Name",
    });
    this.columnHeaderJobTitle = page.getByRole("columnheader", {
      name: "Job Title",
    });
    this.employeeIdInput = page.locator(
      "input[placeholder='Type Employee Id']",
    );
    this.resetButton = page.getByRole("button", { name: "Reset" });
    this.recordsFoundSpan = page.locator("span.oxd-text--span", {
      hasText: /Record/,
    });
    this.employeeTable = page.locator(".oxd-table");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/pim/viewEmployeeList");
    await this.page.waitForURL("**/viewEmployeeList");
  }

  async isLoaded(): Promise<boolean> {
    await this.employeeTable.waitFor({ state: "visible" });
    return this.employeeTable.isVisible();
  }

  async getRecordsFoundCount(): Promise<number> {
    await this.recordsFoundSpan.waitFor({ state: "visible" });
    const text = (await this.recordsFoundSpan.textContent()) ?? "";
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async resetSearch(): Promise<void> {
    await this.resetButton.click();
    await this.waitForSpinnerToDisappear();
  }
}
