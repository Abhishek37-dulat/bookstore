const express = require("express");
const {
  createBook,
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
} = require("../controller/bookController.js");

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
