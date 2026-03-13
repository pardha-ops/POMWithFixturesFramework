import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { users } from "../../data/users";

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly welcomeOkButton: Locator;
  private readonly userDropdown: Locator;
  private readonly logOutButton: Locator;
  private readonly errorMessage: Locator;
  constructor(protected readonly page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.welcomeOkButton = page.getByRole("button", { name: "OK" });
    this.userDropdown = page.locator("p.oxd-userdropdown-name");
    this.logOutButton = page.getByText("Logout");
    this.errorMessage = page.getByText("Invalid credentials");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/auth/login");
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsAdmin(): Promise<void> {
    await this.login(users.admin.username, users.admin.password);
    await this.page.waitForURL("**/dashboard/index");
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logOutButton.click();
    await this.page.waitForURL("**/auth/login");
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({
      state: "visible",
    });
    return (await this.errorMessage.textContent()) ?? "";
  }

  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes("/auth/login");
  }
}
