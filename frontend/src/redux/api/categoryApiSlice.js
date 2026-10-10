import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../features/constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (newCategory) => ({
                url: `${CATEGORY_URL}`,
                method: "POST",
                body: newCategory,
            }),
            invalidatesTags: ["Category"], // 👈 Tells RTK Query to refetch categories on create
        }),

        updateCategory: builder.mutation({
            query: ({ categoryId, updatedCategory }) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "PUT",
                body: updatedCategory,
            }),
            invalidatesTags: ["Category"], // 👈 Tells RTK Query to refetch categories on update
        }),

        deleteCategory: builder.mutation({
            query: (categoryId) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"], // 👈 Tells RTK Query to refetch categories on delete
        }),

        fetchCategories: builder.query({
            query: () => `${CATEGORY_URL}`,
            providesTags: ["Category"], // 👈 Tags the fetched list
        }),
    }),
});

export const {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery,
} = categoryApiSlice;