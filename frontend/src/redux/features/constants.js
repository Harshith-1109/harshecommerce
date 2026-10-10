// frontend/src/redux/constants.js
export const BASE_URL = import.meta.env.PROD 
  ? "https://harshecommerce-backend.onrender.com" 
  : ""; // Uses Vite proxy locally, live backend URL in production

export const USERS_URL = "/api/users";
export const CATEGORY_URL = "/api/category";
export const PRODUCT_URL = '/api/products';
export const UPLOAD_URL = '/api/uploads';
export const ORDERS_URL = '/api/orders'; 
export const PAYPAL_URL = '/api/config/paypal';