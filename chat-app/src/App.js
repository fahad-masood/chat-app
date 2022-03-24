import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Join from "./component/Join/Join";
import Chat from "./component/Chat/Chat";

// ENDPOINT is from where do we have to receive the socket
// const ENDPOINT = "http://localhost:4500";
// const socket = socketIO(ENDPOINT, { transports: ["websocket"] });

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Join />} />
          <Route exact path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
