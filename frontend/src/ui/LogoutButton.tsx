import useLogout from "../hooks/useLogout";

export default function LogoutButton() {
  const { logout, loading } = useLogout();
  return (
    <button
      className="w-full rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600"
      onClick={logout}
      disabled={loading}
    >
      Logout
    </button>
  );
}
