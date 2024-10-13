export interface UserModel {
	id: number;
	username: string;
	email: string;
	password: string;
	salt: string;
	role: string;
};

export interface ItemModel {
	id: number;
	sellerId: number;
	sellerUserName: string;
	title: string;
	price: number;
	quantity: number;
	description: string;
	image: string;
	status: string;
	buyers: number[];
	createdAt: Date;
	updatedAt: Date;
};

export interface ItemsCreateRequest {
	title: string;
	price: number;
	quantity: number;
	description: string | null;
	image: string | null;
};

export interface UserDeleteRequest {
	id: number;
};

export interface ItemDeleteRequest {
	id: number;
	title: string;
};

export interface UserUpdateRequest extends UserDeleteRequest {
	username: string;
	email: string;
	password: string;
	role: string;
};

export interface ItemUpdateRequest extends ItemDeleteRequest {
	price: number;
	quantity: number;
	description: string;
	image: string;
	status: string;
};

export interface BuyItemRequest extends ItemDeleteRequest {
	sellerId: number;
	quantity: number;
	buyers: number[];
};

export interface UserResponse {
	message?: string;
	status?: number;
	ok?: boolean;
	error?: string;
	reason?: string;
};

export interface ItemResponse {
	message?: string;
	status?: number;
	ok?: boolean;
	error?: string;
	reason?: string;
};