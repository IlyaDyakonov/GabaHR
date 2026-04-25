import { useEffect, useRef, useState } from "react";
import type { UserEditableField, UserPreview } from "../../../types/users";


interface UserActionMenuProps {
    user: UserPreview;
    field: UserEditableField;
    fieldLabel: string;
    fieldValue: string;
    x: number;
    y: number;
    onUpdateField: (user: UserPreview, field: UserEditableField, value: string) => Promise<void>;
    onDeleteUser: (userId: number) => Promise<void>;
    onClose: () => void;
}

    /**
     * Меню действий с пользователем.
     * Редактирование и удаление пользователя.
     */
export function UserActionMenu({
    user,
    field,
    fieldLabel,
    fieldValue,
    x,
    y,
    onUpdateField,
    onDeleteUser,
    onClose,
}: UserActionMenuProps) {
    const [mode, setMode] = useState<"actions" | "edit">("actions");
    const [fieldDraft, setFieldDraft] = useState(fieldValue);
    const [menuError, setMenuError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    /**
     * Закрывает меню при клике вне попапа или нажатии Escape.
     */
    useEffect(() => {
        function handlePointerDown(event: PointerEvent) {
            if (!menuRef.current?.contains(event.target as Node)) {
                onClose();
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    /**
     * Переводит попап из режима выбора действия в режим редактирования выбранного поля.
     */
    function openEditMode() {
        setMenuError(null);
        setFieldDraft(fieldValue);
        setMode("edit");
    }

    /**
     * Валидирует новое значение и отправляет изменение выбранного поля наверх.
     */
    async function handleUpdateField() {
        const nextValue = fieldDraft.trim();

        if (!nextValue) {
            setMenuError("Значение не может быть пустым.");
            return;
        }

        try {
            setIsSubmitting(true);
            await onUpdateField(user, field, nextValue);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    }

    /**
     * Запускает удаление пользователя и закрывает меню после успешного ответа.
     */
    async function handleDeleteUser() {
        try {
            setIsSubmitting(true);
            await onDeleteUser(user.id);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div
            ref={menuRef}
            className="user-action-menu"
            style={{ left: x, top: y }}
            role="dialog"
            aria-label={`Действия с пользователем ${user.firstName} ${user.lastName}`}
        >
            {mode === "actions" ? (
                <>
                    <p className="user-action-title">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="user-action-field">Поле: {fieldLabel}</p>
                    <div className="user-action-buttons">
                        <button
                            className="user-action-btn"
                            type="button"
                            onClick={openEditMode}
                            disabled={isSubmitting}
                        >
                            Редактировать
                        </button>
                        <button
                            className="user-action-btn user-action-danger"
                            type="button"
                            onClick={handleDeleteUser}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Удаление..." : "Удалить"}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <label className="user-action-label" htmlFor="user-field-edit">
                        Новое значение: {fieldLabel}
                    </label>
                    <input
                        id="user-field-edit"
                        className="search-input user-action-input"
                        type={field === "birthDate" ? "date" : "text"}
                        value={fieldDraft}
                        onChange={(event) => {
                            setMenuError(null);
                            setFieldDraft(event.target.value);
                        }}
                        autoFocus
                    />
                    {menuError && <p className="user-action-error">{menuError}</p>}
                    <div className="user-action-buttons">
                        <button
                            className="user-action-btn"
                            type="button"
                            onClick={handleUpdateField}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Сохранение..." : "Сохранить"}
                        </button>
                        <button
                            className="user-action-btn user-action-danger"
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
