import OrderData from "./Components/OrderData";
import Home from "./Components/Home";
import Login from "./Components/Login";
import UserData from "./Components/UserData";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
          </Route>
          <Route path="/login" element={<Login />}>
          </Route>
          <Route path="/Orders" element={<OrderData />}>
          </Route>
          <Route path="/Users" element={<UserData />}>
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
