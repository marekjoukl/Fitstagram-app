import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


export default function useLeaveGroup() {
  const [loadingLeaveGroup, setLoadingLeaveGroup] = useState(false);

  const leaveGroup = async (groupId: number, userId: number) => {
    setLoadingLeaveGroup(true);
    try {
      await axios.post(`/api/groups/leave-group`, { groupId, userId });
      toast.success("Left group successfully!");
      return true;
    } catch (error) {
      console.error("Error leaving group:", error); // Log the error
      toast.error("Failed to leave group. Please try again.");
      return false;
    } finally {
      setLoadingLeaveGroup(false);
    }
  };

  return { leaveGroup, loadingLeaveGroup };
}