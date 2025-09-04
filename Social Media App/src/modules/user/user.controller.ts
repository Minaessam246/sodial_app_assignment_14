import { Router } from "express";
import { authentication } from "../../middleware/authentication.middelware";
import userServices from "./user.services";
import * as validators from "./user.validation"
import { validation } from "./../../middleware/validation.middleware";

const router=Router()
router.get("/profile",authentication(["System","Bearer"],"access"),userServices.profile)
router.patch("/logout",authentication(["System","Bearer"],"access"),userServices.logout)
router.post("/refresh-token",authentication(["System","Bearer"],"refresh"),userServices.refreshToken)
export default router;