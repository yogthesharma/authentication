const express = require(`express`);
const mongoose = require(`mongoose`);
const cors = require(`cors`);
require(`dotenv`).config();
// getting the user route
const userRoute = require(`./routes/userRoute`);

// setting up the app variable for express
const app = express();

// middleware usage
app.use(express.json());
app.use(cors());

// adding routers
app.use("/user", userRoute);

// setting up the ports for the server

const port = process.env.PORT || 5000;

// listining on the defined port
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

// setting up the database
mongoose.connect(
  process.env.MONGO_URI,
  {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) return console.log(`Some Error Occured`);
    console.log(`Database Successfully Connected`);
  }
);
