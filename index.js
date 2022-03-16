const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();

let whitelist = ["http://localhost:5000"];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "server is running...",
  });
});

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}...`);
});

const auth = require("./src/routes/auth.route");
app.use("/api/auth/", auth);

const profile = require("./src/routes/profile.route");
app.use("/api/profile/", profile);

const category = require("./src/routes/category.route");
app.use("/api/category/", category);

const product = require("./src/routes/product.route");
app.use("/api/product/", product);

app.use("/storage/upload", express.static("storage/upload"));
