import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Canvas } from "./components/canvas";
import { Home } from "./pages/Home";

import styles from "./App.module.css";

function App() {
  const welcomeText = "Welcome :)";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/canvas"
          element={
            <div className={styles.appContainer}>
              <h1 className={styles.welcomeText}>{welcomeText}</h1>
              <div className={styles.mainContainer}>
                <Canvas />
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
