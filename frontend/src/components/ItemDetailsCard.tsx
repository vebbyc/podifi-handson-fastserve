import { FunctionComponent, useCallback, useState } from "react";
import { Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { OrderItemDTO } from "../../../backend/src/shared/types";
import { useNotification } from "../contexts/NotificationContext";

const API_BASE_URL = "";

type ItemDetailsCardType = {
  itemDetailsId: string;
  itemDetailsCardItemImage?: string;
  itemDetailsCardItemName?: string;
  itemDetailsCardItemDescription?: string;
  itemDetailsCardItemPrice?: string;

  /**Action props */
  onAddToOrder?: (quantity: number) => void;
};

// export const addToOrder = async (
//   menuItemId: string,
//   quantity: number
// ): Promise<OrderItemDTO> => {
//   const body = new URLSearchParams();
//   body.append("menuItemId", menuItemId);
//   body.append("quantity", quantity.toString());

//   const response = await fetch(`${API_BASE_URL}/api/menus/order`, {
//     method: "POST",
//     body: body,
//     credentials: "include",
//   });
//   if (!response.ok) {
//     throw new Error(await getErrorMessageFromResponse(response));
//   }
//   return response.json();
// };

const ItemDetailsCard: FunctionComponent<ItemDetailsCardType> = ({
  itemDetailsId,
  itemDetailsCardItemImage,
  itemDetailsCardItemName,
  itemDetailsCardItemDescription,
  itemDetailsCardItemPrice,
  onAddToOrder,
}) => {
  const navigate = useNavigate();

  const { showNotification } = useNotification();

  const [quantity, setQuantity] = useState<number>(1);

  const onButtonContainerClick = useCallback(() => {
    const orderItem = apiClient.addItemOrder({
      menuItemId: itemDetailsId,
      quantity,
    });
    console.log(orderItem);
    showNotification({ type: "Item Added", notificationData: [] });

    onAddToOrder ? onAddToOrder(quantity) : {};
    navigate("/homepage");
  }, [navigate, quantity, onAddToOrder]);

  const onIncrementButtonContainerClick = useCallback(() => {
    setQuantity(quantity + 1);
  }, [quantity]);

  const onDecrementButtonContainerClick = useCallback(() => {
    const decrementQuantity = quantity > 1 ? quantity - 1 : quantity;
    setQuantity(decrementQuantity);
  }, [quantity]);

  return (
    <div className="bg-white flex flex-row items-start justify-start gap-[41px] text-left text-3xl text-gray-300 font-aleo sm:flex-col sm:gap-[41px] sm:items-center sm:justify-start">
      <img
        className="relative w-[238px] h-[227px] object-cover sm:flex"
        alt=""
        src={itemDetailsCardItemImage}
      />
      <div className="self-stretch flex flex-col items-start justify-start gap-[10px] sm:items-start sm:justify-start">
        <div className="flex-1 flex flex-row items-center justify-start gap-[50px] sm:flex-col">
          <div className="flex flex-col items-start justify-start gap-[5px] md:flex-col md:gap-[15px] md:pb-0 md:box-border sm:flex-col sm:items-center sm:justify-start">
            <div className="flex flex-row items-start justify-start md:h-auto md:flex-row sm:flex-col">
              <b className="relative">{itemDetailsCardItemName}</b>
            </div>
            <div className="flex flex-col items-start justify-start text-base md:flex-row">
              <b className="relative">{itemDetailsCardItemPrice}</b>
            </div>
          </div>
          <div className="w-[539px] flex flex-row items-start justify-start text-base sm:w-auto sm:[align-self:unset]">
            <div className="flex-1 relative sm:flex">
              {itemDetailsCardItemDescription}
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-center justify-end gap-[50px] sm:flex-col sm:gap-[20px] sm:items-end sm:justify-start">
          <div className="flex flex-row items-center justify-start gap-[10px]">
            <img
              className={`relative rounded-10xs w-[23px] h-[23px] object-cover ${
                quantity > 1 ? "opacity-100" : "opacity-10"
              }`}
              alt=""
              src="/itemdetailscarddecrementquantityframe@2x.png"
              onClick={onDecrementButtonContainerClick}
            />
            <Input
              className="bg-[transparent] font-aleo font-bold text-base text-gray-100"
              placeholder="1"
              value={quantity > 0 ? quantity : ""}
              type="number"
              size="sm"
              onChange={(e) => {
                const text = e.target.value;
                if (text === "") {
                  return;
                }
                const value = Number(text);
                setQuantity(value > 1 ? value : 1);
              }}
            />
            <img
              className="relative rounded-10xs w-[23px] h-[23px] object-cover"
              alt=""
              src="/itemdetailscardincrementquantityframe@2x.png"
              onClick={onIncrementButtonContainerClick}
            />
          </div>
          <Button
            buttonText="Add To Order"
            onButtonContainerClick={onButtonContainerClick}
            buttonMinWidth="unset"
          />
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsCard;
