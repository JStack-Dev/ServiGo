import { createBrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";

export const router = createBrowserRouter([
  {
    path: "/*",
    element: <AppRouter />,
  },
]);
