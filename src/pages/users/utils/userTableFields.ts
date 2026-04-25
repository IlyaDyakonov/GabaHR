import type { UserEditableField, UserPreview } from "../../../types/users";


interface UserTableField {
    field: UserEditableField;
    header: string;
    className?: string;
    getValue: (user: UserPreview) => string;
}


/**
 * Единое описание редактируемых колонок таблицы.
 * Компонент таблицы использует этот список и для заголовков, и для получения значения ячейки.
 */
export const USER_TABLE_FIELDS: UserTableField[] = [
    {
        field: "name",
        header: "Имя",
        getValue: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
        field: "phone",
        header: "Телефон",
        getValue: (user) => user.phone,
    },
    {
        field: "email",
        header: "Email",
        className: "email-col",
        getValue: (user) => user.email,
    },
    {
        field: "birthDate",
        header: "Дата рождения",
        className: "birthdate-col",
        getValue: (user) => user.birthDate,
    },
    {
        field: "location",
        header: "Локация",
        className: "location-col",
        getValue: (user) => `${user.address.country} - ${user.address.city}`,
    },
    {
        field: "cardNumber",
        header: "Карта",
        getValue: (user) => user.bank.cardNumber,
    },
];
