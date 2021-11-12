# Endpoints

 <br />
 
## Get

- /api/docs
- /api/v1/users/:id
- /api/v1/users/:id/cart
- /api/v1/users/:id/orders
- /api/v1/users/:id/orders/:id
- /api/v1/products
- /api/v1/products/:id

 <br />

## POST

- /api/v1/login
- /api/v1/register
- /api/v1/users/:id/cart
- /api/v1/users/:id/orders

Only for admins

- /api/v1/products

 <br />

## PUT

- /api/v1/users/:id
- /api/v1/users/:id/cart
- /api/v1/users/:id/orders/:id

Only for admins

- /api/v1/products/:id

<br />

## DELETE

- /api/v1/users/:id/cart

Only for admins

- /api/v1/users/:id
- /api/v1/products/:id
- /api/v1/users/:id/orders/:id

This API doesn't use any hash on passwords and other data. This is beacuse the project will not go to the production phase.
