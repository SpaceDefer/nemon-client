import SearchSolid from "../assets/search-solid.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import { useCallback, useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useSocket } from "../hooks/useSocket";
import { Box } from "@mui/material";

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

interface App {
    applicationName: string;
    location: string;
}

interface Machine {
    ip: string;
    username: string;
    hostname: string;
    os: string;
    status: string;
}

interface MachineApplicationsMap {
    [key: string]: App[];
}

interface IpToMachineMap {
    [key: string]: Machine;
}

const machines = [
    {
        id: "1",
        name: "machine 1",
        ipAddress: "192.168.20.89",
        status: "offline",
    },
];

const Machines = () => {
    const [apps, setApps] = useState<MachineApplicationsMap>({});
    const [appList, setAppList] = useState<App[]>([]);
    const [machines, setMachines] = useState<Map<string, Machine>>(
        new Map<string, Machine>()
    );
    const [alert, setAlert] = useState<string>();
    const [ips, setIps] = useState<Set<string>>(new Set<string>());
    const [appListOpen, setAppListOpen] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const socket = useSocket();

    const onMessage = useCallback((message) => {
        const data = JSON.parse(message?.data);
        console.log(data);

        switch (data.type) {
            case "INF":
                const temp = apps;
                temp[data.workerIp] = data.applicationList;
                console.log(temp);
                setApps(temp);

                var newMachine: Machine = {
                    ip: data.workerIp,
                    username: data.username,
                    hostname: data.hostname,
                    os: data.os,
                    status: "online",
                };
                const t = ips;
                if (t.has(data.workerIp)) {
                    return;
                }
                const mt = machines;
                mt.set(data.workerIp, newMachine);
                t.add(data.workerIp);
                setIps(t);
                setMachines(mt);
                console.log(t);
                break;
            case "ALT":
                console.log(data.message);
                setAlert(data.message);
                setOpen(true);
                setTimeout(() => setOpen(false), 3000);
        }
    }, []);

    useEffect(() => {
        socket.addEventListener("message", onMessage);

        return () => {
            socket.removeEventListener("message", onMessage);
        };
    });

    const handleRowClick = (id: string) => {
        setAppList(apps[id]);
        console.log(apps[id]);
        setAppListOpen(true);
    };
    return (
        <div className="p-12">
            <p className="font-bold text-2xl">Network Computers</p>
            <div className="flex w-[1150px] mt-2 items-center mb-2">
                <div className="flex bg-white items-center p-2 shadow-sm rounded-lg w-[500px] border-2 ">
                    <img src={SearchSolid} className="h-[20px] mr-4 ml-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transperant appearance-none outline-none"
                    />
                </div>
                <div className="flex-grow" />
            </div>
            {alert && (
                <Snackbar open={open} autoHideDuration={5000}>
                    <Alert severity="error">{alert}</Alert>
                </Snackbar>
            )}
            {ips.size > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 1150 }} aria-label="Machines">
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
                            {[...machines.keys()].map((ip: string) => {
                                let machine = machines.get(ip);
                                console.log("this machine,", machine);
                                return (
                                    machine && (
                                        <TableRow
                                            key={machine.ip}
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
                                                align="right"
                                                style={{
                                                    color:
                                                        machine.status ===
                                                        "online"
                                                            ? "#03C04A"
                                                            : "#E3242B",
                                                }}
                                            >
                                                {machine.status}
                                            </TableCell>
                                        </TableRow>
                                    )
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box
                    style={{
                        marginTop: "10vh",
                        marginLeft: "10vw",
                        fontSize: "3vh",
                    }}
                >
                    loading...
                </Box>
            )}
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
                    <Table sx={{ minWidth: 750 }} aria-label="Machines">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="overflow-scroll">
                            {appList &&
                                appList.map((app) => (
                                    <TableRow
                                        key={app.applicationName}
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
                                            <Button>Add to blocked</Button>
                                            <Button color="error">
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
