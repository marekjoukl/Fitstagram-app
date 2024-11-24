import { useNavigate } from "react-router-dom";
import useGetTags from "../hooks/useGetTags";
import useDeleteTag from "../hooks/useDeleteTag";
import { useEffect } from "react";

type Tag = {
  id: number;
  content: string;
};

export default function Tags() {
  const navigate = useNavigate();
  const { tags, loading, fetchTags } = useGetTags();
  const {deleteTag, loadingDelete} = useDeleteTag();

  
  const handleDeleteTag = async (id: number) => {
    const success = await deleteTag(id);
    if (success) {
      fetchTags();
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
        <button
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-300"
          onClick={() => {
          navigate("/");
          }}
        >
          ← Back to Main Page
        </button>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl rounded mb-8 flex flex-col bg-white p-4 shadow-md flex-row p-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Tags
        </h1>
      </div>

      <div className="container mx-auto max-w-6xl rounded mb-8 flex flex-col bg-white p-4 shadow-md flex-row p-8">
        {(loading || loadingDelete) ? (
          <p>Loading tags...</p>
        ) : (
        <div className="grid grid-cols-4 gap-6">
          {tags.map((tag: Tag) => (
            <div
              key={tag.id}
              className="m-1 p-2 rounded-lg bg-gray-200 text-black flex flex-wrap items-center justify-between"
            >
              {tag.content}
              <button
                className="ml-2 text-red-500"
                onClick={() => handleDeleteTag(tag.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}