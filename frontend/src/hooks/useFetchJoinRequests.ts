
import { useState } from "react";
import axios from "axios";

export default function useFetchJoinRequests() {
  const [joinRequests, setJoinRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const fetchJoinRequests = async (groupId: number) => {
    setLoadingRequests(true);
    try {
      const response = await axios.get(`/api/groups/${groupId}/join-requests`);
      setJoinRequests(response.data);
    } catch (error) {
      console.error("Error fetching join requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  return { fetchJoinRequests, joinRequests, loadingRequests };
}