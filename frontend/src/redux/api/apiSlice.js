import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../features/constants"; // Make sure BASE_URL is "" if using Vite proxy

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL, 
  credentials: 'include' // Required for sending/receiving HTTP-only cookies
});

export const apiSlice = createApi({
  baseQuery, 
  tagTypes: ['product', 'order', 'user', 'category'],
  endpoints: () => ({}),
}); 