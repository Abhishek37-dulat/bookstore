const Purchase = require("../models/Purchase");
const Book = require("../models/Book");
const nodemailer = require("nodemailer");

const createPurchase = async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    const savedPurchase = await purchase.save();

    const book = await Book.findById(savedPurchase.bookId);
    book.sellCount += savedPurchase.quantity;
    await book.save();

    await sendPurchaseConfirmationEmail(savedPurchase);

    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendPurchaseConfirmationEmail = async (purchase) => {
  try {
    var transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sendmailm6@gmail.com",
        pass: "breu nlyd ztmw ujap",
      },
    });

    const mailOptions = {
      from: "sendmailm6@gmail.com",
      to: purchase.email,
      subject: "Purchase Confirmation",
      html: `<p>Thank you for your purchase!</p>`,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log("Purchase confirmation email sent successfully!");
  } catch (error) {
    console.error("Error sending purchase confirmation email:", error);
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
