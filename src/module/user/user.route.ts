import { Router, type Request, type Response } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post('/auth/signup', userController.signupUser)






export const userRoute = router;