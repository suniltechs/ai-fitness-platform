import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/AuthProvider";
import NotificationProvider from "@/components/NotificationProvider";
import { Toaster } from "react-hot-toast";
import { ConfigProvider, theme } from "antd";
import App from "./App";
import "./index.css";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: "#22c55e", // Using a green primary to match the gym theme
              borderRadius: 12,
            },
          }}
        >
          <AuthProvider>
            <NotificationProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "#1f2937",
                    color: "#f3f4f6",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                  },
                }}
              />
            </NotificationProvider>
          </AuthProvider>
        </ConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
