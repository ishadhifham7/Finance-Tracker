import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#12151c",
            color: "#eef1f6",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
