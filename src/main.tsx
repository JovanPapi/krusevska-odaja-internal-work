import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import MainApplication from "./MainApplication.tsx";
import ApplicationProvider from "./store/Index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Toaster
      toastOptions={{
        duration: 4000,
        position: "top-center",
        style: { fontSize: "1.2rem" },
      }}
    />
    <ApplicationProvider>
      <MainApplication />
    </ApplicationProvider>
  </>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
