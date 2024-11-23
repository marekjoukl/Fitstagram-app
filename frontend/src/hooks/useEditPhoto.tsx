import { useState } from "react";
import toast from "react-hot-toast";

type PhotoInputs = {
  name: string;
  description: string;
  url: string;
  visibleTo: number[];
  tags: string[];
};

const useEditPhoto = () => {
  const [loading, setLoading] = useState(false);

  const editPhoto = async (photoId: number, inputs: PhotoInputs) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/photos/${photoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit the photo");
      }

      const data = await response.json();
      toast.success("Photo updated successfully");
      return data;
    } catch (error: any) {
      console.error("Error editing photo:", error.message);
      toast.error(error.message || "Failed to edit the photo");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editPhoto, loading };
};

export default useEditPhoto;
