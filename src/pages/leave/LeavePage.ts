import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class LeavePage extends BasePage {
  private readonly leaveHeader: Locator;
  private readonly employeeNameField: Locator;
  private readonly employeeDropdown: Locator;
  private readonly employeeOptions: Locator;
  private readonly leaveTypeDropdown: Locator;
  private readonly leaveTypeOptions: Locator;
  private readonly fromDateInput: Locator;
  private readonly toDateInput: Locator;
  private readonly assignButton: Locator;
  private readonly successToast: Locator;

  constructor(protected readonly page: Page) {
    super(page);
    this.leaveHeader = page.getByRole("heading", { name: /Assign Leave/i });
    this.employeeNameField = page.getByPlaceholder("Type for hints...");
    this.employeeDropdown = page.locator(".oxd-autocomplete-dropdown");
    this.employeeOptions = page.locator(".oxd-autocomplete-option");
    this.leaveTypeDropdown = page.locator(".oxd-select-text");
    this.leaveTypeOptions = page.locator(".oxd-select-option");
    this.fromDateInput = page
      .locator(".oxd-input-group", {
        hasText: "From Date",
      })
      .getByPlaceholder("dd-mm-yyyy");
    this.toDateInput = page
      .locator(".oxd-input-group", {
        hasText: "To Date",
      })
      .getByPlaceholder("dd-mm-yyyy");
    this.assignButton = page.getByRole("button", { name: "Assign" });
    this.successToast = page.locator(".oxd-toast-content");
    this;
  }

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/leave/assignLeave");
    await this.page.waitForURL("**/assignLeave");
  }

  async selectEmployee(partialName: string): Promise<void> {
    await this.employeeNameField.fill(partialName);
    await this.employeeDropdown.waitFor({ state: "visible" });
    await this.employeeOptions
      .filter({ hasText: "Searching" })
      .waitFor({ state: "hidden" })
      .catch(() => {});
    await this.employeeOptions.first().click();
    await this.employeeDropdown.waitFor({ state: "hidden" });
  }

  async selectLeaveType(leaveType: string): Promise<void> {
    await this.leaveTypeDropdown.click();
    await this.leaveTypeOptions.first().waitFor({ state: "visible" });
    await this.leaveTypeOptions.filter({ hasText: leaveType }).first().click();
    await this.leaveTypeOptions
      .first()
      .waitFor({ state: "hidden" })
      .catch(() => {});
  }

  async setFromDate(date: string): Promise<void> {
    await this.fromDateInput.fill(date);
    await this.fromDateInput.press("Tab");
  }

  async setToDate(date: string): Promise<void> {
    await this.toDateInput.fill(date);
    await this.toDateInput.press("Tab");
  }

  async clickAssign(): Promise<void> {
    await this.assignButton.click();
  }

  async assignLeave(
    employee: string,
    leaveType: string,
    fromDate: string,
    toDate: string,
  ): Promise<void> {
    await this.selectEmployee(employee);
    await this.selectLeaveType(leaveType);
    await this.setFromDate(fromDate);
    await this.setToDate(toDate);
    await this.clickAssign();
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.employeeNameField.waitFor({
        state: "visible",
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }

  async isToastVisible(): Promise<boolean> {
    return await this.successToast.isVisible();
  }
}
