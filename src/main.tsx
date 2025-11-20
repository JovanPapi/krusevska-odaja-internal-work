import MainApplication from "./MainApplication.tsx";
import ApplicationProvider from "./store/Index.tsx";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApplicationProvider>
    <MainApplication />
    <Toaster
      toastOptions={{
        duration: 2750,
        position: "top-center",
        style: { fontSize: "1.2rem" },
      }}
    />
  </ApplicationProvider>,
);
