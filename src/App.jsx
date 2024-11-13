import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Console from "./pages/console";
import GhHandler from "./pages/ghHandler";
import Stash from "./pages/stash";
function App () {

  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/console" element={<Console />} />
    <Route path="/github/callback" element={<GhHandler />}/>
    <Route path="/stash/:id" element={<Stash />}/>
  </Routes>
  </BrowserRouter>
  )
}

export default App;