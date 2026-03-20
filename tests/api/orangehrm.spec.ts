import { test, expect } from "@playwright/test";

const BASE_URL = "https://opensource-demo.orangehrmlive.com";
const CREDENTIALS = {
  username: "Admin",
  password: "admin123",
};

test("POST /auth/login — returns valid token", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/web/index.php/auth/login`, {
    headers: { "Content-Type": "application/json" },
    data: CREDENTIALS,
  });
  console.log("Status:", response.status());
  console.log("Headers:", response.headers());
  console.log("Body:", await response.text());
});
