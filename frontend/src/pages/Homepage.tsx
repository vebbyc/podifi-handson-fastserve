import { FunctionComponent, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import NotificationMsg from "../components/NotificationMsg";
import ItemCard from "../components/ItemCard";
import { useQuery } from "react-query";

import * as apiClient from "../api-client";
import { capitalizeFirstLetter } from "../utilities/StringUtility";
import { useNotification } from "../contexts/NotificationContext";

const Homepage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { showNotification, hideNotification } = useNotification();

  useEffect(() => {
    hideNotification();
  }, []);

  const onButtonContainerClick = useCallback(() => {
    navigate("/view-order");
  }, [navigate]);

  const onItemCardContainerClick = useCallback(
    (id: string) => {
      navigate(`/item-detail/${id}`);
    },
    [navigate]
  );

  const onRefreshButtonFrameIconClick = useCallback(() => {
    window.location.reload();
  }, [window]);

  const {
    data: menu,
    error,
    isError,
    isLoading,
  } = useQuery("activeMenu", apiClient.getActiveMenu, {
    retry: false,
    onError: () =>
      showNotification({
        type: "No Menu",
        notificationData: [],
      }),
    onSuccess: () => {},
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <></>;
  return (
    <div className="relative bg-white w-full h-[1024px] flex flex-col items-start justify-start">
      <main className="self-stretch bg-white flex flex-col items-start justify-start py-[43px] px-5 gap-[20px]">
        <header className="self-stretch flex flex-row items-start justify-start gap-[36px] text-left text-13xl text-gray-100 font-aleo sm:flex-row sm:gap-[1px] sm:items-start sm:justify-start">
          <div className="flex flex-row items-start justify-between">
            <b className="relative">
              {capitalizeFirstLetter(menu?.type ?? "")} Time Menu
            </b>
          </div>
          <img
            className="relative w-[37px] h-[37px] overflow-hidden shrink-0 object-cover cursor-pointer"
            alt=""
            src="/refreshbuttonframe@2x.png"
            onClick={onRefreshButtonFrameIconClick}
          />
          <div className="self-stretch flex-1 flex flex-col items-end justify-start py-0.5 px-3.5">
            <Button
              buttonText="View Order"
              onButtonContainerClick={onButtonContainerClick}
              buttonMinWidth="unset"
            />
          </div>
        </header>
        <div className="self-stretch flex flex-col items-start justify-start">
          <img
            className="self-stretch relative max-w-full overflow-hidden h-0.5 shrink-0 object-cover"
            alt=""
            src="/separator@2x.png"
          />
        </div>
        {/* <NotificationMsg
          notificationIconFrame="/notificationiconsuccess.png"
          notificationMainMessage="Order successfully placed"
        /> */}

        {(menu?.menuItems?.length ?? 0) > 0 ? (
          <section className="self-stretch flex flex-row flex-wrap items-start justify-start py-6 px-px gap-[30px]">
            {menu?.menuItems.map((item) => (
              <ItemCard
                key={item.menuItemId}
                menuItemCode={item.imageUrl}
                itemName={item.name}
                itemPrice={item.price.toString()}
                itemCardItemImageFrameWidth="238px"
                itemCardItemImageIconWidth="unset"
                itemCardItemImageIconAlignSelf="stretch"
                itemCardItemImageIconOverflow="hidden"
                onItemCardContainerClick={() =>
                  onItemCardContainerClick(item.menuItemId)
                }
              />
            ))}
          </section>
        ) : (
          <div>No available menu item at this moment</div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
