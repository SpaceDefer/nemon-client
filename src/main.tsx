import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./hooks/SocketProvider";
import { Provider } from "react-redux";
// import store from "./app/store";
import {
    RecoilRoot,
    // atom,
    // selector,
    // useRecoilState,
    // useRecoilValue,
} from "recoil";

ReactDOM.render(
    <SocketProvider>
        <React.StrictMode>
            <BrowserRouter>
                <RecoilRoot>
                    <App />
                </RecoilRoot>
            </BrowserRouter>
        </React.StrictMode>
    </SocketProvider>,
    document.getElementById("root")
);
