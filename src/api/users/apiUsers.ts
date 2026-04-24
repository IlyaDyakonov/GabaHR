import type { AddUserPayload, AddUserResponse, UsersResponse } from "../../types/users";


const USERS_API_URL = "https://dummyjson.com/users";


export async function getAllUsers(): Promise<UsersResponse> {
    const response = await fetch(USERS_API_URL);

    if (!response.ok) {
        throw new Error(`Failed to load users: ${response.status}`);
    }

    const data = (await response.json()) as UsersResponse;
    return data;
}


export async function addUser(payload: AddUserPayload): Promise<AddUserResponse> {
    const response = await fetch(`${USERS_API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to add user: ${response.status}`);
    }

    return (await response.json()) as AddUserResponse;
}
