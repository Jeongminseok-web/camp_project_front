import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Area from "./components/Area";
import Theme from "./components/Theme";
import Hot from "./components/Hot";
import Visited from "./components/Visited";
import Review from "./components/Review";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/area" element={<Area />} />
          <Route path="/theme" element={<Theme />} />
          <Route path="/hot" element={<Hot />} />
          <Route path="/visited" element={<Visited />} />
          <Route path="/review" element={<Review />} />
        </Routes>

        <ToastContainer
          position="top-center"
          autoClose={1000}
          theme="light"
          closeOnClick
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
