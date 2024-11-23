import { useState } from "react";
import axios from "axios";

export default function useApproveJoinRequest() {
  const [loadingApprove, setLoadingApprove] = useState(false);

  const approveJoinRequest = async (groupId: number, userId: number) => {
    setLoadingApprove(true);
    try {
      await axios.post("/api/groups/approve-join-request", { groupId, userId });
      return true;
    } catch (error) {
      console.error("Error approving join request:", error);
      return false;
    } finally {
      setLoadingApprove(false);
    }
  };

  return { approveJoinRequest, loadingApprove };
}