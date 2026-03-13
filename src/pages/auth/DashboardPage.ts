import { Page, Locator } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class DashBoardPage extends BasePage {
  private readonly dashboardHeader: Locator;
  private readonly timeAtWorkWidget: Locator;
  private readonly timeAtWorkWidgetPunchedOutTime: Locator;
  private readonly myActionsWidget: Locator;
  private readonly quickLaunchWidget: Locator;
  private readonly assignLeaveButton: Locator;
  private readonly myLeaveButton: Locator;
  private readonly buzzLatestPosts: Locator;

  constructor(protected readonly page: Page) {
    super(page);
    this.dashboardHeader = page.getByRole("heading", { name: "Dashboard" });
    this.timeAtWorkWidget = page.locator(".orangehrm-dashboard-widget").filter({
      has: page.locator("p", { hasText: "Time at Work" }),
    });
    this.timeAtWorkWidgetPunchedOutTime = page.locator(
      "p.oxd-text.oxd-text--p.orangehrm-attendance-card-details",
    );
    this.myActionsWidget = page.locator(".orangehrm-dashboard-widget").filter({
      has: page.locator("p", { hasText: "My Actions" }),
    });
    this.quickLaunchWidget = page
      .locator(".orangehrm-dashboard-widget")
      .filter({
        has: page.locator("p", { hasText: "Quick Launch" }),
      });

    this.buzzLatestPosts = page
      .locator(".orangehrm-dashboard-widget")
      .filter({
        has: page.locator("p", {
          hasText: "Buzz Latest Posts",
        }),
      })
      .locator(".orangehrm-dashboard-widget-body");
    this.assignLeaveButton = page.getByTitle("Assign Leave");
    this.myLeaveButton = page.getByTitle("Leave List");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/dashboard/index");
  }

  async clickAssignLeave(): Promise<void> {
    await this.assignLeaveButton.click();
    await this.page.waitForURL("**/assignLeave");
  }

  async clickMyLeave(): Promise<void> {
    await this.myLeaveButton.click();
    await this.page.waitForURL("**/viewMyLeaveList");
  }

  async hoverAssignLeave(): Promise<void> {
    await this.assignLeaveButton.hover();
  }

  async getAssignLeaveBorderColor(): Promise<string> {
    await this.assignLeaveButton.first().hover();
    return await this.assignLeaveButton
      .first()
      .evaluate((el) => window.getComputedStyle(el).borderColor);
  }

  async getLastBuzzPostText(): Promise<string> {
    await this.buzzLatestPosts.last().scrollIntoViewIfNeeded();
    const text = (await this.buzzLatestPosts.last().textContent()) ?? "";
    console.log("Last Buzz Post:", text);

    return text;
  }

  async scrollIntoBuzzLatestPosts(): Promise<void> {
    await this.buzzLatestPosts.evaluate((el) => el.scroll(0, el.scrollHeight));
  }

  async isLoaded(): Promise<boolean> {
    return await this.dashboardHeader.isVisible();
  }

  async isTimeAtWorkWidgetVisible(): Promise<boolean> {
    return await this.timeAtWorkWidget.isVisible();
  }
}
