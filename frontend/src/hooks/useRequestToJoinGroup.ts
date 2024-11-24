import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function useRequestToJoinGroup() {
  const [loadingRequest, setLoadingRequest] = useState(false);

  const requestToJoinGroup = async (groupId: number, userId: number) => {
    setLoadingRequest(true);
    try {
      // Check if the user's request is already pending
      const checkRes = await axios.get(`/api/groups/${groupId}/join-requests`);
      const joinRequests = checkRes.data;
      const requestExists = joinRequests.some((request: { userId: number }) => request.userId === userId);

      if (requestExists) {
        toast.error("Your request to join this group is already pending.");
        setLoadingRequest(false);
        return;
      }

      // Send the request to join the group
      await axios.post("/api/users/request-to-join", { groupId, userId });
      toast.success("Request sent successfully!");
    } catch (error) {
      console.error("Error requesting to join group:", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setLoadingRequest(false);
    }
  };

  return { requestToJoinGroup, loadingRequest };
}