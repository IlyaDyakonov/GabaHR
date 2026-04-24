import UsersSection from "./users/users";

/**
 * Здесь будем подключать все секции приложения.
 */
export default function HomePage() {
  return (
    <main className="page">
      <UsersSection />
    </main>
  );
}
