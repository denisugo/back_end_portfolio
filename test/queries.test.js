const { assert } = require("chai");
const db = require("../db");
const {
  selectById,
  selectByTableName,
  selectWithUsernameAndPassword,
  executeQuery,
  createTempTable,
  dropTable,
  populateTable,
  insertValues,
  selectByUsername,
  updateValuesById,
  simpleQuery,
  deleteValuesById,
} = require("../queries");

const stringCreator = require("../queries/stringCreator");

const { roles, tableNames } = require("../config").constants;

describe("Queries", () => {
  describe("Public role", () => {
    beforeEach("Create temporary table products", async function () {
      await executeQuery(
        { db, role: roles.PUBLIC_ROLE, tableName: tableNames.PRODUCTS },
        createTempTable
      );
      await executeQuery(
        {
          db,
          role: roles.PUBLIC_ROLE,
          tableName: tableNames.PG_TEMP_PRODUCTS,
          columns: "id,name,description,price,category,preview",
          path: "/Users/denis/projects/back-end-front-end/server/test/temp_table_data/products.csv",
        },
        populateTable
      );
    });

    afterEach("Drop temporary table products", async function () {
      await executeQuery(
        { db, role: roles.PUBLIC_ROLE, tableName: tableNames.PG_TEMP_PRODUCTS },
        dropTable
      );
    });

    beforeEach("Create temporary table users", async function () {
      await executeQuery(
        { db, role: roles.ADMIN_ROLE, tableName: tableNames.USERS },
        createTempTable
      );
      await executeQuery(
        {
          db,
          role: roles.ADMIN_ROLE,
          tableName: tableNames.PG_TEMP_USERS,
          columns:
            "id, first_name, last_name, email, username, is_admin, password",
          path: "/Users/denis/projects/back-end-front-end/server/test/temp_table_data/users.csv",
        },
        populateTable
      );

      // setup

      await executeQuery(
        {
          db,
          role: roles.ADMIN_ROLE,
          queryCommand:
            "GRANT SELECT, INSERT(first_name,last_name,email,username,password) ON " +
            tableNames.PG_TEMP_USERS +
            " TO " +
            roles.PUBLIC_ROLE +
            "; GRANT USAGE ON ALL SEQUENCES IN SCHEMA pg_temp TO " +
            roles.PUBLIC_ROLE +
            ";",
        },
        simpleQuery
      );
    });

    afterEach("Drop temporary table users", async function () {
      await executeQuery(
        { db, role: roles.ADMIN_ROLE, tableName: tableNames.PG_TEMP_USERS },
        dropTable
      );
    });

    describe("Products table", () => {
      describe("selectByTableName", () => {
        it("Should return array with products", async () => {
          const tableName = tableNames.PG_TEMP_PRODUCTS;

          // const output = await selectByTableName(db, tableName);
          const output = await executeQuery(
            { db, tableName, role: roles.PUBLIC_ROLE },
            selectByTableName
          );

          assert.isArray(output);
          assert.isObject(output[1]);
          assert.strictEqual(output.length, 20);
        });

        it("Should return undefined if the table name is wrong", async () => {
          const tableName = "wrong_name";

          // const output = await selectByTableName(db, tableName);
          const output = await executeQuery(
            { db, tableName, role: roles.PUBLIC_ROLE },
            selectByTableName
          );

          assert.isUndefined(output);
        });
      });
    });

    describe("Users table", () => {
      describe("insertValues", () => {
        it("Should insert new record to users table", async () => {
          const tableName = tableNames.PG_TEMP_USERS;

          const model = {
            first_name: "Robbie",
            last_name: "Jackson",
            email: "rj0@tmall.com",
            username: "robinnho000",
            password: "fal",
          };

          const { values, columns, queryPrepared } = stringCreator.users(model);

          const output = await executeQuery(
            {
              db,
              tableName,
              role: roles.PUBLIC_ROLE,
              columns,
              values,
              queryPrepared,
            },
            insertValues
          );
          assert.isObject(output);
        });
        it("Should return undefined when input is incorrect", async () => {
          const tableName = tableNames.PG_TEMP_USERS;

          const model = {
            first_name: "911",
            last_name: "Jackson",
            email: "rj0@tmall.com",
            username: "rmarczyk1", //incorrect value
            password: "nul",
          };
          const { values, columns, queryPrepared } = stringCreator.users(model);

          const output = await executeQuery(
            {
              db,
              tableName,
              role: roles.PUBLIC_ROLE,
              columns,
              values,
              queryPrepared,
            },
            insertValues
          );
          assert.isUndefined(output);
        });
      });

      describe("selectUsernameWithPassword", () => {
        it("Should select user with username and password", async () => {
          const tableName = tableNames.PG_TEMP_USERS;

          const role = roles.PUBLIC_ROLE;

          const username = "ccaltun0";
          const password = "m5FS8yMIy6";

          const output = await executeQuery(
            { db, tableName, role, username, password },
            selectWithUsernameAndPassword
          );

          assert.isObject(output);
          assert.strictEqual(typeof output.is_admin, "boolean");
          assert.strictEqual(typeof output.id, "number");
          assert.strictEqual(typeof output.username, "string");
        });

        it("Should return undefined when password is incorrect", async () => {
          const tableName = tableNames.PG_TEMP_USERS;

          const role = roles.PUBLIC_ROLE;

          const username = "ccaltun0";
          const password = "incorrect";

          const output = await executeQuery(
            { db, tableName, role, username, password },
            selectWithUsernameAndPassword
          );

          assert.isUndefined(output);
        });

        it("Should return undefined when both password and username are incorrect", async () => {
          const tableName = tableNames.PG_TEMP_USERS;

          const role = roles.PUBLIC_ROLE;

          const username = "ccaltun";
          const password = "incorrect";

          const output = await executeQuery(
            { db, tableName, role, username, password },
            selectWithUsernameAndPassword
          );

          assert.isUndefined(output);
        });
      });
    });
  });

  describe("Registered role", () => {
    beforeEach("Create temporary table users", async function () {
      await executeQuery(
        { db, role: roles.ADMIN_ROLE, tableName: tableNames.USERS },
        createTempTable
      );
      await executeQuery(
        {
          db,
          role: roles.ADMIN_ROLE,
          tableName: tableNames.PG_TEMP_USERS,
          columns:
            "id, first_name, last_name, email, username, is_admin, password",
          path: "/Users/denis/projects/back-end-front-end/server/test/temp_table_data/users.csv",
        },
        populateTable
      );

      // setup

      await executeQuery(
        {
          db,
          role: roles.ADMIN_ROLE,
          queryCommand:
            "GRANT SELECT,UPDATE(first_name,last_name,email,username,password) ON " +
            tableNames.PG_TEMP_USERS +
            " TO " +
            roles.REGISTERED_ROLE +
            ";",
        },
        simpleQuery
      );
    });

    afterEach("Drop temporary table users", async function () {
      await executeQuery(
        { db, role: roles.ADMIN_ROLE, tableName: tableNames.PG_TEMP_USERS },
        dropTable
      );
    });

    describe("Users table", () => {
      describe("selectById", () => {
        it("Should select a user by id", async () => {
          const id = 1;

          const tableName = tableNames.PG_TEMP_USERS;

          const output = await executeQuery(
            { db, tableName, id, role: roles.REGISTERED_ROLE },
            selectById
          );
          assert.isObject(output);
        });

        it("Should return undefined if id doesnt exist", async () => {
          const id = 300;
          const tableName = tableNames.PG_TEMP_USERS;

          const output = await executeQuery(
            { db, tableName, id, role: roles.REGISTERED_ROLE },
            selectById
          );

          assert.isUndefined(output);
        });

        it("Should return undefined if sql injection happened", async () => {
          const id = "';--";
          const tableName = tableNames.PG_TEMP_USERS;

          let output = await selectById({ db, tableName, id });

          assert.isUndefined(output);
        });
      });

      describe("updateValuesById", () => {
        it("Updates values filtered by id", async () => {
          const columnName = "first_name";
          const newValue = "Jessica";
          const id = 1;
          const tableName = tableNames.PG_TEMP_USERS;

          const output = await executeQuery(
            {
              db,
              tableName,
              role: roles.REGISTERED_ROLE,
              columnName,
              newValue,
              id,
            },
            updateValuesById
          );

          assert.isObject(output);
        });

        it("Returns undefined when the new value is incorrect", async () => {
          const columnName = "username";
          const newValue = "rmarczyk1";
          const id = 1;
          const tableName = tableNames.PG_TEMP_USERS;

          const output = await executeQuery(
            {
              db,
              tableName,
              role: roles.REGISTERED_ROLE,
              columnName,
              newValue,
              id,
            },
            updateValuesById
          );

          assert.isUndefined(output);
        });

        it("Returns undefined when trying to update is_admin", async () => {
          const columnName = "is_admin";
          const newValue = true;
          const id = 1;
          const tableName = tableNames.PG_TEMP_USERS;

          const output = await executeQuery(
            {
              db,
              tableName,
              role: roles.REGISTERED_ROLE,
              columnName,
              newValue,
              id,
            },
            updateValuesById
          );

          assert.isUndefined(output);
        });
      });
    });

    // describe("Carts table", ()=>{

    // })
    // describe("Logins table", ()=>{

    // })
    // describe("Orders table", ()=>{

    // })
    // describe("Orders_Users table", ()=>{

    // })
  });

  describe("Admin role", () => {
    beforeEach("Create temporary table users", async function () {
      await executeQuery(
        { db, role: roles.ADMIN_ROLE, tableName: tableNames.USERS },
        createTempTable
      );
      await executeQuery(
        {
          db,
          role: roles.ADMIN_ROLE,
          tableName: tableNames.PG_TEMP_USERS,
          columns:
            "id, first_name, last_name, email, username, is_admin, password",
          path: "/Users/denis/projects/back-end-front-end/server/test/temp_table_data/users.csv",
        },
        populateTable
      );
    });

    afterEach("Drop temporary table users", async function () {
      await executeQuery(
        { db, role: roles.ADMIN_ROLE, tableName: roles.PG_TEMP_USERS },
        dropTable
      );
    });

    describe("Users table", () => {
      describe("deleteValues", () => {
        it("Should delete values filtered by id", async () => {
          const id = 1;
          const tableName = tableNames.PG_TEMP_USERS;
          const role = roles.ADMIN_ROLE;

          const output = await executeQuery(
            { db, tableName, role, id },
            deleteValuesById
          );

          assert.strictEqual(output.success, true);
        });

        it("Should return undefined when id doesnt exist", async () => {
          const id = 1000;
          const tableName = tableNames.PG_TEMP_USERS;
          const role = roles.ADMIN_ROLE;

          const output = await executeQuery(
            { db, tableName, role, id },
            deleteValuesById
          );

          assert.isUndefined(output);
        });
      });
    });
  });
});
