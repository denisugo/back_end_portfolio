/** executeQuery description
 * @param {Object} options
 * @param {String} options.tableName The name of the table
 * @param {Number} options.id id column
 * @param {Object} options.db Database object
 * @param {String} options.username username column
 * @param {String} options.password password column
 * @param {String} options.role Role public|registerd|admin
 * @param {String} options.columns Columns to insert into
 * @param {String} options.columnName The name of the column to be updated
 * @param {String} options.path Path to the file with values
 * @param {String} options.values Values to be inserted
 * @param {String} options.newValue The new value that updates previous one
 * @param {String} options.queryCommand Use only for testing purposes
 * @param {String} options.queryPrepared String with $1..
 * @param {Function} queryCallback Query function
 */

const executeQuery = async (options, queryCallback = async () => {}) => {
  // options should always contain at least db and role property
  await options.db.query("SET ROLE " + options.role + ";");
  const queryResult = await queryCallback(options);
  await options.db.query("SET SESSION AUTHORIZATION DEFAULT;");
  await options.db.query("DISCARD SEQUENCES;");
  //await options.db.query("DISCARD ALL;");
  return queryResult;
};

/*
 * Could be used for selecting a user, product or order
 */
const selectById = async ({ db, tableName, id }) => {
  const params = [id];
  const query = "SELECT * FROM " + tableName + " WHERE id = $1;";

  try {
    const { rows } = await db.query(query, params);
    return rows[0];
  } catch (error) {
    console.error(error.message);
  }
  return undefined;
};

/*
 * Could be used for updating rows
 * Should be used only when id is PRIMARY KEY
 */
const updateValuesById = async ({
  db,
  tableName,
  id,
  newValue,
  columnName,
}) => {
  const params = [newValue, id];
  const query =
    "UPDATE " +
    tableName +
    " SET " +
    columnName +
    " = $1 WHERE id = $2 RETURNING *;";

  try {
    const { rows } = await db.query(query, params);
    return rows[0];
  } catch (error) {
    console.error(error.message);
  }
  return undefined;
};

/*
 * Could be used for selecting a user, product or order
 */
const selectByUsername = async ({ db, tableName, username }) => {
  const params = [username];
  const query = "SELECT * FROM " + tableName + " WHERE username = $1;";

  try {
    const { rows } = await db.query(query, params);
    return rows[0];
  } catch (error) {
    console.error(error.message);
  }
  return undefined;
};

/**
 * Could be used for inserting values to db
 */
const insertValues = async ({
  db,
  tableName,
  columns,
  values,
  queryPrepared,
}) => {
  const query =
    "INSERT INTO " +
    tableName +
    " (" +
    columns +
    ") VALUES (" +
    queryPrepared +
    ") RETURNING *;";

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(error.message);
  }
  return undefined;
};

/*
 * Could be used for selecting products or orders
 */
const selectByTableName = async ({ db, tableName }) => {
  const query = "SELECT * FROM " + tableName + ";";

  try {
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error(error.message);
  }
  return undefined;
};

/*
 * Could be used for authorisation
 */
const selectUsernameWithPassword = async ({
  db,
  tableName,
  username,
  password,
}) => {
  const params = [username, password];
  const query =
    "SELECT * FROM " + tableName + " WHERE username = $1 AND password = $2;";

  try {
    const { rows } = await db.query(query, params);

    return {
      exists: rows[0] ? true : false,
      username: username,
    };
  } catch (error) {
    console.error(error);
  }
  return undefined;
};

const createTempTable = async ({ db, tableName }) => {
  try {
    await db.query(
      "CREATE TEMPORARY TABLE " +
        tableName +
        " (LIKE " +
        tableName +
        " INCLUDING ALL);"
    );
  } catch (error) {
    console.error(error);
  }
};

const dropTable = async ({ db, tableName }) => {
  try {
    await db.query("DROP TABLE IF EXISTS " + tableName + ";");
  } catch (error) {
    console.error(error);
  }
};

const populateTable = async ({ db, tableName, columns, path }) => {
  try {
    await db.query(
      "COPY " +
        tableName +
        "(" +
        columns +
        ") FROM '" +
        path +
        "' DELIMITER ',' CSV HEADER;"
    );
  } catch (error) {
    console.error(error);
  }
};

const selectOrder = async () => {};

const selectCart = async () => {};

module.exports = {
  selectById,
  selectByUsername,
  selectByTableName,
  selectUsernameWithPassword,
  selectOrder,
  selectCart,
  executeQuery,
  createTempTable,
  dropTable,
  populateTable,
  insertValues,
  updateValuesById,
};
