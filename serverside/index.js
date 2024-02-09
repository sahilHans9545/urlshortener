const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authenticationRouter = require("./routes/AuthenticationRoutes");
const urlRouter = require("./routes/UrlRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8000;
dotenv.config();

app.use("/user", authenticationRouter);
app.use(urlRouter);

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`Example app listening on port 5000`);
    })
    .catch((error) => {
      console.log("connection Failed :- ", error);
    });
});
