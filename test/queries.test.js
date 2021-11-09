const { assert } = require("chai");
const db = require("../db");
const {
  selectById,
  selectByTableName,
  selectUsernameWithPassword,
  executeQuery,
  createTempTable,
  dropTable,
  populateTable,
  insertValues,
  selectByUsername,
  updateValuesById,
} = require("../queries");

const stringCreator = require("../queries/stringCreator");

const { roles, tableNames } = require("../config").constants;

describe("Queries", () => {
  describe("Public role", () => {
    beforeEach("Create temporary table logins", async function () {
      await executeQuery(
        { db, role: roles.PUBLIC_ROLE, tableName: tableNames.LOGINS },
        createTempTable
      );
      await executeQuery(
        {
          db,
          role: roles.PUBLIC_ROLE,
          tableName: tableNames.PG_TEMP_LOGINS,
          columns: "username,password",
          path: "/Users/denis/projects/back-end-front-end/server/test/temp_table_data/logins.csv",
        },
        populateTable
      );
    });

    afterEach("Drop temporary table logins", async function () {
      await executeQuery(
        { db, role: roles.PUBLIC_ROLE, tableName: tableNames.PG_TEMP_LOGINS },
        dropTable
      );
    });

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

    describe("Logins table", () => {
      describe("selectUsernameWithPassword", () => {
        it("Should return {exists:true...} if username-password pair exists", async () => {
          const username = "obreston0";
          const password = "amiHNVj";

          const expected = {
            exists: true,
            username: username,
          };

          const tableName = tableNames.PG_TEMP_LOGINS;

          const output = await executeQuery(
            { db, tableName, username, password, role: roles.PUBLIC_ROLE },
            selectUsernameWithPassword
          );

          assert.deepEqual(output, expected);
        });

        it("Should return {exists:false, is_admin:...} if username-password pair doesn exist", async () => {
          const username = "obreston0";
          const password = "fake_password";

          const expected = {
            exists: false,
            username: username,
          };

          const tableName = tableNames.PG_TEMP_LOGINS;

          const output = await executeQuery(
            { db, tableName, username, password, role: roles.PUBLIC_ROLE },
            selectUsernameWithPassword
          );

          assert.deepEqual(output, expected);
        });

        it("Should return {exists:false, is_admin:...} if sql injection happaned", async () => {
          const username = "'; DROP TABLE pg_temp.users --";
          const password = "fake_password";

          const tableName = tableNames.PG_TEMP_LOGINS;
          const expected = {
            exists: false,
            username: username,
          };

          const output = await executeQuery(
            { db, tableName, username, password, role: roles.PUBLIC_ROLE },
            selectUsernameWithPassword
          );

          assert.deepEqual(output, expected);
        });
      });
    });

    describe("Products table", () => {
      describe("selectByTableName", () => {
        it("Should return array with products", async () => {
          const tableName = "pg_temp.products";

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
  });

  describe("Registered role", () => {
    beforeEach("Create temporary table users", async function () {
      await executeQuery(
        { db, role: roles.REGISTERED_ROLE, tableName: "users" },
        createTempTable
      );
      await executeQuery(
        {
          db,
          role: roles.REGISTERED_ROLE,
          tableName: "pg_temp.users",
          columns: "id, first_name, last_name, email, username, is_admin",
          path: "/Users/denis/projects/back-end-front-end/server/test/temp_table_data/users.csv",
        },
        populateTable
      );
    });

    afterEach("Drop temporary table users", async function () {
      await executeQuery(
        { db, role: roles.REGISTERED_ROLE, tableName: "pg_temp.users" },
        dropTable
      );
    });

    describe("Users table", () => {
      describe("selectById", () => {
        it("Should select a user by id", async () => {
          const id = 1;
          const expected = {
            id: id,
            first_name: "Obie",
            last_name: "Breston",
            email: "obreston0@tmall.com",
            username: "obreston0",
            is_admin: false,
          };
          const tableName = tableNames.PG_TEMP_USERS;

          //   const output = await selectById({ db, tableName, id });
          const output = await executeQuery(
            { db, tableName, id, role: roles.REGISTERED_ROLE },
            selectById
          );
          assert.deepEqual(output, expected);
        });

        it("Should return undefined if id doesnt exist", async () => {
          const id = 300;
          const tableName = tableNames.PG_TEMP_USERS;

          const output = await selectById({ db, tableName, id });

          assert.isUndefined(output);
        });

        it("Should return undefined if sql injection happened", async () => {
          const id = "';--";
          const tableName = tableNames.PG_TEMP_USERS;

          let output = await selectById({ db, tableName, id });

          assert.isUndefined(output);
        });
      });

      describe("selectByUsername", () => {
        it("Should select a user by username", async () => {
          const username = "obreston0";
          const expected = {
            id: 1,
            first_name: "Obie",
            last_name: "Breston",
            email: "obreston0@tmall.com",
            username: "obreston0",
            is_admin: false,
          };
          const tableName = tableNames.PG_TEMP_USERS;

          const output = await executeQuery(
            { db, tableName, username, role: roles.REGISTERED_ROLE },
            selectByUsername
          );
          assert.deepEqual(output, expected);
        });

        it("Should return undefined if username doesnt exist", async () => {
          const username = "300";
          const tableName = tableNames.PG_TEMP_USERS;

          const output = await executeQuery(
            { db, tableName, username, role: roles.REGISTERED_ROLE },
            selectByUsername
          );

          assert.isUndefined(output);
        });

        it("Should return undefined if sql injection happened", async () => {
          const username = "';--";
          const tableName = tableNames.PG_TEMP_USERS;

          const output = await executeQuery(
            { db, tableName, username, role: roles.REGISTERED_ROLE },
            selectByUsername
          );

          assert.isUndefined(output);
        });
      });
      describe("insertValues", () => {
        it("Should insert new record to users table", async () => {
          const username = "robinnho000";
          const tableName = tableNames.PG_TEMP_USERS;
          const expected = {
            first_name: "Robbie",
            last_name: "Jackson",
            email: "rj0@tmall.com",
            username: username,
            is_admin: false,
          };

          const { values, columns, queryPrepared } =
            stringCreator.users(expected);

          const output = await executeQuery(
            {
              db,
              tableName,
              role: roles.REGISTERED_ROLE,
              columns,
              values,
              queryPrepared,
            },
            insertValues
          );

          assert.isObject(output);
          assert.strictEqual(output.username, expected.username);
        });

        it("Should return undefined when input is incorrect", async () => {
          const username = "robinnho000";
          const tableName = tableNames.PG_TEMP_USERS;
          const expected = {
            first_name: "911",
            last_name: "Jackson",
            email: "rj0@tmall.com",
            username: username,
            is_admin: null, //incorrect value
          };

          const { values, columns, queryPrepared } =
            stringCreator.users(expected);

          const output = await executeQuery(
            {
              db,
              tableName,
              role: roles.REGISTERED_ROLE,
              columns,
              values,
              queryPrepared,
            },
            insertValues
          );

          assert.isUndefined(output);
        });
      });
      describe("updateValuesById", () => {
        it("Updates values filtered by id", async () => {
          const columnName = "first_name";
          const newValue = "Jessica";
          const id = 1;
          const tableName = tableNames.PG_TEMP_USERS;

          const expected = {
            id: id,
            first_name: newValue,
            last_name: "Breston",
            email: "obreston0@tmall.com",
            username: "obreston0",
            is_admin: false,
          };

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

          assert.deepEqual(output, expected);
        });

        it("Returns undefined when the new value is incorrect", async () => {
          const columnName = "username";
          const newValue = "mbenedicte1";
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

  //   describe("Admin role",()=>{
  // describe("deleteValues", ()=>{
  //     it("Deletes values filtered by id",()=>{

  //     })
  // })
  //   })
});
