const request = require("supertest");
const server = request.agent("http://localhost:3000");
const app = require("../app");

describe("App", () => {
  describe("POST /login", () => {
    describe("Correct cookies", () => {
      it("Should log in a user", (done) => {
        const username = "jb";
        const password = "secret";
        server
          .post("/api/v1/login")
          .send({ username, password })
          .expect(200, done);
      });

      it("Should have correct cookies in the next request", (done) => {
        server.get("/api/v1/users/1").expect(200, done);
      });
      it("Should have correct cookies in the next request, but id in url is incorrect", (done) => {
        server.get("/api/v1/users/2").expect(401, done);
      });
    });

    describe("Incorrect cookies", () => {
      it("Should reject login process when password is incorrect", (done) => {
        const username = "jb";
        const password = "fake_password";
        server
          .post("/api/v1/login")
          .send({ username, password })
          .expect(401, done);
      });
    });
  });
});
