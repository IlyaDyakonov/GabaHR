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

export interface AddUserPayload {
    firstName: string;
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
}

export interface AddUserResponse {
    id: number;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    address?: {
        city?: string;
        country?: string;
    };
    bank?: {
        cardNumber?: string;
    };
}

export type UserEditableField = "name" | "phone" | "email" | "birthDate" | "location" | "cardNumber";

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    address?: {
        city?: string;
        country?: string;
    };
    bank?: {
        cardNumber?: string;
    };
}

export interface UpdateUserResponse extends UpdateUserPayload {
    id: number;
}

export interface DeleteUserResponse {
    id: number;
    isDeleted: boolean;
    deletedOn?: string;
}

export interface AddUserFormValues {
    name: string;
    phone: string;
    email: string;
    birthDate: string;
    location: string;
    cardNumber: string;
}

export interface AddUserFormProps {
    disabled?: boolean;
    isSubmitting?: boolean;
    onSubmit: (values: AddUserFormValues) => Promise<void>;
    onValidationError?: (message: string) => void;
}