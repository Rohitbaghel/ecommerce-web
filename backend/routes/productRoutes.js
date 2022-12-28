const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getProductReview,
  deleteProductReview,
} = require("../controller/product.controller");
const { isAuthenticateUser } = require("../middleware/auth");
const { authorizeRoles } = require("../controller/user.controller");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticateUser, authorizeRoles("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticateUser, updateProduct)
  .delete(isAuthenticateUser, deleteProduct)
  .get(getProductDetail);

router.route("/product/:id").get(getProductDetail);
router.route("/review").put(isAuthenticateUser, createProductReview);
router
  .route("/reviews")
  .get(getProductReview)
  .delete(isAuthenticateUser, deleteProductReview);

module.exports = router;
