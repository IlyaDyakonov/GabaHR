import { useEffect, useState } from "react";
import { addUser, deleteUser, getAllUsers, updateUser } from "../../api/users/apiUsers";
import type { UserEditableField, UserPreview, UsersResponse } from "../../types/users";
import type { AddUserFormValues } from "../../types/users";
import { AddUserForm } from "./components/AddUserForm";
import { UsersTable } from "./components/UsersTable";
import { useUsersSearch } from "./hooks/useUsersSearch";
import { applyUserUpdate, getUpdatePayload } from "./utils/userFieldUpdate";
import "./users.css";


/**
 * Главный компонент страницы пользователей.
 * Загружает список пользователей, добавляет новых, обновляет поля и удаляет пользователей.
 */
export default function UsersSection() {
    const [users, setUsers] = useState<UserPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);

    useEffect(() => {
        let isMounted = true;

        /**
         * Загружает пользователей при открытии страницы и защищает состояние от обновления после unmount.
         */
        async function loadUsers() {
            try {
                setIsLoading(true);
                setError(null);
                const data: UsersResponse = await getAllUsers();

                if (isMounted) {
                    setUsers(data.users);
                }
            } catch (loadError) {
                if (isMounted) {
                    setError("Не удалось загрузить пользователей. Попробуйте позже.");
                }
                console.error(loadError);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    /**
     * Создает пользователя через API и добавляет его в начало локального списка.
     */
    async function handleAddUser(values: AddUserFormValues) {
        const [countryPart, cityPart] = values.location.split(",").map((value) => value.trim());
        const country = countryPart || values.location;
        const city = cityPart || countryPart || values.location;

        try {
            setIsAddingUser(true);
            setError(null);

            const addedUser = await addUser({
                firstName: values.name,
                phone: values.phone,
                email: values.email,
                birthDate: values.birthDate,
                address: { city, country },
                bank: { cardNumber: values.cardNumber },
            });

            const newUser: UserPreview = {
                id: addedUser.id,
                firstName: addedUser.firstName ?? values.name,
                lastName: addedUser.lastName ?? "",
                email: addedUser.email ?? values.email,
                phone: addedUser.phone ?? values.phone,
                birthDate: addedUser.birthDate ?? values.birthDate,
                address: {
                    city: addedUser.address?.city ?? city,
                    country: addedUser.address?.country ?? country,
                },
                bank: {
                    cardNumber: addedUser.bank?.cardNumber ?? values.cardNumber,
                },
            };

            setUsers((prevUsers) => [newUser, ...prevUsers]);
        } catch (addError) {
            setError("Не удалось добавить пользователя. Попробуйте позже.");
            console.error(addError);
        } finally {
            setIsAddingUser(false);
        }
    }

    /**
     * Обновляет выбранное поле пользователя через PATCH и синхронизирует локальную таблицу.
     */
    async function handleUpdateUserField(
        user: UserPreview,
        field: UserEditableField,
        value: string,
    ) {
        try {
            setError(null);
            await updateUser(user.id, getUpdatePayload(user, field, value));

            setUsers((prevUsers) =>
                prevUsers.map((prevUser) =>
                    prevUser.id === user.id ? applyUserUpdate(prevUser, field, value) : prevUser,
                ),
            );
        } catch (updateError) {
            setError("Не удалось обновить пользователя. Попробуйте позже.");
            console.error(updateError);
        }
    }

    /**
     * Удаляет пользователя через API и убирает его из локального списка.
     */
    async function handleDeleteUser(userId: number) {
        try {
            setError(null);
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } catch (deleteError) {
            setError("Не удалось удалить пользователя. Попробуйте позже.");
            console.error(deleteError);
        }
    }

    const { searchValue, setSearchValue, filteredUsers } = useUsersSearch(users);

    return (
        <section className="block" aria-labelledby="users-title">
            <div className="block-header">
                <h1 id="users-title">Users</h1>
                <div className="search-group">
                    <label className="search-text" htmlFor="users-search">
                        Search:
                    </label>
                    <input
                        id="users-search"
                        className="search-input"
                        type="text"
                        placeholder="enter name, email, phone or bank card"
                        disabled={isLoading}
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                </div>
            </div>
            <AddUserForm
                disabled={isLoading}
                isSubmitting={isAddingUser}
                onSubmit={handleAddUser}
                onValidationError={setError}
            />
            {isLoading && <p>Загрузка пользователей...</p>}
            {error && <p>{error}</p>}
            {!isLoading && !error && (
                <UsersTable
                    users={filteredUsers}
                    hasSearch={Boolean(searchValue.trim())}
                    onUpdateField={handleUpdateUserField}
                    onDeleteUser={handleDeleteUser}
                />
            )}
        </section>
    );
}