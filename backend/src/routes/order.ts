import { Router } from "express";
import { MenuController } from "../controllers/MenuControllers";

const router = Router();

router.get("/", MenuController.getOrder)
router.post("/", MenuController.addToOrder)
router.put("/", MenuController.updateOrder)
router.delete("/", MenuController.removeOrderItem)
router.post("/confirm", MenuController.confirmOrder)

export default router;

