// backend/src/routes/menu.ts
import { Router } from 'express';
import { MenuController } from '../controllers/MenuControllers';

// Create a router instance ( https://localhost:3000/api/menu/ )
const router = Router();

router.get('/', MenuController.getActiveMenu);
router.get('/items/:id', MenuController.getMenuItem)
// router.post("/", menuController.addMenuItem)

export default router;
