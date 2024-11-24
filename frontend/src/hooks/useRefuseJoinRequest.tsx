
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function useRefuseJoinRequest() {
  const [loadingRefuse, setLoadingRefuse] = useState(false);

  const refuseJoinRequest = async (groupId: number, userId: number) => {
    setLoadingRefuse(true);
    try {
      await axios.post("/api/groups/refuse-join-request", { groupId, userId });
      toast.success("Request refused successfully!");
      return true;
    } catch (error) {
      console.error("Error refusing join request:", error);
      toast.error("Failed to refuse request. Please try again.");
      return false;
    } finally {
      setLoadingRefuse(false);
    }
  };

  return { refuseJoinRequest, loadingRefuse };
}