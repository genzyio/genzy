import { createRoot } from "react-dom/client";
import { App } from "./app";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { API_URL } from "./url";
import axios from "axios";

const toastrOptions: ToastContainerProps = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = false;

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>

    <ToastContainer {...toastrOptions} />
  </>
);
