import { RouterProvider } from "react-router-dom";
import MessageToast from "./components/MessageToast";

import { router } from "./router";

function App() {
  return (
    <>
      <MessageToast />
      <RouterProvider router={router} />
    </>
  );
}

export default App;