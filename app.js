const express = require("express");
const dotenv = require("dotenv");
const { MongooseConnection } = require("./database/db.js");
const UserRoute = require("./routes/userRoute.js");
const BookRoute = require("./routes/bookRoute.js");
const PurchaseRoute = require("./routes/purchaseRoute.js");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGOOSEDB;
MongooseConnection(MONGOURL);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoute);
app.use("/book", BookRoute);
app.use("/purchase", PurchaseRoute);

app.listen(PORT, () => {
  console.log("listening to PORT: %d", PORT);
});
