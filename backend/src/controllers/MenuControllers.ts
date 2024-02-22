// backend/src/controllers/MenuController.ts
import { Request, Response } from "express";
import Menu, { MenuType, MenuItem, MenuItemType } from "../models/menu";
import { MenuDTO, MenuItemDTO, OrderDTO, OrderItemDTO } from "../shared/types";
import { OrderItem, OrderItemType } from "../models/order";
import { Document } from "mongoose";
import { ObjectId } from "mongodb";

export class MenuController {
  static async getOrderItem(
    menuItemId: string
  ): Promise<
    | (Document<unknown, {}, OrderItemType> &
      OrderItemType &
      Required<{ _id: string }>)
    | null
  > {
    try {
      // Validate menuItemId
      if (!menuItemId || typeof menuItemId !== "string" || menuItemId === "") {
        throw new Error("Invalid menuItemId");
      }

      // Query thek database for the order item
      const orderItem = await OrderItem.findOne({ menuItemId: menuItemId });

      // Check if orderItem exists
      if (!orderItem) {
        return null; // Return null if order item not found
      }

      // Return the orderItem
      return orderItem;
    } catch (error) {
      // Handle errors
      console.error("Error fetching order item:", error);
      throw new Error("Error fetching order item");
    }
  }

  static async updateOrderItem(
    menuItemId: string,
    newQuantity: number
  ): Promise<OrderItemDTO | null> {
    try {
      // Validate menuItemId
      if (!menuItemId || typeof menuItemId !== "string" || menuItemId === "") {
        throw new Error("Invalid menuItemId");
      }

      // Validate newQuantity
      if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
        throw new Error("Invalid newQuantity");
      }

      // Retrieve the current OrderItem from the database
      const orderItem = await MenuController.getOrderItem(menuItemId);

      // Check if OrderItem exists
      if (!orderItem) {
        throw new Error("OrderItem not found");
      }
      const updatedOrderItem = await orderItem.save();
      // Return the updated OrderItem
      return new OrderItemDTO(updatedOrderItem);
    } catch (error) {
      // Handle errors
      console.error("Error updating order item:", error);
      throw new Error("Error updating order item");
    }
  }

  static async addOrderItem(menuItemId: string, quantity: number): Promise<OrderItemDTO> {
    try {
      // Validate inputs
      if (!menuItemId || !quantity || typeof quantity !== "number" || quantity <= 0) {
        throw new Error("Invalid menuItemId or quantity");
      }

      // Create a new OrderItem
      const newOrderItem = new OrderItem({
        menuItemId: menuItemId,
        quantity: quantity
      });

      // Save the new OrderItem to the database
      await newOrderItem.save();

      // Return the OrderItemDTO
      return new OrderItemDTO(newOrderItem);
    } catch (error) {
      console.error("Error adding order item:", error);
      throw new Error("Error adding order item");
    }
  }

  static async addToOrder(req: Request, res: Response): Promise<OrderItemDTO | null> {
    try {
      // Extract menuItemId and quantity from the request body
      const { menuItemId, quantity } = req.body;

      // Validate inputs
      if (!menuItemId || !quantity || typeof quantity !== "number" || quantity <= 0) {
        res.status(400).json({ error: "Invalid menuItemId or quantity" });
        throw new Error("Invalid menuItemId or quantity");
      }

      // Check if the item exists in the order
      const existingOrderItem = await MenuController.getOrderItem(menuItemId);

      if (!existingOrderItem) {
        // If item doesn't exist, add it to the order
        const newOrderItem = await MenuController.addOrderItem(menuItemId, quantity);
        res.status(201).json(newOrderItem);
        return newOrderItem;
      }

      // If item exists, update its quantity
      const newQuantity = existingOrderItem.quantity + quantity;
      const updatedOrderItem = await MenuController.updateOrderItem(menuItemId, newQuantity);
      res.status(200).json(updatedOrderItem);
      return updatedOrderItem;

    } catch (error) {
      console.error("Error adding to order:", error);
      res.status(500).json({ error: "Error adding to order" });
      throw error;
    }
  }

  static async getOrderItems(): Promise<OrderItemDTO[]> {
    try {
      // Fetch order items from the database
      const orderItems = await OrderItem.find().populate("menuItemId")

      // Initialize an array to store OrderItemDTOs
      const orderItemDTOs = orderItems.map((item) => {
        return new OrderItemDTO(item)
      })

      return orderItemDTOs;
    } catch (error) {
      console.error("Error fetching order items:", error);
      throw new Error("Error fetching order items");
    }
  }

  static async getOrder(_: Request, res: Response): Promise<OrderDTO> {
    try {
      // Retrieve order items
      const orderItemDTOs: OrderItemDTO[] = await MenuController.getOrderItems();
      console.log(">>orderItemDTOs:", orderItemDTOs);

      // Calculate total order price
      const totalOrderPrice: number = orderItemDTOs.reduce((total, item) => total + item.itemTotal, 0);

      // Assemble OrderDTO
      const orderDTO: OrderDTO = {
        totalOrderPrice,
        orderItems: orderItemDTOs
      };
      res.status(200).json(orderDTO)
      return orderDTO;
    } catch (error) {
      console.error("Error retrieving order:", error);
      throw new Error("Error retrieving order");
    }
  }

  //To modify quantity order
  static async updateOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { menuItemId, quantity } = req.body;

      // Check for valid inputs
      if (!menuItemId || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: "Invalid input parameters" });
      }

      // Update order item in the database
      console.log(`>>> updateOrder (menuItemId:${menuItemId}, quantity:${quantity}) executing...`);

      await MenuController.updateOrderItem(menuItemId, quantity);

      // Fetch updated order details
      const updatedOrder: OrderDTO = await MenuController.getOrder(req, res);

      // Return the updated order
      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ error: "Internal Server Error" });
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
