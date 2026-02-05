import { Router } from "express";
import {
  createPhotographerProfile,
  getPhotographerProfileByUserId,
  getPhotographerProfileByUsername,
  updatePhotographerProfile,
  browsePhotographers,
} from "../controllers/photographer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  CreatePhotographerProfileSchema,
  UpdatePhotographerProfileSchema,
} from "../validations/photographer.validation";

const photographerRouter = Router();

// Public routes (no auth required)
photographerRouter.get("/browse", browsePhotographers); // Browse/search photographers
photographerRouter.get("/:username", getPhotographerProfileByUsername); // Get single photographer profile

// Protected routes (authentication required)
photographerRouter
  .use(authMiddleware)
  .post(
    "/create",
    validateRequest(CreatePhotographerProfileSchema),
    createPhotographerProfile,
  )
  .get("/profile", getPhotographerProfileByUserId)
  .patch(
    "/update",
    validateRequest(UpdatePhotographerProfileSchema),
    updatePhotographerProfile,
  );

export default photographerRouter;
