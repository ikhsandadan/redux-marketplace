import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
	ItemsCreateRequest,
	UserDeleteRequest,
	ItemDeleteRequest,
	UserModel,
	ItemModel,
	UserResponse,
	ItemResponse,
	UserUpdateRequest,
	ItemUpdateRequest,
	BuyItemRequest,
} from "./types";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { ErrorResponse } from "../error-types";

// Define our service using a base URL and expected endpoints
export const blogApi = createApi({
	reducerPath: "blogApi",
	// Change `localhost` to a forwarded address if using a cloud
	// environment
	baseQuery: fetchBaseQuery({
    	// Replace your address here if needed i.e. your forwarded address from a cloud environment
    	baseUrl: "http://127.0.0.1:4040/api/",
    	prepareHeaders: (headers, { getState, endpoint }) => {
        	const token = (getState() as RootState).auth.token;
        	// Some of the endpoints don't require logins
        	if (
            	token &&
            	endpoint !== "posts/all" &&
            	!endpoint.startsWith("posts/user") &&
				endpoint !== "users/all"
        	) {
            	headers.set("Authorization", `Bearer ${token}`);
        	}
        	return headers;
    	},
    	credentials: "include",
	}),
    refetchOnFocus: true,
    refetchOnReconnect: true,
	tagTypes: ["BlogModel", "UserModel", "ItemModel"],
	endpoints: (builder) => {
    	return {
			getAllItems: builder.query<ItemModel[], void>({
            	query: () => ({
                	url: "items/item/all",
            	}),
            	transformResponse: (response: { items: ItemModel[] }, _meta, _arg) =>
                	response.items,
            	transformErrorResponse: (response, _meta, _arg) => {
                	return response.data as ErrorResponse;
            	},
            	providesTags: ["ItemModel"],
        	}),
			getAllUsers: builder.query<UserModel[], void>({
            	query: () => ({
                	url: "users/all",
            	}),
            	transformResponse: (response: { users: UserModel[] }, _meta, _arg) =>
                	response.users,
            	transformErrorResponse: (response, _meta, _arg) => {
                	return response.data as ErrorResponse;
            	},
            	providesTags: ["UserModel"],
        	}),
			deleteUser: builder.mutation<UserResponse, UserDeleteRequest>({
            	query: (body) => ({
                	url: "users/user/delete",
                	method: "DELETE",
                	credentials: "include",
                	body: { id: body.id },
            	}),
            	invalidatesTags: ["UserModel"],
            	transformErrorResponse(response, _meta, _arg) {
                	return response.data as ErrorResponse;
            	},
        	}),
			updateUser: builder.mutation<UserResponse, UserUpdateRequest>({
            	query: (body) => ({
                	url: "users/user/update",
                	method: "PUT",
                	credentials: "include",
                	body: body,
            	}),
            	invalidatesTags: ["UserModel"],
            	transformErrorResponse(response, _meta, _arg) {
                	return response.data as ErrorResponse;
            	},
        	}),
			createItem: builder.mutation<ItemResponse, ItemsCreateRequest>({
            	query: (body) => ({
                	url: "items/item/create",
                	method: "POST",
                	credentials: "include",
                	body: body,
                	validateStatus(response) {
                    	console.log(response);
                    	return response.ok === true;
                	},
            	}),
            	invalidatesTags: ["ItemModel"],
            	transformErrorResponse(response, _meta, _arg) {
                	return response.data as ErrorResponse;
            	},
        	}),
			getItemsByUsername: builder.query<ItemModel[], string>({
            	query: (user) => `items/user/${user}`,
            	transformResponse: (response: { items: ItemModel[] }, _meta, _arg) =>
                	response.items,
            	transformErrorResponse(response, _meta, _arg) {
                	return response.data as ErrorResponse;
            	},
            	providesTags: ["ItemModel"],
        	}),
			deleteItem: builder.mutation<ItemResponse, ItemDeleteRequest>({
            	query: (body) => ({
                	url: "items/item/delete",
                	method: "DELETE",
                	credentials: "include",
                	body: { id: body.id, title: body.title },
            	}),
            	invalidatesTags: ["ItemModel"],
            	transformErrorResponse(response, _meta, _arg) {
                	return response.data as ErrorResponse;
            	},
        	}),
			updateItem: builder.mutation<ItemResponse, ItemUpdateRequest>({
            	query: (body) => ({
                	url: "items/item/update",
                	method: "PUT",
                	credentials: "include",
                	body: body,
            	}),
            	invalidatesTags: ["ItemModel"],
            	transformErrorResponse(response, _meta, _arg) {
                	return response.data as ErrorResponse;
            	},
        	}),
			buyItem: builder.mutation<ItemResponse, BuyItemRequest>({
            	query: (body) => ({
                	url: "items/item/buy",
                	method: "PUT",
                	credentials: "include",
                	body: body,
            	}),
            	invalidatesTags: ["ItemModel"],
            	transformErrorResponse(response, _meta, _arg) {
                	return response.data as ErrorResponse;
            	},
        	}),
			getBoughtItemsByUsername: builder.query<ItemModel[], string>({
            	query: (user) => `items/buyer/${user}`,
            	transformResponse: (response: { items: ItemModel[] }, _meta, _arg) =>
                	response.items,
            	transformErrorResponse(response, _meta, _arg) {
                	return response.data as ErrorResponse;
            	},
            	providesTags: ["ItemModel"],
        	}),
    	};
	},
});

// Exporting the generated methods from createApi
export const {
	useLazyGetAllItemsQuery,
	useLazyGetBoughtItemsByUsernameQuery,
	useLazyGetAllUsersQuery,
	useLazyGetItemsByUsernameQuery,
	useGetItemsByUsernameQuery,
	useGetAllItemsQuery,
	useGetBoughtItemsByUsernameQuery,
	useGetAllUsersQuery,
	useCreateItemMutation,
	useDeleteUserMutation,
	useDeleteItemMutation,
	useUpdateUserMutation,
	useUpdateItemMutation,
	useBuyItemMutation,
} = blogApi;