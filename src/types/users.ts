// Типизации для пользователей

export interface UserPreview {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    address: {
        city: string;
        country: string;
    };
    bank: {
        cardNumber: string;
    };
};

export interface UsersResponse {
    users: UserPreview[];
    total: number;
    skip: number;
    limit: number;
}