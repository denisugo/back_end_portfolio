const { assert, expect } = require("chai");
const db = require("../db");
const {
  selectById,
  selectByTableName,
  selectUsernameWithPassword,
} = require("../queries");

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

  beforeEach("Create temporary table products", async function () {
    await db.query(
      "CREATE TEMPORARY TABLE products (LIKE products INCLUDING ALL);"
    ); // This will copy constraints also

    await db.query(
      "COPY pg_temp.products(id,name,description,price,category) FROM '/Users/denis/projects/back-end-front-end/server/test/temp_table_data/products.csv' DELIMITER ',' CSV HEADER;"
    );
  });

  afterEach("Drop temporary table products", async function () {
    await db.query("DROP TABLE IF EXISTS pg_temp.products");
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

      it("Should return undefined if id doesnt exist", async () => {
        const id = 300;
        const tableName = "pg_temp.users";

        const output = await selectById(db, tableName, id);

        assert.isUndefined(output);
      });

      it("Should return undefined if sql injection happened", async () => {
        const id = "';--";
        const tableName = "pg_temp.users";

        let output = await selectById(db, tableName, id);

        assert.isUndefined(output);
      });
    });
  });

  describe("Logins table", () => {
    describe("selectUsernameWithPassword", () => {
      it("Should return {exists:true, is_admin:...} if username-password pair exists", async () => {
        const username = "mhollyer0";
        const password = "VXiDRSAQ8";
        const isAdmin = true;

        const expected = {
          exists: true,
          username: username,
          isAdmin: isAdmin,
        };

        const tableName = "pg_temp.logins";
        const output = await selectUsernameWithPassword(
          db,
          tableName,
          username,
          password
        );

        assert.deepEqual(output, expected);
      });

      it("Should return {exists:false, is_admin:...} if username-password pair doesn exist", async () => {
        const username = "mhollyer0";
        const password = "fake_password";
        const isAdmin = null;

        const expected = {
          exists: false,
          username: username,
          isAdmin: isAdmin,
        };

        const tableName = "pg_temp.logins";
        const output = await selectUsernameWithPassword(
          db,
          tableName,
          username,
          password
        );

        assert.deepEqual(output, expected);
      });

      it("Should return {exists:false, is_admin:...} if sql injection happaned", async () => {
        const username = "'; DROP TABLE pg_temp.users --";
        const password = "fake_password";
        const isAdmin = null;

        const tableName = "pg_temp.logins";
        const expected = {
          exists: false,
          username: username,
          isAdmin: isAdmin,
        };

        const output = await selectUsernameWithPassword(
          db,
          tableName,
          username,
          password
        );

        assert.deepEqual(output, expected);
      });
    });
  });

  describe("Products table", () => {
    describe("selectByTableName", () => {
      it("Should return array with products", async () => {
        const tableName = "pg_temp.products";

        const output = await selectByTableName(db, tableName);

        assert.isArray(output);
        assert.isObject(output[1]);
        assert.strictEqual(output.length, 20);
      });

      it("Should return undefined if the table name is wrong", async () => {
        const tableName = "wrong_name";

        const output = await selectByTableName(db, tableName);

        assert.isUndefined(output);
      });
    });
  });
});
