import { Canvas } from "./components/game/canvas";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import styles from "./App.module.css";
import { Home } from "./pages/Home";

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
