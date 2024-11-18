import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get("/api/test");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setMessage("Failed to connect to backend.");
      }
    };
    fetchMessage();
  }, []);

  return <div>{message}</div>;
};

export default App;
