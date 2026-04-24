import { useState } from "react";
import type { AddUserFormProps, AddUserFormValues } from "../../../types/users";


export function AddUserForm({
    disabled = false,
    isSubmitting = false,
    onSubmit,
    onValidationError,
}: AddUserFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [location, setLocation] = useState("");
    const [cardNumber, setCardNumber] = useState("");

    async function handleSubmit() {
        const values: AddUserFormValues = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            birthDate: birthDate.trim(),
            location: location.trim(),
            cardNumber: cardNumber.trim(),
        };

        if (Object.values(values).some((value) => !value)) {
            onValidationError?.("Заполните все поля для добавления пользователя.");
            return;
        }

        await onSubmit(values);
        setName("");
        setPhone("");
        setEmail("");
        setBirthDate("");
        setLocation("");
        setCardNumber("");
    }

    return (
        <div className="add-user-row">
            <input
                className="search-input add-user-name"
                type="text"
                placeholder="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <input
                className="search-input add-user-phone"
                type="text"
                placeholder="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
            />
            <input
                className="search-input add-user-email"
                type="email"
                placeholder="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <input
                className="search-input add-user-birthdate"
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
            />
            <input
                className="search-input add-user-location"
                type="text"
                placeholder="location (country, city)"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
            />
            <input
                className="search-input add-user-card"
                type="text"
                placeholder="card number"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
            />
            <button
                className="add-user-btn"
                type="button"
                onClick={handleSubmit}
                disabled={disabled || isSubmitting}
            >
                {isSubmitting ? "Adding..." : "Add user"}
            </button>
        </div>
    );
}
