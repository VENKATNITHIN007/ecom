import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { LoginSchema, RegisterSchema } from "../validations/auth.validation";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter
    .post("/login", validateRequest(LoginSchema), loginUser)
    .post("/register", validateRequest(RegisterSchema), registerUser)

userRouter
    .use(authMiddleware)
    .get("/me")
    .post("/logout")

export default userRouter;