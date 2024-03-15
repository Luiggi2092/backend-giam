const express = require('express');
// const Mercado_Pago = require('mercadopago');
const { createUser, loginUserCtrl, getallUser, getaUser, 
deleteaUser, updatedUser, blockUser, unblockUser, 
handleRefreshToken, logout, updatePassword, forgotPasswordToken, 
resetPassword, getWishlist, loginAdmin, saveAddress, emptyCart, applyCoupon,
createOrder, getMyOrders, getAllOrders, userCart, getUserCart, 
removeProductFromCart, updateProductQuantityFromCart, getMonthWiseOrderIncome, 
getYearlyOrders, getSingleOrders, updateOrder, getCompare,
} = require('../controller/userCtrl');
//const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { checkout, paymentVerification } = require('../controller/paymentCtrl');



const router = express.Router();


router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart/add/:id", userCart);
router.post("/order/checkout", checkout);
router.post("/order/paymentVerification", paymentVerification);
// router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", createOrder);
router.get("/all-users", getallUser);
router.get("/getmyorders", getMyOrders);
router.get("/getallorders", getAllOrders);
router.get("/getaOrder/:id", getSingleOrders);
router.put("/updateOrder/:id", updateOrder);
router.get("/getmonthwiseorderincome", getMonthWiseOrderIncome);
router.get("/getyearlyorders", getYearlyOrders);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", getWishlist);
router.get("/compare-product", getCompare);
router.get("/cart/:userId", getUserCart);
router.get("/:id", getaUser);
router.delete("/delete-product-cart/:id/:userId", removeProductFromCart);
router.patch("/update-product-cart/:id/:userId", updateProductQuantityFromCart);

// router.post("Mercado_Pago", Mercado_Pago);

router.delete("/empty-cart", emptyCart);
router.delete("/:id", deleteaUser);
// router.put(
//     "/order/update-order/:id",
//     authMiddleware,
//     isAdmin,
//     updateOrderStatus
//   );
router.put("/edit-user", updatedUser);
router.put("/save-address", saveAddress);
router.put("/block-user/:id", blockUser);
router.put("/unblock-user/:id", unblockUser);




module.exports = router;