import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Background } from "./components/Background";
import { Landing } from "./components/Landing";
import { User } from "./components/User";
import { Admin } from "./components/Admin";

function App() {
  return (
    <BrowserRouter>
      <Background />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
