import { Router } from "express";
import authSevices from "./auth.sevices";
import { validation } from "../../middleware/validation.middleware";
import * as validators from "./auth.validation"

const router: Router=Router();


router.get("/signup",validation(validators.signup),authSevices.signup)
router.get("/login",validation(validators.login),authSevices.login)
router.post("/signup-gmail",authSevices.signupGmail)
router.post("/login-gmail",authSevices.loginGmail)
router.post("/send-forgetPassword-code",authSevices.sendForgetCode)
router.post("/verify-forgetPassword-code",authSevices.verifyForgetCode)
router.patch("/resetPassword",authSevices.resetPassword)

router.get("/confirmEmail",authSevices.confirmEmail)

export default router;
