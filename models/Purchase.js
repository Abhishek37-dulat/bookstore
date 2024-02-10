const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  purchaseId: { type: String, unique: true, required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  purchaseDate: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
