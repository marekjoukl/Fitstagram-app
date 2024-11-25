import { useState } from "react";
import toast from "react-hot-toast";

const useBlockUser = () => {
  const [loadingBlock, setLoadingBlock] = useState(false);

  const blockUser = async (userId: number) => {
    try {
      setLoadingBlock(true);
      const response = await fetch(`/api/users/${userId}/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to block/unblock user");
      }

      toast.success("User blocked/unblocked successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error blocking/unblocking user:", error.message);
      return false;
    } finally {
      setLoadingBlock(false);
    }
  };

  return { blockUser, loadingBlock };
};

export default useBlockUser;