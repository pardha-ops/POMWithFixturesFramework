import { test, expect, Page, Locator } from "@playwright/test";

export abstract class BasePage {
  protected readonly toast: Locator;
  protected readonly spinner: Locator;

  constructor(protected readonly page: Page) {
    this.page = page;
    this.toast = page.locator(".oxd-toast-content");
    this.spinner = page.locator(".oxd-loading-spinner");
  }

  async waitForToastMessage() {
    await this.toast.waitFor({ state: "visible" });
  }
  async waitForSpinnerToDisappear() {
    await this.spinner.waitFor({ state: "hidden" });
  }

  async getToastMessage(): Promise<string> {
    await this.toast.waitFor({
      state: "visible",
    });
    return (await this.toast.textContent()) ?? "";
  }
  async waitForToastToDisappear() {
    await this.toast.waitFor({ state: "hidden" }).catch(() => {});
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
