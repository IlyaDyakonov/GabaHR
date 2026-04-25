import { useState } from "react";
import type { MouseEvent } from "react";
import type { UserEditableField, UserPreview } from "../../../types/users";
import { USER_TABLE_FIELDS } from "../utils/userTableFields";
import { UserActionMenu } from "./UserActionMenu";


interface UsersTableProps {
    users: UserPreview[];
    hasSearch: boolean;
    onUpdateField: (user: UserPreview, field: UserEditableField, value: string) => Promise<void>;
    onDeleteUser: (userId: number) => Promise<void>;
}

type ActionMenuState = {
    user: UserPreview;
    field: UserEditableField;
    fieldLabel: string;
    fieldValue: string;
    x: number;
    y: number;
};


    /**
     * Таблица пользователей.
     * Отображает список пользователей и меню действий с пользователем.
     */
export function UsersTable({
    users,
    hasSearch,
    onUpdateField,
    onDeleteUser,
}: UsersTableProps) {
    const [actionMenu, setActionMenu] = useState<ActionMenuState | null>(null);

    /**
     * Открывает меню действий рядом с курсором и запоминает,
     * какую ячейку пользователь выбрал для редактирования.
     */
    function openActionMenu(
        user: UserPreview,
        field: UserEditableField,
        fieldLabel: string,
        fieldValue: string,
        event: MouseEvent<HTMLTableCellElement>,
    ) {
        setActionMenu({
            user,
            field,
            fieldLabel,
            fieldValue,
            x: Math.max(12, Math.min(event.clientX + 8, window.innerWidth - 280)),
            y: Math.max(12, Math.min(event.clientY + 8, window.innerHeight - 180)),
        });
    }

    return (
        <>
            <div className="users-table-wrap">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            {USER_TABLE_FIELDS.map((tableField) => (
                                <th key={tableField.field} className={tableField.className}>
                                    {tableField.header}
                                </th>
                            ))}
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
                                    {USER_TABLE_FIELDS.map((tableField) => {
                                        const fieldValue = tableField.getValue(user);

                                        return (
                                            <td
                                                key={tableField.field}
                                                className={tableField.className}
                                                onClick={(event) =>
                                                    openActionMenu(
                                                        user,
                                                        tableField.field,
                                                        tableField.header,
                                                        fieldValue,
                                                        event,
                                                    )
                                                }
                                            >
                                                {fieldValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {actionMenu && (
                <UserActionMenu
                    key={`${actionMenu.user.id}-${actionMenu.field}-${actionMenu.fieldValue}`}
                    user={actionMenu.user}
                    field={actionMenu.field}
                    fieldLabel={actionMenu.fieldLabel}
                    fieldValue={actionMenu.fieldValue}
                    x={actionMenu.x}
                    y={actionMenu.y}
                    onUpdateField={onUpdateField}
                    onDeleteUser={onDeleteUser}
                    onClose={() => setActionMenu(null)}
                />
            )}
        </>
    );
}
