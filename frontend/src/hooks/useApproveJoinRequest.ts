import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function useApproveJoinRequest() {
  const [loadingApprove, setLoadingApprove] = useState(false);

  const approveJoinRequest = async (groupId: number, userId: number) => {
    setLoadingApprove(true);
    try {
      const { data: isMember } = await axios.get(`/api/groups/${groupId}/is-member/${userId}`);
      if (isMember) {
        toast.error("User is already a member of the group.");
        await axios.post("/api/groups/refuse-join-request", { groupId, userId });
        return false;
      }
      await axios.post("/api/groups/approve-join-request", { groupId, userId });
      toast.success("User has been added to the group!");
      return true;
    } catch (error) {
      console.error("Error approving join request:", error);
      toast.error("Failed to approve join request. Please try again.");
      return false;
    } finally {
      setLoadingApprove(false);
    }
  };

  return { approveJoinRequest, loadingApprove };
}