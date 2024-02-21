import React, {
  FunctionComponent,
  ReactNode,
  useContext,
  useState,
} from "react";
import NotificationMsg from "../components/NotificationMsg";
import { NotificationDTO } from "../../../backend/src/shared/types";

type NotificationContext = {
  notification: NotificationDTO | null;
  showNotification: (data: NotificationDTO) => void;
  hideNotification: () => void;
};

const NotificationContext = React.createContext<
  NotificationContext | undefined
>(undefined);

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notification, setNotification] = useState<NotificationDTO | null>(
    null
  );

  const showNotification = ({ type, notificationData }: NotificationDTO) => {
    setNotification({ type, notificationData });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, hideNotification }}
    >
      {displayNotification(notification, hideNotification)}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContext => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

const displayNotification = (
  notification: NotificationDTO | null | undefined,
  completion: () => void
) => {
  if (!notification) {
    console.log("No notification to display.");
    return;
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
      // }
      break;
    case "Order Placed":
      console.log("Order placed. Thank you!");
      break;
    case "No Menu":
      return (
        <NotificationMsg
          notificationBackgroundColor="#FFEEAA"
          notificationIconFrame="/notificationiconframe@2x.png"
          notificationMainMessage="No available menu at this moment"
          // onDismiss={() => completion()}
        />
      );
      break;
    default:
      console.error("Invalid notification type.");
      break;
  }
};

export default Notification;
