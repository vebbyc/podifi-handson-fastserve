import { MenuDTO, MenuItemDTO, OrderItemDTO } from "../../backend/src/shared/types";

const API_BASE_URL = "http://localhost:3000/api";

type RequestOrderParam = {
  menuItemId: string;
  quantity: number;
}

//MARK: Order
export const addItemOrder = async (request: RequestOrderParam): Promise<OrderItemDTO> => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
    if (!response) {
      throw new Error("No response from server")
    }
    return response.json()

  } catch (error) {
    throw new Error("Error adding item to order: ")
  }
}


//MARK: Menu
export const getActiveMenu = async (): Promise<MenuDTO> => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error fetching menu");
    }

    return response.json();
  } catch (error) {
    throw new Error("Error fetching menu");
  }
};

export const getItemDetail = async (itemId: string): Promise<MenuItemDTO | null> => {
  try {
    // Call MenuController function to fetch details of the selected menu item
    const response = await fetch(`${API_BASE_URL}/menu/items/${itemId}`);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Error fetching item details");
    }

    // Parse the response as JSON
    const menuItem: MenuItemDTO = await response.json();

    // Validate the MenuItem object
    if (!menuItem || !menuItem.name || !menuItem.description || !menuItem.price) {
      throw new Error("Invalid item details");
    }

    return menuItem;
  } catch (error) {
    console.error("Error fetching item details:", (error as Error).message);
    return null;
  }
};
