import { useState, useEffect } from "react";
import axios from "axios";

type User = {
  id: number;
  username: string;
  nickname: string;
  image: string;
};

const useSearchUsers = (query: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/users/search`, {
          params: { nickname: query },
        });

        setUsers(res.data);
      } catch (error: any) {
        setError(error.message || "Error searching users");
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  return { users, loading, error };
};

export default useSearchUsers;