const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const {connectToDatabase} = require("./models/prisma");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.get('/',(req,res)=>{
    res.json('Api Untuk Galeraz');
});

app.use('/user',authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
