/**
 * @swagger
 *  components:
 *    schemas:
 *      Cart_item:
 *        type: object
 *        required:
 *          - user_id
 *          - product_id
 *          - quantity
 *        properties:
 *          user_id:
 *            type: integer
 *            description: The id of a user
 *          product_id:
 *            type: integer
 *            description: The id of a product
 *          quantity:
 *            type: integer
 *            description: The quantity of a product
 *
 *      Cart_items:
 *        type: array
 *        items:
 *          $ref: '#/components/schemas/Cart_item'
 */

/**
 * @swagger
 * tags:
 *  name: Cart
 *  description: Api to your cart
 */
