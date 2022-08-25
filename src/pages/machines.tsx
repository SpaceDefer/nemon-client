import SearchSolid from "../assets/search-solid.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import Paper from "@mui/material/Paper";
import Alert, { AlertColor } from "@mui/material/Alert";
import { useCallback, useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useSocket } from "../hooks/useSocket";
import {
    Box,
    Chip,
    CircularProgress,
    Grid,
    List,
    ListItem,
    Tooltip,
} from "@mui/material";
import { addToLog } from "../logger";
import { useRecoilState } from "recoil";
import { machineState } from "../atoms";

function convertToDateAndTime(ts: number) {
    var date = new Date(ts * 1000);
    const tstring =
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();
    return tstring;
}

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    border: "2px solid #000",
    p: 4,
    overflowY: "auto",
    maxHeight: "90vh",
    overflowX: "initial",
};

type Alert = "ALT";
type Acknowledge = "ACK";
type Info = "INF";
type Delete = "DEL";
type Discovery = "DIS";

type Type = Discovery | Alert | Acknowledge | Info | Delete;
type Status = "offline" | "online" | "reconnecting";

interface DeleteRequest {
    Type: Type;
    ApplicationName: string;
    WorkerIp: string;
    Location: string;
}

interface Application {
    applicationName: string;
    location: string;
}

interface Machine {
    ip: string;
    username: string;
    hostname: string;
    os: string;
    status: Status;
}

interface MachineApplicationsMap {
    [key: string]: Application[];
}

interface IpToMachineMap {
    [key: string]: Machine;
}

interface AlertConfig {
    severity: AlertColor;
    message: string;
}

const Machines = () => {
    const [apps, setApps] = useState<Map<string, Application[]>>(
        new Map<string, Application[]>()
    );
    const [ignoredListOpen, setIgnoredListOpen] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(true);
    const [appList, setAppList] = useState<Application[]>([]);
    const [machines, setMachines] = useState<Map<string, Machine>>(
        new Map<string, Machine>()
    );
    const [flip, toggleFlip] = useState<boolean>(false);
    const [size, setSize] = useState<number>(0);
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        message: "",
        severity: "error",
    });
    const [ips, setIps] = useState<Set<string>>(new Set<string>());
    const [appListOpen, setAppListOpen] = useState(false);
    const [ignored, setIgnored] = useState<Set<Application>>(
        new Set<Application>()
    );
    const [open, setOpen] = useState<boolean>(false);
    const [workerIp, setWorkerIp] = useState<string>("");
    const [_machines, _setMachines] = useRecoilState(machineState);

    const socket = useSocket();

    useEffect(() => {
        setSize(ips.size);
    }, [flip]);

    const onMessage = useCallback((message) => {
        const data = JSON.parse(message?.data);
        console.log(data);

        switch (data.type) {
            case "INF":
                setRefreshing(false);
                addToLog(data.type, JSON.stringify(data));
                const temp = apps;
                console.log(temp);
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
                offlineMachine.status = data.status;
                setMachines(
                    new Map<string, Machine>(
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
    });

    const handleRowClick = (id: string) => {
        console.log(apps);
        setAppList(apps?.get(id));
        setWorkerIp(id);
        setAppListOpen(true);
    };

    const openIgnoredModal = () => {
        console.log(ignored);
        setIgnoredListOpen(true);
    };

    return (
        <div className="p-12">
            <p className="font-bold text-2xl">Network Computers</p>
            <div className="flex w-full mt-2 items-center mb-2">
                <div className="flex bg-white items-center p-2 shadow-sm rounded-lg w-[500px] border-2 ">
                    <img src={SearchSolid} className="h-[20px] mr-4 ml-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transperant appearance-none outline-none"
                    />
                </div>
                <Button onClick={openIgnoredModal}>Ignored</Button>
                <div className="flex-grow" />
            </div>
            {alertConfig && (
                <Snackbar open={open} autoHideDuration={6000}>
                    <Alert severity={alertConfig.severity || "warning"}>
                        {alertConfig.message}
                    </Alert>
                </Snackbar>
            )}
            {!refreshing ? (
                <TableContainer component={Paper}>
                    <Table style={{ minWidth: "70vw" }} aria-label="Machines">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">IP Address</TableCell>
                                <TableCell align="right">
                                    Operating System
                                </TableCell>
                                <TableCell align="right">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...machines.keys()].map(
                                (ip: string, id: number) => {
                                    let machine = machines.get(ip);
                                    return (
                                        machine && (
                                            <TableRow
                                                key={id}
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        {
                                                            border: 0,
                                                        },
                                                }}
                                                onClick={(e) =>
                                                    handleRowClick(machine.ip)
                                                }
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {machine.username}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {machine.ip}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {machine.os}
                                                </TableCell>
                                                <TableCell
                                                    // TODO: yellow color :(
                                                    align="right"
                                                >
                                                    <Tooltip
                                                        title={`${machine.username} is ${machine.status}`}
                                                    >
                                                        <Chip
                                                            label={
                                                                machine.status
                                                            }
                                                            variant="outlined"
                                                            color={
                                                                machine.status ===
                                                                "online"
                                                                    ? "success"
                                                                    : machine.status ===
                                                                      "offline"
                                                                    ? "error"
                                                                    : "info"
                                                            }
                                                        />
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    );
                                }
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box style={{ width: "full", height: "full" }}>
                    <Box
                        style={{
                            position: "absolute",
                            width: "0px",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </Box>
            )}

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={ignoredListOpen}
                onClose={() => setIgnoredListOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                style={{ overflowX: "auto" }}
            >
                <List sx={{ minWidth: 750 }}></List>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={appListOpen}
                onClose={() => setAppListOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                style={{ overflowX: "auto" }}
            >
                <TableContainer component={Paper} style={style}>
                    <Table
                        stickyHeader
                        sx={{ minWidth: 750 }}
                        aria-label="Machines"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="overflow-scroll">
                            {appList &&
                                appList.map((app: Application, id: number) => (
                                    <TableRow
                                        key={id}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {app.applicationName}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                onClick={() => {
                                                    setIgnored(
                                                        ignored.add(app)
                                                    );
                                                    console.log(ignored);
                                                }}
                                            >
                                                Ignore
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    console.log(
                                                        app.applicationName
                                                    );
                                                    let deleteReq: DeleteRequest =
                                                        {
                                                            Type: "DEL",
                                                            ApplicationName:
                                                                app.applicationName,
                                                            WorkerIp: workerIp,
                                                            Location:
                                                                app.location,
                                                        };
                                                    addToLog(
                                                        "DEL",
                                                        JSON.stringify(
                                                            deleteReq
                                                        )
                                                    );
                                                    socket.send(
                                                        JSON.stringify(
                                                            deleteReq
                                                        )
                                                    );
                                                }}
                                                color="error"
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Modal>
        </div>
    );
};

export default Machines;
