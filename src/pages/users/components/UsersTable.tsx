import type { UserPreview } from "../../../types/users";

interface UsersTableProps {
    users: UserPreview[];
    hasSearch: boolean;
}

export function UsersTable({ users, hasSearch }: UsersTableProps) {
    return (
        <div className="users-table-wrap">
            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Телефон</th>
                        <th className="email-col">Email</th>
                        <th className="birthdate-col">Дата рождения</th>
                        <th className="location-col">Локация</th>
                        <th>Карта</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td className="users-empty" colSpan={7}>
                                {hasSearch
                                    ? "Ничего не найдено по вашему запросу"
                                    : "Нет данных для отображения"}
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{`${user.firstName} ${user.lastName}`}</td>
                                <td>{user.phone}</td>
                                <td className="email-col">{user.email}</td>
                                <td className="birthdate-col">{user.birthDate}</td>
                                <td className="location-col">{`${user.address.country} - ${user.address.city}`}</td>
                                <td>{user.bank.cardNumber}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
