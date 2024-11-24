import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useCreateGroup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createGroup = async (name: string, managerId: number, userIds: number[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/groups/create", {
        name,
        managerId,
        userIds,
      });

      setLoading(false);
      toast.success("Group created successfully!");
      return response.data;
    } catch (error: any) {
      toast.error("Failed to create a group. Please try again.");
      setError(error.message || "Error creating group");
      setLoading(false);
      return null;
    }
  };

  return { createGroup, loading, error };
};

export default useCreateGroup;