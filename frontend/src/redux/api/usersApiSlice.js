import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../features/constants";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: "POST",
                body: data,
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            })
        }),
        register : builder.mutation({
            query : (data) => ({
                url : `${USERS_URL}`,
                method:"post",
                body : data,
            }) 
        }),
        profile : builder.mutation ({
            query : (data) => ({
                url : `${USERS_URL}/profile`,
                method : "PUT",
                body : data,
            })
        }),
        getUsers : builder.query ({ // <-- Changed from builder.mutation to builder.query
            query : () => ({
                url : USERS_URL,  
            }),
            providesTags: ['Users'],
            keepUnusedDataFor : 5,
        }),
        deleteUser : builder.mutation({
            query: userId => ({
                url : `${USERS_URL}/${userId}`,
                method: "DELETE",
            })
        }),
        getUserDetails : builder.query({
            query : (id) => ({
                url : `${USERS_URL}/${id}`
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({
            query: data => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ["User"],
        })
    })
})

export const { 
    useLoginMutation, 
    useLogoutMutation, 
    useRegisterMutation, 
    useProfileMutation,
    useGetUsersQuery,     // This will now correctly map to getUsers query
    useDeleteUserMutation,
    useGetUserDetailsQuery, // Note: GetUserDetails was already a query, so its hook ends in Query
    useUpdateUserMutation
} = userApiSlice;