import { test, expect } from "@playwright/test";

const BASE_URL = "https://jsonplaceholder.typicode.com";

test("GET /users/1 — returns 200 with correct user shape", async ({
  request,
}) => {
  const response = await request.get(`${BASE_URL}/users/1`);

  expect(response.status()).toBe(200);

  expect(response.headers()["content-type"]).toContain("application/json");

  const user = await response.json();
  expect(user).toHaveProperty("id", 1);
  expect(user).toHaveProperty("name");
  expect(user).toHaveProperty("email");
  expect(user).toHaveProperty("address");
  expect(user.address).toHaveProperty("city");
});

test("GET /users — returns array of 10 users", async ({ request }) => {
  const response = await request.get(`${BASE_URL}/users`);

  expect(response.status()).toBe(200);

  const users = await response.json();
  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBe(10);

  users.forEach((user: any) => {
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email");
  });
});

// ---------------------------------------------------------------------------
// GET — query params (filter by userId)
// ---------------------------------------------------------------------------
test("GET /posts?userId=1 — returns only posts for user 1", async ({
  request,
}) => {
  const response = await request.get(`${BASE_URL}/posts`, {
    params: { userId: "1" },
  });

  expect(response.status()).toBe(200);

  const posts = await response.json();
  expect(Array.isArray(posts)).toBe(true);

  // Every post must belong to userId 1
  posts.forEach((post: any) => {
    expect(post.userId).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// POST — create
// ---------------------------------------------------------------------------
test("POST /posts — creates resource, returns 201", async ({ request }) => {
  const payload = {
    title: "GatekeeperOps API Testing",
    body: "Automating API validation with Playwright",
    userId: 1,
  };

  const response = await request.post(`${BASE_URL}/posts`, {
    data: payload,
  });

  // JSONPlaceholder returns 201 on POST
  expect(response.status()).toBe(201);

  const created = await response.json();

  // Server echoes back your payload + assigns an id
  expect(created).toHaveProperty("id");
  expect(created.title).toBe(payload.title);
  expect(created.body).toBe(payload.body);
  expect(created.userId).toBe(payload.userId);
});

// ---------------------------------------------------------------------------
// PUT — full replace
// ---------------------------------------------------------------------------
test("PUT /posts/1 — replaces resource, returns 200", async ({ request }) => {
  const payload = {
    id: 1,
    title: "Updated title",
    body: "Updated body",
    userId: 1,
  };

  const response = await request.put(`${BASE_URL}/posts/1`, {
    data: payload,
  });

  expect(response.status()).toBe(200);

  const updated = await response.json();
  expect(updated.title).toBe("Updated title");
  expect(updated.id).toBe(1);
});

// ---------------------------------------------------------------------------
// PATCH — partial update
// ---------------------------------------------------------------------------
test("PATCH /posts/1 — partial update, returns 200", async ({ request }) => {
  const response = await request.patch(`${BASE_URL}/posts/1`, {
    data: { title: "Patched title only" },
  });

  expect(response.status()).toBe(200);

  const patched = await response.json();
  expect(patched.title).toBe("Patched title only");

  // Other fields still present
  expect(patched).toHaveProperty("body");
  expect(patched).toHaveProperty("userId");
});

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------
test("DELETE /posts/1 — returns 200 with empty object", async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/posts/1`);

  expect(response.status()).toBe(200);

  // JSONPlaceholder returns {} on delete (not 204)
  const body = await response.json();
  expect(body).toEqual({});
});

// ---------------------------------------------------------------------------
// 404 — resource not found
// ---------------------------------------------------------------------------
test("GET /users/9999 — returns 404", async ({ request }) => {
  const response = await request.get(`${BASE_URL}/users/9999`);

  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// Rate limit headers present
// ---------------------------------------------------------------------------
test("GET /users/1 — rate limit headers are present", async ({ request }) => {
  const response = await request.get(`${BASE_URL}/users/1`);

  expect(response.status()).toBe(200);

  const headers = response.headers();
  expect(headers).toHaveProperty("x-ratelimit-limit");
  expect(headers).toHaveProperty("x-ratelimit-remaining");
  expect(headers).toHaveProperty("x-ratelimit-reset");
});

test("full post lifecycle — create, read, update, delete", async ({
  request,
}) => {
  // Step 1 — Create
  const createResponse = await request.post(`${BASE_URL}/posts`, {
    data: {
      title: "GatekeeperOps",
      body: "API testing with Playwright",
      userId: 1,
    },
  });
  expect(createResponse.status()).toBe(201);
  const created = await createResponse.json();
  expect(created).toHaveProperty("id");
  const postId = created.id;
  console.log("Created post id:", postId);

  // Step 2 — Read (using existing id since JSONPlaceholder doesn't persist)
  const readResponse = await request.get(`${BASE_URL}/posts/1`);
  expect(readResponse.status()).toBe(200);
  const fetched = await readResponse.json();
  expect(fetched.id).toBe(1);
  console.log("Fetched post title:", fetched.title);

  // Step 3 — Update
  const updateResponse = await request.patch(`${BASE_URL}/posts/1`, {
    data: { title: "Updated by workflow test" },
  });
  expect(updateResponse.status()).toBe(200);
  const updated = await updateResponse.json();
  expect(updated.title).toBe("Updated by workflow test");
  console.log("Updated title:", updated.title);

  // Step 4 — Delete
  const deleteResponse = await request.delete(`${BASE_URL}/posts/1`);
  expect(deleteResponse.status()).toBe(200);
  console.log("Deleted successfully");
});

// Workflow: Get all posts for a user, verify count and ownership
test("fetch all posts for user 1 — verify ownership", async ({ request }) => {
  const response = await request.get(`${BASE_URL}/posts`, {
    params: { userId: "1" },
  });

  expect(response.status()).toBe(200);

  const posts = await response.json();
  expect(posts.length).toBeGreaterThan(0);

  // Every post must belong to user 1
  posts.forEach((post: any) => {
    expect(post.userId).toBe(1);
  });

  console.log(`User 1 has ${posts.length} posts`);
});
