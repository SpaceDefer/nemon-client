import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Log from "./components/log";
import Sidebar from "./components/sidebar";
import Applications from "./pages/applications";
import Machines from "./pages/machines";

const App = () => {
    const client = new WebSocket("ws://127.0.0.1:4000");

    return (
        <div className="flex w-screen overflow-hidden">
            <Sidebar />
            <Routes>
                <Route path="/machines" element={<Machines />} />
                <Route path="/applications" element={<Applications />} />
                <Route
                    path="/"
                    element={<Navigate to="/applications" replace />}
                />
            </Routes>
            <Log />
        </div>
    );
};

export default App;
