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

// export default Notification;
