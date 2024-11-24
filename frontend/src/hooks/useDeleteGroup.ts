import { useState } from "react";
import axios from "axios";

export default function useDeleteGroup() {
  const [loadingDeleteGroup, setLoadingDeleteGroup] = useState(false);

  const deleteGroup = async (groupId: number) => {
    setLoadingDeleteGroup(true);
    try {
      await axios.delete(`/api/groups/${groupId}`);
      return true;
    } catch (error) {
      console.error("Error deleting group:", error); // Log the error
      return false;
    } finally {
      setLoadingDeleteGroup(false);
    }
  };

  return { deleteGroup, loadingDeleteGroup };
}