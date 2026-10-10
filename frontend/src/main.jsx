import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/features/store.js";

import PrivateRoute from "./components/PrivateRoute.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import Profile from "./pages/user/Profile.jsx";

import AdminRoute from "./pages/admin/AdminRoute.jsx";
import UserList from "./pages/admin/UserList.jsx";
import CategoryList from "./pages/admin/CategoryList.jsx";
import ProductList from "./pages/admin/ProductList.jsx";
import AllProducts from "./pages/admin/AllProducts.jsx";
import ProductUpdate from "./pages/admin/ProductUpdate.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/auth/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";

import {PayPalScriptProvider} from "@paypal/react-paypal-js"
import Order from "./pages/Orders/Order.jsx";
import UserOrder from "./pages/user/UserOrder.jsx";
import OrderList from "./pages/admin/OrderList.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      
      {/* Fixed: Updated path from /favorites to /favorite */}
      <Route path="/favorite" element={<Favorites />} />


        <Route path="/product/:id" element={<ProductDetails/>} />
              <Route path="/cart" element={<Cart/>} />
               <Route path="/shop" element={<Shop/>} />
               <Route path="/user-orders" element={<UserOrder/>} />




      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder/>} />
        <Route path="/order/:id" element={<Order/>} />

      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categoryList" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproducts" element={<AllProducts />} />
        <Route path="orderslist" element={<OrderList />} />
        <Route path="product/Update/:id" element={<ProductUpdate />} />
                <Route path="dashboard" element={<AdminDashboard />} />


      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider>
        <RouterProvider router={router} />

      </PayPalScriptProvider>
      

      
    </Provider>
  </StrictMode>
);