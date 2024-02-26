import mongoose, { mongo } from "mongoose";
import { MenuType, MenuItemType, MealType } from "../models/menu";
import { OrderItemType } from "../models/order";

//TODO: MenuDTO


export class MenuDTO {
    type: MealType
    menuItems: MenuItemDTO[];

    constructor(menu: MenuType) {
        this.menuItems = menu.menuItems.map(menuItem => new MenuItemDTO(menuItem))
        this.type = this.getMenuType(menu.startTime);
        // this.type = menu.getMenuType()
    }

    getMenuType(startTime: string): MealType {
        const hour = parseInt(startTime.split(":")[0]);
        if (hour >= 8 && hour < 12) {
            return "breakfast";
        } else if (hour >= 12 && hour < 17) {
            return "lunch";
        } else if (hour >= 17 && hour < 22) {
            return "dinner";
        } else {
            return undefined; // Outside the defined meal times
        }
    }

}

//TODO: MenuItemDTO
export class MenuItemDTO {
    constructor(menuItem: MenuItemType) {
        this.menuItemId = menuItem._id;
        this.name = menuItem.name;
        this.description = menuItem.description;
        this.price = menuItem.price;
        this.imageUrl = menuItem.imageUrl;
    }
    menuItemId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export const menuSchema = new mongoose.Schema<MenuType>({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }]
})

export const menuItemSchema = new mongoose.Schema<MenuItemType>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
})

//TODO: Order Related Models
export type OrderDTO = {
    totalOrderPrice: number;
    orderItems: OrderItemDTO[];
}

export const orderSchema = new mongoose.Schema<OrderDTO>({
    totalOrderPrice: { type: Number, required: true },
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItems" }],
})

//TODO: Order Item Related Models

export class OrderItemDTO {
    menuItemId: string;
    menuItemName: string
    menuItemDescription: string
    menuItemPrice: number
    menuItemImageUrl: string;
    quantity: number;
    itemTotal: number;

    constructor(orderItem: OrderItemType) {

        this.menuItemId = orderItem.menuItemId._id;
        this.menuItemName = orderItem.menuItemId.name;
        this.menuItemDescription = orderItem.menuItemId.description;
        this.menuItemPrice = orderItem.menuItemId.price;
        this.menuItemImageUrl = orderItem.menuItemId.imageUrl;
        this.quantity = orderItem.quantity;
        this.itemTotal = orderItem.quantity * orderItem.menuItemId.price
    }
}

export const orderItemSchema = new mongoose.Schema<OrderItemType>({
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, required: true }
})

//TODO: Notification Related Models

export type NotificationDTO = {
    type: string
    notificationData: string[]
}

export const notificationSchema = new mongoose.Schema<NotificationDTO>({
    type: { type: String, required: true },
    notificationData: [{ type: String }],
})