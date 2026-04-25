import type { UpdateUserPayload, UserEditableField, UserPreview } from "../../../types/users";


/**
 * Разбирает значение из колонки "Имя" на имя и фамилию.
 * Если пользователь ввел только одно слово, текущая фамилия сохраняется.
 */
function getNameParts(value: string, user: UserPreview) {
    const [firstNamePart, ...lastNameParts] = value.trim().split(/\s+/);

    return {
        firstName: firstNamePart || user.firstName,
        lastName: lastNameParts.join(" ") || user.lastName,
    };
}


/**
 * Разбирает значение из колонки "Локация" на страну и город.
 * Поддерживает ввод через дефис или запятую, например: "USA - Phoenix".
 * Если пользователь ввел только одно слово, текущий город сохранится.
 */
function getLocationParts(value: string, user: UserPreview) {
    const [countryPart, cityPart] = value
        .split(/[-,]/)
        .map((part) => part.trim())
        .filter(Boolean);

    return {
        country: countryPart || user.address.country,
        city: cityPart || user.address.city,
    };
}


/**
 * Формирует тело PATCH-запроса под конкретное поле таблицы.
 * Нужен, потому что часть полей лежит вложенно в address и bank.
 */
export function getUpdatePayload(
    user: UserPreview,
    field: UserEditableField,
    value: string,
): UpdateUserPayload {
    switch (field) {
        case "name":
            return getNameParts(value, user);
        case "phone":
            return { phone: value };
        case "email":
            return { email: value };
        case "birthDate":
            return { birthDate: value };
        case "location":
            return { address: getLocationParts(value, user) };
        case "cardNumber":
            return { bank: { cardNumber: value } };
    }
}


/**
 * Применяет изменение выбранного поля к локальному пользователю.
 * Используется после успешного PATCH, чтобы сразу обновить таблицу без повторной загрузки.
 */
export function applyUserUpdate(
    user: UserPreview,
    field: UserEditableField,
    value: string,
): UserPreview {
    switch (field) {
        case "name":
            return { ...user, ...getNameParts(value, user) };
        case "phone":
            return { ...user, phone: value };
        case "email":
            return { ...user, email: value };
        case "birthDate":
            return { ...user, birthDate: value };
        case "location":
            return { ...user, address: { ...user.address, ...getLocationParts(value, user) } };
        case "cardNumber":
            return { ...user, bank: { ...user.bank, cardNumber: value } };
    }
}
