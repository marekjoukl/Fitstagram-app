
import { useState } from "react";
import axios from "axios";

export default function useRequestToJoinGroup() {
  const [loadingRequest, setLoadingRequest] = useState(false);

  const requestToJoinGroup = async (groupId: number, userId: number) => {
    setLoadingRequest(true);
    try {
      await axios.post("/api/users/request-to-join", { groupId, userId });
    } catch (error) {
      console.error("Error requesting to join group:", error);
    } finally {
      setLoadingRequest(false);
    }
  };

  return { requestToJoinGroup, loadingRequest };
}