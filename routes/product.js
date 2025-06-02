const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

const auth = require("../auth");

const { verify, verifyAdmin } = require("../auth");

// POST /products — Create product (admin only, temporary check)
router.post("/", verify, verifyAdmin, productController.createProduct);

//Retrieve all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

//Retrieve all active products
router.get("/active", productController.getAllActive);

//Retriev single product
router.get("/:productId", productController.getProduct);

//Update product info
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

//Archive product
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

//Activate product
router.patch("/:productId/activate" , verify, verifyAdmin, productController.activateProduct);

//Search for products by their names
router.post("/search-by-name", productController.searchByName);

//Search for products by their price range
router.post("/search-by-price", productController.searchByPrice);
module.exports = router;
