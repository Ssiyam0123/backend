import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

connectDb()
  .then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server is running on port : ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log("mongodb connection error", err);
  });
