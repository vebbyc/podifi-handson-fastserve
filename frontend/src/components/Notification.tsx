import { FunctionComponent } from "react";
import { useNotification } from "../contexts/NotificationContext";
import NotificationMsg from "./NotificationMsg";

const NotificationPopUp: FunctionComponent = () => {
  const { notification } = useNotification();
  if (!notification) {
    console.log("No notification to display.");
    return null;
  }

  switch (notification.type) {
    case "Item Added":
      const message = notification.notificationData.join(" ");
      // if (message) {
      return (
        <NotificationMsg
          notificationBackgroundColor="#C3F2CB"
          notificationIconFrame="/notificationiconsuccess.png"
          notificationMainMessage="Item added to order!"
          // onDismiss={() => completion()}
        />
      );
    case "Order Placed":
      return (
        <NotificationMsg
          notificationBackgroundColor="#C3F2CB"
          notificationIconFrame="/notificationiconsuccess.png"
          notificationMainMessage="Order placed successfully!"
          // onDismiss={() => completion()}
        />
      );
    case "No Menu":
      return (
        <NotificationMsg
          notificationBackgroundColor="#FFEEAA"
          notificationIconFrame="/notificationiconframe@2x.png"
          notificationMainMessage="No available menu at this moment"
        />
      );
    case "error":
      return (
        <NotificationMsg
          notificationBackgroundColor="#FFEEAA"
          notificationIconFrame="/notificationiconframe@2x.png"
          notificationMainMessage={notification.notificationData.join(", ")}
        />
      );
    default:
      return null;
      console.error("Invalid notification type.");
      break;
  }
};

export default NotificationPopUp;
