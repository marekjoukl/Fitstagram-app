import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const useLogout = (onLogout: () => void) => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const { setUnregisteredUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      setAuthUser(null);
      setUnregisteredUser(true);
      onLogout();
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};
export default useLogout;
