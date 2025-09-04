import mongoose from "mongoose";

// export const connectionn=()=>{
//       mongoose.connect("mongodb://localhost:27017/social_app").then(()=>console.log("connected")
//     ).catch(()=>console.log("can't connect"))


// }
export const connectionn = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://localhost:27017/social_app");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Can't connect to MongoDB", error);
  }
};