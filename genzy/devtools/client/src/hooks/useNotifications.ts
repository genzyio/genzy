import { toast } from "react-toastify";

export function useNotifications() {
  return notifications;
}

export const notifications = {
  success: function (text: string) {
    toast.success(text);
  },

  error: function (text: string) {
    toast.error(text);
  },
};
