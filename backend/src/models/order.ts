import mongoose from "mongoose";
import { orderItemSchema } from "../shared/types";
import { MenuItemType } from "./menu";

export type OrderItemType = {
  _id: string
  menuItemId: MenuItemType
  quantity: number
}

export const OrderItem = mongoose.model<OrderItemType>("OrderItem", orderItemSchema)
