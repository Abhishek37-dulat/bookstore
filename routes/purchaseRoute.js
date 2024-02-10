const express = require("express");
const {
  deletePurchase,
  getAllPurchases,
  getPurchaseById,
  getPurchasesByUserId,
  createPurchase,
  updatePurchase,
} = require("../controller/purchaseController.js");

const router = express.Router();

router.get("/", getAllPurchases);
router.get("/:id", getPurchaseById);
router.get("/user/:id", getPurchasesByUserId);
router.post("/", createPurchase);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

module.exports = router;
