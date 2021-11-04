const { assert } = require("chai");
const db = require("../db");
const { selectById } = require("../queries");

describe("Queries", () => {
  beforeEach("Create temporary table users", async function () {
    await db.query("CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL);"); // This will copy constraints also

    await db.query(
      "COPY pg_temp.users(id,first_name, last_name, email, username) FROM '/Users/denis/projects/back-end-front-end/server/test/temp_table_data/users.csv' DELIMITER ',' CSV HEADER;"
    );
  });

  afterEach("Drop temporary table users", async function () {
    await db.query("DROP TABLE IF EXISTS pg_temp.users");
  });

  beforeEach("Create temporary table logins", async function () {
    await db.query(
      "CREATE TEMPORARY TABLE logins (LIKE logins INCLUDING ALL);"
    ); // This will copy constraints also

    await db.query(
      "COPY pg_temp.logins(username,password, is_admin) FROM '/Users/denis/projects/back-end-front-end/server/test/temp_table_data/logins.csv' DELIMITER ',' CSV HEADER;"
    );
  });

  afterEach("Drop temporary table logins", async function () {
    await db.query("DROP TABLE IF EXISTS pg_temp.logins");
  });

  describe("Users table", () => {
    describe("selectById", () => {
      it("Should select a user by id", async () => {
        const id = 1;
        const expected = {
          id: 1,
          first_name: "Martie",
          last_name: "Hollyer",
          email: "mhollyer0@whitehouse.gov",
          username: "mhollyer0",
        };
        const tableName = "pg_temp.users";

        const output = await selectById(db, tableName, id);

        assert.deepEqual(output, expected);
      });
    });
  });

  //   describe("Logins table", () => {
  //     describe("selectById", () => {
  //       it("Should select a user by id", async () => {
  //         const id = 1;
  //         const expected = {
  //           id: 1,
  //           first_name: "Martie",
  //           last_name: "Hollyer",
  //           email: "mhollyer0@whitehouse.gov",
  //           username: "mhollyer0",
  //         };
  //         const tableName = "pg_temp.users";
  //         const output = await selectById(db, tableName, id);
  //         assert.deepEqual(output, expected);
  //       });
  //     });
  //   });
});
