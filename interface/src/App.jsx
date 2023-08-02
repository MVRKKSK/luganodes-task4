import Signup from "./components/authentication/Signup";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/authentication/Login";
import { LoggedInRoutes } from "./routes/LoggedInRoutes";
import { NotLoggedInRoutes } from "./routes/NotLoggedIn";
import Dashboard from "./components/sample";

function App() {
  return (
    <>
      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route path="/" element={<Dashboard />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
