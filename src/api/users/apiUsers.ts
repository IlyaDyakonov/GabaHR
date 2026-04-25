import type {
    AddUserPayload,
    AddUserResponse,
    DeleteUserResponse,
    UpdateUserPayload,
    UpdateUserResponse,
    UsersResponse,
} from "../../types/users";


const USERS_API_URL = "https://dummyjson.com/users";


/**
 * Загружает список пользователей из DummyJSON.
 */
export async function getAllUsers(): Promise<UsersResponse> {
    const response = await fetch(USERS_API_URL);

    if (!response.ok) {
        throw new Error(`Failed to load users: ${response.status}`);
    }

    const data = (await response.json()) as UsersResponse;
    return data;
}


/**
 * Создает пользователя через DummyJSON и возвращает ответ API.
 */
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


/**
 * Обновляет выбранные поля пользователя.
 * Payload может содержать как простые поля, так и вложенные address/bank.
 */
export async function updateUser(
    userId: number,
    payload: UpdateUserPayload,
): Promise<UpdateUserResponse> {
    const response = await fetch(`${USERS_API_URL}/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
    }

    return (await response.json()) as UpdateUserResponse;
}


/**
 * Удаляет пользователя по id через DummyJSON.
 */
export async function deleteUser(userId: number): Promise<DeleteUserResponse> {
    const response = await fetch(`${USERS_API_URL}/${userId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
    }

    return (await response.json()) as DeleteUserResponse;
}
