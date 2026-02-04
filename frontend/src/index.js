import { createTheme } from "@ant-design/cssinjs";
import { Button, ConfigProvider } from "antd";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const lightTheme = createTheme({
  token: {
    colorPrimary: "#1890ff",
    colorBgLayout: "#fff",
    colorTextBase: "#000",
  },
});

const darkTheme = createTheme({
  token: {
    colorPrimary: "#177ddc",
    colorBgLayout: "#141414",
    colorTextBase: "#fff",
  },
});

const Root = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ConfigProvider theme={darkMode ? darkTheme : lightTheme}>
      <Button
        onClick={toggleDarkMode}
        style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </Button>
      <App darkMode={darkMode} />
    </ConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
