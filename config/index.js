// this file should be in gitignore
// but for this project it will be commited

// sql database settings
const sql = {
  user: "back_end",
  password: "password",
  sqlPort: 5432,
  sqlHost: "localhost",
  database: "back_end_portfolio",
};

// app setting
const app = {
  port: 3000,
};

// contsants
const constants = {
  tableNames: {
    USERS: "users",
    PRODUCTS: "products",
    LOGINS: "logins",
    ORDERS_USERS: "orders_users",
    CARTS: "carts",
    PG_TEMP_USERS: "pg_temp.users",
    PG_TEMP_PRODUCTS: "pg_temp.products",
    PG_TEMP_LOGINS: "pg_temp.logins",
    PG_TEMP_ORDERS_USERS: "pg_temp.orders_users",
    PG_TEMP_CARTS: "pg_temp.carts",
  },
  roles: {
    PUBLIC_ROLE: "public_role",
    ADMIN_ROLE: "admin_role",
    REGISTERED_ROLE: "registered_role",
  },
};

module.exports = {
  sql,
  app,
  constants,
};
