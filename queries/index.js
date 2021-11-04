/*
 * Could be used for selecting a user, product or order
 */
const selectById = async (db, tableName, id) => {
  const params = [id];
  const query = "SELECT * FROM " + tableName + " WHERE id = $1";
  const { rows } = await db.query(query, params);
  return rows[0];
};

/*
 * Could be used for selecting products or orders
 */

const selectByTableName = async (db, tableName) => {
  const params = [tableName];
  const query = "SELECT * FROM $1";
  const { rows } = await db.query(query, params);
  return rows;
};

const selectOrder = async () => {};

const selectCart = async () => {};

module.exports = {
  selectById,
  selectByTableName,
};
