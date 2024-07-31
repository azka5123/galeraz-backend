const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes");
// const {connectToDatabase} = require("./models/prisma");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
// connectToDatabase();

// Routes
app.get('/', (req, res) => {
  res.json('Api Untuk Galeraz');
});

app.use('/',routes)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
