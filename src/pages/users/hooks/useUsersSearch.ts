import { useMemo, useState } from "react";
import type { UserPreview } from "../../../types/users";

export function useUsersSearch(users: UserPreview[]) {
    const [searchValue, setSearchValue] = useState("");

    const filteredUsers = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        if (!normalizedSearch) {
            return users;
        }

        return users.filter((user) => {
            const valuesForSearch = [
                `${user.firstName} ${user.lastName}`,
                user.firstName,
                user.lastName,
                user.email,
                user.phone,
                user.bank.cardNumber,
            ];

            return valuesForSearch.some((value) =>
                value.toLowerCase().includes(normalizedSearch),
            );
        });
    }, [searchValue, users]);

    return {
        searchValue,
        setSearchValue,
        filteredUsers,
    };
}
