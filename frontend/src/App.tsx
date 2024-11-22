import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound"; // Import the NotFound component
import { useAuthContext } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import EditProfile from "./pages/EditProfile";
import AddPost from "./pages/AddPhoto";
import EditPhoto from "./pages/EditPhoto";
import CreateGroup from "./pages/CreateGroup";
import UserProfile from "./pages/UserProfile";
import Group from "./pages/Group";

const App = () => {
  const { authUser, isLoading, unregisteredUser } = useAuthContext();

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            authUser || unregisteredUser ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/myProfile"
          element={authUser ? <UserProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:userId"
          element={authUser ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/myProfile/edit"
          element={authUser ? <EditProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/myProfile/edit-photo/:photoId"
          element={authUser ? <EditPhoto /> : <Navigate to="/" />}
        />
        <Route
          path="/myProfile/add-post"
          element={authUser ? <AddPost /> : <Navigate to="/" />}
        />
        <Route
          path="group/create"
          element={authUser ? <CreateGroup /> : <Navigate to="/" />}
        />
        <Route
          path="/group/:groupId"
          element={authUser ? <Group /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
