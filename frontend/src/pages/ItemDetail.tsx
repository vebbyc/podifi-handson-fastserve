import { FunctionComponent, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ItemDetailsCard from "../components/ItemDetailsCard";

import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import { OrderItemDTO } from "../../../backend/src/shared/types";
import { useNotification } from "../contexts/NotificationContext";

const ItemDetail: FunctionComponent = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const onBackButtonFrameIconClick = useCallback(() => {
    navigate("/homepage");
  }, [navigate]);

  if (!itemId) {
    return <div>Invalid item ID</div>;
  }

  const { data: menuItem } = useQuery(
    "fetchMenuItems",
    () => apiClient.getItemDetail(itemId),
    { enabled: !!itemId }
  );

  const addToOrder = async (quantity: number): Promise<OrderItemDTO> => {
    const body = new URLSearchParams();
    body.append("menuItemId", itemId);
    body.append("quantity", quantity.toString());

    const response = await apiClient.addItemOrder({
      menuItemId: itemId,
      quantity: quantity,
    });
    if (!response) {
      showNotification({
        type: "error",
        notificationData: [],
      });
    }

    console.log(">>API POST SUCCESS", response);

    showNotification({
      type: "Item Added",
      notificationData: [
        `${quantity}x ${quantity} ${response.menuItemName}`,
        `$${response.menuItemPrice * quantity}`,
      ],
    });
    return response;
  };

  return (
    <div className="relative bg-white w-full h-[1024px] overflow-hidden flex flex-col items-start justify-start sm:flex-col">
      <section className="self-stretch flex flex-col items-start justify-start py-[43px] px-5 gap-[20px]">
        <header className="self-stretch flex flex-row items-start justify-start gap-[36px] text-left text-13xl text-gray-100 font-aleo">
          <img
            className="relative w-[37px] h-[37px] overflow-hidden shrink-0 object-cover cursor-pointer"
            alt=""
            src="/backbuttonframe@2x.png"
            onClick={onBackButtonFrameIconClick}
          />
          <div className="flex flex-row items-start justify-start">
            <b className="relative">Item Detail</b>
          </div>
        </header>
        <div className="self-stretch h-[1.1px] flex flex-col items-start justify-start">
          <img
            className="self-stretch relative max-w-full overflow-hidden h-0.5 shrink-0 object-cover"
            alt=""
            src="/separator@2x.png"
          />
        </div>
        <div className="self-stretch flex flex-row ite  ms-start justify-center py-5 px-0">
          <ItemDetailsCard
            itemDetailsId={menuItem?.menuItemId ?? ""}
            itemDetailsCardItemImage={menuItem?.imageUrl}
            itemDetailsCardItemName={menuItem?.name}
            itemDetailsCardItemPrice={menuItem?.price.toString()}
            itemDetailsCardItemDescription={menuItem?.description}
            onAddToOrder={(quantity) => addToOrder(quantity)}
          />
        </div>
      </section>
    </div>
  );
};

export default ItemDetail;
