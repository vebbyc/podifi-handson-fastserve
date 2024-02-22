import { Router } from "express";
import { MenuController } from "../controllers/MenuControllers";

const router = Router();

router.get("/", MenuController.getOrder)
router.post("/addToOrder", MenuController.addToOrder)
router.put("/modifyQuantity", MenuController.updateOrder)

export default router;

