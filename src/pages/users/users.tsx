import usersData from "../../../users.json";
import type { UsersResponse } from "../../types/users";
import { UsersTable } from "./components/UsersTable";
import { useUsersSearch } from "./hooks/useUsersSearch";
import "./users.css";


export default function UsersSection() {
    const data = usersData as UsersResponse;
    const { searchValue, setSearchValue, filteredUsers } = useUsersSearch(data.users);

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
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                </div>
            </div>
            <UsersTable users={filteredUsers} hasSearch={Boolean(searchValue.trim())} />
        </section>
    );
}