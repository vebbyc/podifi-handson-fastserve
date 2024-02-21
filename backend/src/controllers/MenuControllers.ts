// backend/src/controllers/MenuController.ts
import { Request, Response } from "express";
import Menu, { MenuType, MenuItem, MenuItemType } from "../models/menu";
import { MenuDTO, MenuItemDTO } from "../shared/types";
import { OrderItem } from "../models/order";

export class MenuController {
  static async getOrderItems(req: Request, res: Response) {
    try {
      const menuItemId: string = req.params.menuItemId;

      // Validate menuItemId
      if (!menuItemId || menuItemId === "") {
        return res.status(400).json({ message: "Invalid menuItemId" });
      }

      // Query the database for the order item
      const orderItems = await OrderItem.find().populate("menuItems")

      // If orderItem is found, return it
      if (!orderItems) {
        return res.status(404).json({ message: "Order item not found" });
      }
      return res.status(200).json(orderItems);
    } catch (error) {
      // Handle database exceptions or connectivity issues
      console.error("Error retrieving order item:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getActiveMenu(req: Request, res: Response) {
    try {
      const currentTime = new Date();
      const currentHour = currentTime.getHours() + 3;
      const currentMinute = currentTime.getMinutes();
      const currentFormattedTime = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      // Find active menu based on current time
      const activeMenu = await Menu.findOne({
        startTime: { $lte: currentFormattedTime },
        endTime: { $gte: currentFormattedTime },
      }).populate("menuItems");

      if (!activeMenu) {
        return res.status(404).json({ message: "No active menu found." });
      }
      res.status(200).json(new MenuDTO(activeMenu));
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }

  static async getMenuItem(req: Request, res: Response) {
    try {
      // Get menuItemId from request parameters
      const menuItemId: string = req.params.id;

      // Validate menuItemId
      if (!menuItemId) {
        return res.status(400).json({ error: "Invalid menuItemId" });
      }

      // Query the database for the menuItem
      const menuItem: MenuItemType | null = await MenuItem.findById(menuItemId);

      // Check if menuItem exists
      if (!menuItem) {
        return res.status(404).json({ error: "MenuItem not found" });
      }

      // Return MenuItemDTO to the frontend
      return res.status(200).json(new MenuItemDTO(menuItem));
    } catch (error) {
      console.error("Error fetching menu item:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
