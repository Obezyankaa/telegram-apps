import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import "./i18n";
import Settings from "./settings/Settings";
import HomePage from "./pages/HomePage";
import Shop from "./components/shop/Shop";
import NotFound from "./ui/NotFound";
import History from "./components/History/History";
import NftDetails from "./components/NftDetails/NftDEtails";

// const manifestUrl =
//   "https://my-gituser.github.io/telegram-apps/tonconnect-manifest.json";

  const manifestUrl =
    "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/setting",
        element: <Settings />,
      },
      {
        path: "NftDetails/:nftId",
        element: <NftDetails />,
      },
    ],
    errorElement: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <RouterProvider router={router} />
  </TonConnectUIProvider>
);
