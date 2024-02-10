const Purchase = require("../models/Purchase");

const createPurchase = async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    const savedPurchase = await purchase.save();
    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPurchasesByUserId = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.params.userId });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updatePurchase = async (req, res) => {
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.json(updatedPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deletePurchase = async (req, res) => {
  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!deletedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deletePurchase,
  getAllPurchases,
  getPurchaseById,
  getPurchasesByUserId,
  createPurchase,
  updatePurchase,
};
