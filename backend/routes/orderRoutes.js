const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controller/order.controller");
const { isAuthenticateUser } = require("../middleware/auth");
const { authorizeRoles } = require("../controller/user.controller");

const router = express.Router();

router.route("/order/new").post(isAuthenticateUser, newOrder);

router
  .route("/order/:id")
  .get(isAuthenticateUser, authorizeRoles("admin"), getSingleOrder);

router.route("/order/me").get(isAuthenticateUser, myOrders);

router
  .route("admin/orders")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAllOrders);

router
  .route("admin/order/:id")
  .put(isAuthenticateUser, authorizeRoles("admin", updateOrder))
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteOrder);
module.exports = router;
