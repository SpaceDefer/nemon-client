import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Log from "./components/log";
import Sidebar from "./components/sidebar";
import Applications from "./pages/applications";
import Machines from "./pages/machines";
import { useSocket } from "./hooks/useSocket";
import { addToLog } from "./logger";

type Type = Discovery | Alert | Acknowledge | Info | Delete;

type Alert = "ALT";
type Acknowledge = "ACK";
type Info = "INF";
type Delete = "DEL";
type Discovery = "DIS";

type Status = "offline" | "online" | "reconnecting";
export interface DeleteRequest {
    Type: Type;
    ApplicationName: string;
    WorkerIp: string;
    Location: string;
}

export interface MachineApplicationsMap {
    [key: string]: Application[];
}

export interface IpToMachineMap {
    [key: string]: Machine;
}

export interface AlertConfig {
    severity: string;
    message: string;
}

export interface Application {
    applicationName: string;
    location: string;
}

export interface Machine {
    ip: string;
    username: string;
    hostname: string;
    os: string;
    status: Status;
}
const App = () => {
    const client = new WebSocket("ws://127.0.0.1:4000");
    const [apps, setApps] = useState<Map<string, Application[]>>(
        new Map<string, Application[]>()
    );
    const [open, setOpen] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(true);
    const [appList, setAppList] = useState<Application[]>([]);
    const [machines, setMachines] = useState<Map<string, Machine>>(
        new Map<string, Machine>()
    );
    const [machinesWithApplication, setMachinesWithApplication] = useState<{
        [key: string]: Machine[];
    }>();
    const [flip, toggleFlip] = useState<boolean>(false);
    const [size, setSize] = useState<number>(0);
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        message: "",
        severity: "error",
    });
    useEffect(() => {
        console.log(machinesWithApplication);
    }, [machinesWithApplication]);
    const [ips, setIps] = useState<Set<string>>(new Set<string>());
    const onMessage = useCallback((message) => {
        const data = JSON.parse(message?.data);
        console.log(data);

        switch (data.type) {
            case "INF":
                setRefreshing(false);
                addToLog(data.type, JSON.stringify(data));
                const temp = apps;
                var map: { [key: string]: Machine[] } = {};
                setApps(
                    new Map<string, Application[]>(
                        apps.set(data.workerIp, data.applicationList)
                    )
                );

                var newMachine: Machine = {
                    ip: data.workerIp,
                    username: data.username,
                    hostname: data.hostname,
                    os: data.os,
                    status: "online",
                };
                data.applicationList.forEach((app: any, idx: any) => {
                    if (map[app.applicationName] === undefined)
                        map[app.applicationName] = [];
                    map[app.applicationName]?.push(newMachine);
                });

                setMachinesWithApplication(map);
                if (!ips.has(data.workerIp)) {
                    setIps(new Set<string>(ips.add(data.workerIp)));
                }
                setMachines(
                    new Map<string, Machine>(
                        machines.set(data.workerIp, newMachine)
                    )
                );
                toggleFlip(!flip);
                break;
            case "ALT":
                setRefreshing(false);
                addToLog(data.type, JSON.stringify(data));
                console.log(data);
                setAlertConfig({ message: data.message, severity: "error" });
                switch (data.status) {
                    case "online":
                        setAlertConfig({
                            message: `${data.workerIp} is online!`,
                            severity: "success",
                        });
                        break;
                    case "offline":
                        setAlertConfig({
                            message: `${data.workerIp} is offline!`,
                            severity: "error",
                        });
                        break;
                    case "reconnecting":
                        setAlertConfig({
                            message: `trying to reconnect to ${data.workerIp}!`,
                            severity: "warning",
                        });
                        break;
                }
                setOpen(true);
                var offlineMachine = machines.get(data.workerIp);
                console.log(offlineMachine);

                // @ts-ignore
                offlineMachine.status = data.status;
                setMachines(
                    new Map<string, Machine>(
                        // @ts-ignore
                        machines.set(data.workerIp, offlineMachine)
                    )
                );
                setTimeout(() => setOpen(false), 5000);
                break;
            case "ACK":
                setRefreshing(false);
                addToLog(data.type, JSON.stringify(data));
                console.log(data.message);
                setAlertConfig({ message: data.message, severity: "success" });
                setOpen(true);
                setTimeout(() => setOpen(false), 5000);
                break;

            case "DIS":
                setRefreshing(true);
                console.log(data.message);
                setAlertConfig({ message: data.message, severity: "info" });
                setOpen(true);
                setTimeout(() => setOpen(false), 5000);
                break;
        }
    }, []);

    useEffect(() => {
        socket.addEventListener("message", onMessage);

        return () => {
            socket.removeEventListener("message", onMessage);
        };
    }, []);

    const socket = useSocket();
    return (
        <div className="flex w-screen overflow-hidden">
            <Sidebar />
            <Routes>
                <Route
                    path="/machines"
                    element={
                        <Machines
                            alertConfig={alertConfig}
                            machines={machines}
                            refreshing={refreshing}
                            setAppList={setAppList}
                            setSize={setSize}
                            flip={flip}
                            open={open}
                            ips={ips}
                            apps={apps}
                            appList={appList}
                        />
                    }
                />
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
