const request = require("supertest");
const { executeQuery, simpleQuery, selectByUsername } = require("../queries");
const db = require("../db");
const { tableNames, roles } = require("../config").constants;

let server;

describe("App", () => {
  describe("POST /login", () => {
    describe("Correct cookies", () => {
      server = request.agent("http://localhost:3000");

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
      server = request.agent("http://localhost:3000");

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

  describe("POST /register", () => {
    const username = "ronnie123-456-222";
    const password = "new-secret-pass";
    const email = "ronnie_adams@yandex.ru";
    const first_name = "Ronnie";
    const last_name = "Adams";

    server = request.agent("http://localhost:3000");

    after(async () => {
      const role = roles.ADMIN_ROLE;
      const tableName = tableNames.USERS;
      const queryCommand =
        "DELETE FROM " +
        tableName +
        " WHERE username = " +
        "'" +
        username +
        "'";
      await executeQuery({ db, role, tableName, queryCommand }, simpleQuery);
    });

    it("Should register a new user", (done) => {
      const body = {
        username,
        password,
        email,
        first_name,
        last_name,
      };

      server.post("/api/v1/register").send(body).expect(200, done);
    });
    it("Should extract a new from a cookie", (done) => {
      const tableName = tableNames.USERS;
      const role = roles.REGISTERED_ROLE;
      executeQuery({ db, tableName, role, username }, selectByUsername).then(
        ({ id }) => {
          server.get("/api/v1/users/" + id).expect(200, done);
        }
      );
    });
  });
});
