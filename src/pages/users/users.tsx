import { useEffect, useState } from "react";
import { addUser, getAllUsers } from "../../api/users/apiUsers";
import type { UserPreview, UsersResponse } from "../../types/users";
import type { AddUserFormValues } from "../../types/users";
import { AddUserForm } from "./components/AddUserForm";
import { UsersTable } from "./components/UsersTable";
import { useUsersSearch } from "./hooks/useUsersSearch";
import "./users.css";


export default function UsersSection() {
    const [users, setUsers] = useState<UserPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);

    useEffect(() => {
        let isMounted = true;

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
                <UsersTable users={filteredUsers} hasSearch={Boolean(searchValue.trim())} />
            )}
        </section>
    );
}