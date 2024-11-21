import { useNavigate } from "react-router-dom";

type LoginButtonProps = {
  onClick?: () => void;
};

export default function LoginButton({ onClick }: LoginButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate("/login");
  };

  return (
    <button
      className="w-full rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-600"
      onClick={handleClick}
    >
      Login / Register
    </button>
  );
}