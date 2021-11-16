const request = require("supertest");
const { executeQuery, simpleQuery, selectByUsername } = require("../queries");
const db = require("../db");
const { tableNames, roles } = require("../config").constants;

describe("App", () => {
  describe("POST /login", () => {
    describe("Correct cookies", () => {
      const server = request.agent("http://localhost:3000");

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
      const server = request.agent("http://localhost:3000");

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

    const server = request.agent("http://localhost:3000");

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

  describe("PUT/users/:id", () => {
    const server = request.agent("http://localhost:3000");

    const username = "jb";
    const password = "secret";
    const id = 1;

    after(async () => {
      //reset user
      const tableName = tableNames.USERS;
      const role = roles.ADMIN_ROLE;
      const first_name = "Joe";
      const queryCommand = `UPDATE ${tableName} SET first_name = '${first_name}' WHERE id = ${id};`;

      await executeQuery({ db, role, tableName, queryCommand }, simpleQuery);
    });

    it("Should change user's first_name", (done) => {
      const body = { field: "first_name", value: "Jankins" };
      server
        .post("/api/v1/login")
        .send({ username, password })
        .expect(200)
        .then(() => {
          server
            .put("/api/v1/users/" + id)
            .send(body)
            .expect(200, done);
        });
    });
  });
  describe("DELETE/users/", () => {
    const server = request.agent("http://localhost:3000");

    const username = "jb";
    const password = "secret";
    const id = 2;

    after(async () => {
      // restore user
      const role = roles.ADMIN_ROLE;
      const tableName = tableNames.USERS;
      const username = "davy000";
      const password = "treasure";
      const first_name = "Dave";
      const last_name = "Sinclair";
      const email = "	dave.sin@yahoo.com";
      const is_admin = false;

      const queryCommand = `INSERT INTO ${tableName} VALUES (${id}, '${first_name}', '${last_name}', '${email}', '${username}',${is_admin}, '${password}');`;

      await executeQuery({ db, tableName, role, queryCommand }, simpleQuery);
    });

    it("Should delete user with id of 2", (done) => {
      const body = { id };
      const adminId = 1;
      server
        .post("/api/v1/login")
        .send({ username, password })
        .expect(200)
        .then(() => {
          server
            .delete("/api/v1/users/" + adminId)
            .send(body)
            .expect(204, done);
        });
    });
  });
});

//TODO: app test for post put delete on users
