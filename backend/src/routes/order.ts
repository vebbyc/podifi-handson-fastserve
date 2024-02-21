import { Router } from "express";
import { MenuController } from "../controllers/MenuControllers";

const router = Router();

router.get("/", MenuController.getOrder)
router.post("/addToOrder", MenuController.addToOrder)

export default router;

