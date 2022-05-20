import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./hooks/SocketProvider";
import { Provider } from "react-redux";
import store from "./app/store";

ReactDOM.render(
    <SocketProvider>
        <React.StrictMode>
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </React.StrictMode>
    </SocketProvider>,
    document.getElementById("root")
);
