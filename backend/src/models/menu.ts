import mongoose from "mongoose";
import { MenuItemDTO, menuItemSchema, menuSchema } from "../shared/types";

export type MealType = "breakfast" | "lunch" | "dinner" | undefined;

export class MenuType {
    _id: string;
    startTime: string;
    endTime: string;
    menuItems: MenuItemType[];

    constructor(_id: string, startTime: string, endTime: string, menuItems: MenuItemType[]) {
        this._id = _id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.menuItems = menuItems;
    }
}

export type MenuItemType = {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

const Menu = mongoose.model<MenuType>("Menu", menuSchema)

export const MenuItem = mongoose.model<MenuItemType>("MenuItem", menuItemSchema)
export default Menu;