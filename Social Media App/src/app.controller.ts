import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve("./config/.env.development") });

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import authController from "./modules/auth/auth.controller";
import userController from "./modules/user/user.controller";
import { errorHandler } from "./utils/response/error.response";
import { connectionn } from "./DB/connection.DB";






export const bootstrap = (): void => {
  const app: Express = express();

  // Middlewares
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
app.use(express.json())
  // Routes
  app.use("/auth", authController);
  app.use("/user", userController);
  app.get("/", async (req: Request, res: Response, next: NextFunction) => {
    res.json("Hello from app controller");
  });
  app.use("{/*dummy}", async (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({message:"not found route"});
  });
  app.use(errorHandler);
  //db connection
connectionn()


  // Start server
  app.listen(3000, (): void => {
    console.log(`Server is running 🧨🧨🧨🧨 on ${process.env.PORT}`);
  });
};
