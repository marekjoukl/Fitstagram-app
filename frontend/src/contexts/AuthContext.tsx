import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

type AuthUserType = {
  id: number;
  username: string;
  nickname: string;
  role: string;
  image: string;
  description: string;
  photos: [];
  groups: [];
};

const AuthContext = createContext<{
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
  unregisteredUser: boolean;
  setUnregisteredUser: Dispatch<SetStateAction<boolean>>;
}>({
  authUser: null,
  setAuthUser: () => {},
  isLoading: true,
  unregisteredUser: false,
  setUnregisteredUser: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unregisteredUser, setUnregisteredUser] = useState(false);

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            // Handle unauthorized response
            setAuthUser(null);
            setUnregisteredUser(true);
            toast.error("Please log in to continue.");
          } else {
            throw new Error(data.error);
          }
        } else {
          setAuthUser(data);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        isLoading,
        unregisteredUser,
        setUnregisteredUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
