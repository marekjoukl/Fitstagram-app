import { useState } from "react";
import toast from "react-hot-toast";

const useDeleteUser = () => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const deleteUser = async (userId: number) => {
    try {
      setLoadingDelete(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error deleting user:", error.message);
      return false;
    } finally {
      setLoadingDelete(false);
    }
  };

  return { deleteUser, loadingDelete };
};

export default useDeleteUser;