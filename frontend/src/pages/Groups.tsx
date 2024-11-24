import { useNavigate } from "react-router-dom";
import useFetchGroups from "../hooks/useFetchGroups";

interface Group {
  id: number;
  name: string;
  description: string;
}

export default function Groups() {
  const navigate = useNavigate();
  const { myGroups, allGroups, loading, error } = useFetchGroups();

  const handleGroupClick = (groupId: number) => {
    navigate(`/group/${groupId}`, { state: { from: "groups" } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <button
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-300"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Browse Groups</h1>
        {loading ? (
          <p>Loading groups...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Groups</h2>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {myGroups.map((group: Group) => (
                <div
                  key={group.id}
                  className="cursor-pointer rounded-lg bg-white p-6 shadow-md hover:bg-gray-100"
                  onClick={() => handleGroupClick(group.id)}
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {group.name}
                  </h2>
                  <p className="mt-2 text-gray-600">{group.description}</p>
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Groups</h2>
            <div className="grid grid-cols-3 gap-6">
              {allGroups.map((group: Group) => (
                <div
                  key={group.id}
                  className="cursor-pointer rounded-lg bg-white p-6 shadow-md hover:bg-gray-100"
                  onClick={() => handleGroupClick(group.id)}
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {group.name}
                  </h2>
                  <p className="mt-2 text-gray-600">{group.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}