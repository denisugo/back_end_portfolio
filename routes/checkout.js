// FLOW: from cart attempt to place an order -> attempt to pay at checkout -> post an order with transaction id

/**
 * @swagger
 *  components:
 *    schemas:
 *      Checkout:
 *        type: object
 *        required:
 *          - cart
 *          - transaction_id
 *        properties:
 *          cart:
 *            type: array
 *            description: Items from a carts
 *            items:
 *              $ref: '#/components/schemas/Cart_item'
 *          transaction_id:
 *            type: integer
 *            description: The id of a transaction
 */

/**
 * @swagger
 * tags:
 *  name: Checkout
 *  description: Api to your checkout
 */
