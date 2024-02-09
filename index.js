import express from "express";
import mongoose from "mongoose";
import CreateUser from "./routes/CreateUser.js";
import cors from "cors";
import DisplayData from "./routes/DisplayData.js";
import OrderData from "./routes/OrderData.js";

const app = express();

const mongoDBURL =
  "mongodb+srv://nandini:inidnan@cluster0.jhnsmcm.mongodb.net/go-food-mern?retryWrites=true&w=majority";
const port = 4000;

app.use(cors());
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(express.json());

app.use("/api", CreateUser);
app.use("/api", DisplayData);
app.use("/api", OrderData);

mongoose
  .connect(mongoDBURL, { useNewUrlParser: true })
  .then(async () => {
    console.log("connected to database successfully");

    app.listen(port, (request, response) => {
      console.log(`app is listening on port ${port}`); //connect to express server only if database connection is successful
    });

    const fetched_data = await mongoose.connection.db.collection("food_data");
    fetched_data.find({}).toArray(async function (err, data) {
      const foodCategory = await mongoose.connection.db.collection(
        "food_collection"
      );
      foodCategory.find({}).toArray(function (err, catData) {
        if (err) console.log(err);
        else {
          global.food_data = data;
          global.food_category = catData;
        }
      });
      
    });
  })
  .catch((error) => {
    console.log(error);
  });
