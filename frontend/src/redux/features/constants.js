export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://your-backend-url.onrender.com' : '';
// or whatever your specific BASE_URL setup is
export const USERS_URL = "/api/users";
export const CATEGORY_URL = "/api/category";
export const PRODUCT_URL = '/api/products';
export const UPLOAD_URL = '/api/uploads';
export const ORDERS_URL = '/api/orders'; 
export const PAYPAL_URL = '/api/config/paypal';