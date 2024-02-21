// backend/src/models/notification.ts

import mongoose from "mongoose";
import { NotificationDTO, notificationSchema } from "../shared/types";

const Notification = mongoose.model<NotificationDTO>("Menu", notificationSchema)