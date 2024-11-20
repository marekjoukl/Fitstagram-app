import { useState } from "react";
import useRegister from "../hooks/useRegister";

export default function Register() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const { register, loading } = useRegister();

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    register(inputs);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 lg:w-full lg:p-0">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800">
          Create Your{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            FITstagram
          </span>{" "}
          Account
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500">
          Join us to share and explore amazing photos!
        </p>

        <form className="space-y-6" onSubmit={handleSubmitForm}>
          {/* Username */}
          <div className="w-full">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="username"
                name="username"
                className="box-border block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your unique username"
                value={inputs.username}
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                type="password"
                id="password"
                name="password"
                className="box-border block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="••••••••"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="w-full">
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                className="box-border block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Re-enter your password"
                value={inputs.passwordConfirm}
                onChange={(e) =>
                  setInputs({ ...inputs, passwordConfirm: e.target.value })
                }
              />
            </div>
          </div>

          {/* Nickname */}
          <div className="w-full">
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              Nickname
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="nickname"
                name="nickname"
                className="box-border block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="What should we call you?"
                value={inputs.nickname}
                onChange={(e) =>
                  setInputs({ ...inputs, nickname: e.target.value })
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 py-2 font-semibold text-white shadow-md transition-all hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-500 hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
