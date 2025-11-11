import "@ant-design/v5-patch-for-react-19";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { App as AntApp, ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1447e6",
            // colorPrimaryHover: "#3fa65e",
            // colorPrimaryActive: "#267a44",
            // colorBorder: "#d1d5db",
            // colorBgContainer: "#f3f4f6",
            // borderRadius: 8,
            fontFamily: "Poppins, sans-serif",
          },
          components: {
            Input: {
              colorBorder: "#d1d5db",
              colorBorderHover: "#308a4e",
              colorPrimaryHover: "#308a4e",
              activeBorderColor: "#308a4e",
              activeShadow: "0 0 0 2px rgba(48,138,78,0.3)",
            },
            Menu: {
              colorBgContainer: "#ffffff",
              itemSelectedBg: "#d4edda", // light green background
              itemSelectedColor: "#0f5132", // dark green text
              itemMarginInline: 10, // removes the left/right gaps
            },
          },
        }}
      >
        <AntApp>
          <App />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
