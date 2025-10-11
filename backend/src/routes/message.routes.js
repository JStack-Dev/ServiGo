import express from "express";
import { sendMessage, getMessagesByService } from "../controllers/message.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/:serviceId", verifyToken, getMessagesByService);

export default router;
