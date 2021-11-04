/*
 * Could be used for selecting a user, product or order
 */
const selectById = async (db, tableName, id) => {
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
 * Could be used for selecting products or orders
 */
const selectByTableName = async (db, tableName) => {
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
const selectUsernameWithPassword = async (
  db,
  tableName,
  username,
  password
) => {
  const params = [username, password];
  const query =
    "SELECT * FROM " + tableName + " WHERE username = $1 AND password = $2;";
  const { rows } = await db.query(query, params);

  return {
    exists: rows[0] ? true : false,
    username: username,
    isAdmin: rows[0] ? rows[0].is_admin : null,
  };
};

const selectOrder = async () => {};

const selectCart = async () => {};

module.exports = {
  selectById,
  selectByTableName,
  selectUsernameWithPassword,
  selectOrder,
  selectCart,
};
