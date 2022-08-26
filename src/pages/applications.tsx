import Toolbar from "../components/toolbar";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button, Box, Typography, Modal, TextField } from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridValueGetterParams,
    GridRowParams,
} from "@mui/x-data-grid";
import SearchSolid from "../assets/search-solid.svg";
import blackList from "../constants/blackListedApps.json";
import whiteList from "../constants/whiteListedApps.json";
import { ClassNames } from "@emotion/react";
import Input from "../components/FormInput";

type App = {
    id: string;
    name: string;
    installationDate: number;
    priority: string;
    version: string;
    type: string;
};
type SpecialApp = {
    id: string;
    name: string;
    version: string;
};
const apps = [
    {
        id: "1",
        name: "windows 11",
        installationDate: 1649521342,
        priority: "high",
        version: "11.11.1",
        type: "office",
    },
];

function convertToDateAndTime(ts: number) {
    var date = new Date(ts);

    return (
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
    );
}

const columns: GridColDef[] = [
    { field: "applicationName", headerName: "Name", width: 200 },
    { field: "ip", headerName: "IP", width: 200 },
];

const blackAppsColumns: GridColDef[] = [
    { field: "id", headerName: "S.no.", width: 400 },
    { field: "name", headerName: "Name", width: 400 },
];

const useStyles = makeStyles({
    tableContainer: {
        marginTop: 10,
    },
    addBlackList: {
        height: "200px",
        width: "300px",
        margin: 10,
        borderRadius: "15px",
        backgroundColor: "#565C6B",
        textAlign: "center",
    },
    addWhiteList: {
        height: "200px",
        width: "300px",
        margin: 10,
        borderRadius: "15px",
        backgroundColor: "#59C475",
        textAlign: "center",
    },
    blist: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    modalItems: {
        width: "50%",
        height: "90%",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    addAppBlack: {
        margin: "10px",
    },
});

const Applications = (props: any) => {
    const [apps, setApps] = useState<App[]>();
    const [blackListedApps, setBlackListedApps] = useState();
    const [whiteListedApps, setWhiteListedApps] = useState();

    const [openBlack, setOpenBlack] = useState(false);
    const [openWhite, setOpenWhite] = useState(false);

    const [showBlack, setShowBlack] = useState();
    const [showWhite, setShowWhite] = useState();

    const inputRefBlack = useRef(null);
    const inputRefWhite = useRef(null);
    const styles = useStyles();
    useEffect(() => {
        console.log(blackList.length);
        setBlackListedApps(blackList);
        setWhiteListedApps(whiteList);

        setShowBlack([{ id: "1", name: "Discord", key: "192.168.426.41" }]);
    }, []);
    const handleRowClick = (inp: GridRowParams<any>) => {
        console.log("showBlack Array", props.blApps);
        console.log(inp.row);
    };
    /* @ts-ignore */
    function handleClickBlack(e: any) {
        e.preventDefault();
        let _id = 0;
        let _name = inputRefBlack.current.value;
        if (_name === undefined) return;
        _name = _name.replace(/ /g, "");
        if (_name === "") return;
        if (blackListedApps.length != 0)
            _id = parseInt(blackListedApps[blackListedApps.length - 1].id) + 1;
        const newList = blackListedApps.concat({
            name: _name,
            id: _id,
        });
        setBlackListedApps(newList);
    }

    function handleClickWhite(e: any) {
        e.preventDefault();
        let _id = 0;
        let _name = inputRefWhite.current.value;
        if (_name === undefined) return;
        _name = _name.replace(/ /g, "");
        if (_name === "") return;
        if (whiteListedApps.length != 0)
            _id = whiteListedApps[whiteListedApps.length - 1].id + 1;
        const newList = whiteListedApps.concat({
            name: _name,
            id: _id,
        });
        setWhiteListedApps(newList);
    }
    const BlackListAppsModal = () => {
        return (
            <Modal
                open={openBlack}
                onClose={handleCloseBlack}
                className={styles.blist}
            >
                <div className={styles.modalItems}>
                    <div className="text-3xl mt-10 uppercase">
                        BlackList an App
                    </div>
                    <div className="flex flex-row mt-4">
                        <input
                            style={{
                                border: "1px solid blue",
                                marginRight: "5px",
                            }}
                            ref={inputRefBlack}
                            type="text"
                            id="message"
                            name="message"
                            autoComplete="off"
                        />
                        <div className="styles.addAppBlack">
                            <Button
                                variant="contained"
                                onClick={(e) => handleClickBlack(e)}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                    <div style={{ fontSize: "20px", marginTop: "18px" }}>
                        BLACKLISTED APPLICATIONS
                    </div>
                    <DataGrid
                        style={{
                            height: 400,
                            width: "100%",
                            backgroundColor: "white",
                            marginTop: 10,
                        }}
                        rows={blackListedApps ? blackListedApps : []}
                        columns={blackAppsColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                </div>
            </Modal>
        );
    };

    const WhiteListAppsModal = () => {
        return (
            <Modal
                open={openWhite}
                onClose={handleCloseWhite}
                className={styles.blist}
            >
                <div className={styles.modalItems}>
                    <div className="text-3xl mt-10 uppercase">
                        BlackList an App
                    </div>
                    <div className="flex flex-row mt-4">
                        <input
                            style={{
                                border: "1px solid blue",
                                marginRight: "5px",
                            }}
                            ref={inputRefBlack}
                            type="text"
                            id="message"
                            name="message"
                            autoComplete="off"
                        />
                        <div className="styles.addAppBlack">
                            <Button
                                variant="contained"
                                onClick={(e) => handleClickWhite(e)}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                    <div style={{ fontSize: "20px", marginTop: "18px" }}>
                        WHITELISTED APPLICATIONS
                    </div>
                    <DataGrid
                        style={{
                            height: 400,
                            width: "100%",
                            backgroundColor: "white",
                            marginTop: 10,
                        }}
                        rows={whiteListedApps ? whiteListedApps : []}
                        columns={blackAppsColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                </div>
            </Modal>
        );
    };

    const handleOpenBlack = () => {
        setOpenBlack(true);
    };
    const handleOpenWhite = () => {
        setOpenWhite(true);
    };

    const handleCloseBlack = () => {
        setOpenBlack(false);
    };
    const handleCloseWhite = () => {
        setOpenWhite(false);
    };
    return (
        <div className="p-6 h-screen">
            <p className="font-bold text-2xl">Applications</p>
            <div className="flex">
                <Button
                    onClick={() => {
                        handleOpenBlack();
                    }}
                >
                    <Box className={styles.addBlackList}>
                        <p className="text-2xl mt-0 text-white mt-14">
                            Add Blacklist Apps
                        </p>
                    </Box>
                </Button>
                <Button
                    onClick={() => {
                        handleOpenWhite();
                    }}
                >
                    <Box className={styles.addWhiteList}>
                        <p className="text-2xl mt-0 text-white mt-14">
                            Add Whitelist Apps
                        </p>
                    </Box>
                </Button>
            </div>
            <div>
                <BlackListAppsModal />
                <WhiteListAppsModal />
            </div>
            <div className="flex flex-row w-100 items-center justify-around w-[900px]">
                <div className="flex flex-col w-[400px]">
                    <p className="font-bold text-2xl mt-0">
                        BlackListed Applications
                    </p>
                    <div className="h-[450px]">
                        <DataGrid
                            style={{
                                height: "100%",
                                width: "100%",
                                backgroundColor: "white",
                                marginTop: 10,
                            }}
                            rows={props.blApps ? props.blApps : []}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            onRowClick={handleRowClick}
                        />
                    </div>
                </div>
                <div className="flex flex-col w-[400px]">
                    <p className="font-bold text-2xl mt-0">
                        WhiteListed Applications
                    </p>
                    <div className="h-[450px]">
                        <DataGrid
                            style={{
                                width: "100%",
                                backgroundColor: "white",
                                marginTop: 10,
                            }}
                            rows={showWhite ? showWhite : []}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            onRowClick={handleRowClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Applications;
