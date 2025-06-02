const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");

const auth = require("../auth");

const { verify } = require("../auth");

//Retrieve user's cart
router.get("/get-cart", verify, cartController.getCart);

//Add to cart
router.post("/add-to-cart", verify,  cartController.addCart);

//Change Product Quantities in cart
router.patch("/update-cart-quantity", verify,  cartController.changeCart);

//Remove item from cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeItem);
 
//Clear cart
router.put("/clear-cart", verify, cartController.clearCart);

module.exports = router;