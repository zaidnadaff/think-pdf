// tests/auth.test.js
// At the top of your test file
jest.setTimeout(30000); // Set timeout to 30 seconds
const request = require("supertest");
const jwt = require("jsonwebtoken");
const sequelize = require("../app/config/db.config.js");
const { User, RefreshToken } = require("../app/models");
const app = require("../server.js"); // Make sure to export app from server.js

// Sample user for testing
const testUser = {
  email: "test@example.com",
  password: "password123",
};

let accessToken;
let refreshToken;

// Setup and teardown
beforeAll(async () => {
  console.log("Starting database connection...");
  try {
    console.log("Authenticating...");
    await sequelize.authenticate();
    console.log("Authentication successful");

    console.log("Syncing database...");
    await sequelize.sync({ force: true });
    console.log("Database sync complete");
  } catch (error) {
    console.error("Database setup failed:", error);
    throw error;
  }
});

afterAll(async () => {
  // Close database connection after tests
  await sequelize.close();
});

describe("Authentication System", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully"
      );

      // Check if user exists in database
      const user = await User.findOne({ where: { email: testUser.email } });
      expect(user).not.toBeNull();
    });

    it("should not register a user with existing email", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "User already exists");
    });

    it("should not register a user without email or password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "incomplete@example.com" });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        "message",
        "Please provide email and password"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login and return tokens", async () => {
      const res = await request(app).post("/api/auth/login").send(testUser);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(res.body).toHaveProperty("expiresIn");

      // Save tokens for later tests
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;

      // Verify that refresh token is stored in database
      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });
      expect(storedToken).not.toBeNull();
    });

    it("should not login with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("Protected Routes", () => {
    it("should access protected route with valid token", async () => {
      const res = await request(app)
        .get("/api/protected")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "This is a protected route");
      expect(res.body).toHaveProperty("user");
    });

    it("should not access protected route without token", async () => {
      const res = await request(app).get("/api/protected");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty(
        "message",
        "No token, authorization denied"
      );
    });

    it("should not access protected route with invalid token", async () => {
      const res = await request(app)
        .get("/api/protected")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("message", "Token is not valid");
    });

    it("should get current user profile", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("email", testUser.email);
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    it("should refresh access token with valid refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh-token")
        .send({ refreshToken });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("expiresIn");

      // Update access token for future tests
      accessToken = res.body.accessToken;
    });

    it("should not refresh with invalid refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh-token")
        .send({ refreshToken: "invalidrefreshtoken" });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout and invalidate refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .send({ refreshToken });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Logged out successfully");

      // Verify refresh token is removed from database
      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });
      expect(storedToken).toBeNull();
    });
  });
});
