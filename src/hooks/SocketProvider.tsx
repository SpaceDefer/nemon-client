import { useEffect, useState, createContext, ReactChild } from "react";

const ws = new WebSocket("ws://localhost:4000/ws");

export const SocketContext = createContext(ws);

interface ISocketProvider {
    children: ReactChild;
}

export const SocketProvider = (props: ISocketProvider) => (
    <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
);
