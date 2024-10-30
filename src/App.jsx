import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Console from "./pages/console";
function App () {

  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/console" element={<Console />} />
  </Routes>
  </BrowserRouter>
  )
}

export default App;