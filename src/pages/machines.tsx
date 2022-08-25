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
import { addToLog } from "../logger";

import {
    Box,
    Chip,
    CircularProgress,
    Grid,
    List,
    ListItem,
    Tooltip,
} from "@mui/material";
import { Application, DeleteRequest } from "../App";

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

const Machines = (props: any) => {
    const [ignoredListOpen, setIgnoredListOpen] = useState<boolean>(false);

    const [appListOpen, setAppListOpen] = useState(false);
    const [ignored, setIgnored] = useState<Set<Application>>(
        new Set<Application>()
    );
    const [workerIp, setWorkerIp] = useState<string>("");

    useEffect(() => {
        props.setSize(props.ips.size);
    }, [props.flip]);

    const handleRowClick = (id: string) => {
        console.log(props.apps);
        props.setAppList(props.apps?.get(id));
        setWorkerIp(id);
        setAppListOpen(true);
    };
    const socket = useSocket();
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
            {props.alertConfig && (
                <Snackbar open={props.open} autoHideDuration={6000}>
                    <Alert severity={props.alertConfig.severity || "warning"}>
                        {props.alertConfig.message}
                    </Alert>
                </Snackbar>
            )}
            {!props.refreshing ? (
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
                            {[...props.machines.keys()].map(
                                (ip: string, id: number) => {
                                    let machine = props.machines.get(ip);
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
                            {props.appList &&
                                props.appList.map(
                                    (app: Application, id: number) => (
                                        <TableRow
                                            key={id}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    {
                                                        border: 0,
                                                    },
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
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
                                                                WorkerIp:
                                                                    workerIp,
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
                                    )
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Modal>
        </div>
    );
};

export default Machines;
