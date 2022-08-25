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
import allowedList from "../allowedApplications.json";
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
    { field: "name", headerName: "Name", width: 400 },
    {
        field: "installationDate",
        headerName: "Installation Date",
        width: 300,
        valueGetter: (params: GridValueGetterParams) =>
            `${convertToDateAndTime(params.row.installationDate)}`,
    },
    { field: "priority", headerName: "Priority", width: 200 },
    { field: "version", headerName: "Version", width: 200, sortable: false },
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

const Applications = () => {
    const [apps, setApps] = useState<App[]>();
    const [blackListedApps, setBlackListedApps] = useState();
    const [whiteListedApps, setWhiteListedApps] = useState();

    const [openBlack, setOpenBlack] = useState(false);
    const [openWhite, setOpenWhite] = useState(false);

    const [blackAppName, setBlackAppName] = useState("");
    const inputRefBlack = useRef(null);
    const inputRefWhite = useRef(null);
    const styles = useStyles();
    useEffect(() => {
        console.log(blackList.length);
        setApps(allowedList);
        setBlackListedApps(blackList);
        setWhiteListedApps(whiteList);
    }, []);
    const handleRowClick = (inp: GridRowParams<any>) => {
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
        let _name = inputRefBlack.current.value;
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
                    <div>Black List an App</div>
                    <input
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
                    <div>Add app to whitelist</div>
                    <input
                        ref={inputRefWhite}
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
                            Add app
                        </Button>
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
                        <Typography> </Typography>
                    </Box>
                </Button>
                <Button
                    onClick={() => {
                        handleOpenWhite();
                    }}
                >
                    <Box className={styles.addWhiteList}>
                        <Typography> </Typography>
                    </Box>
                </Button>
            </div>
            <div>
                <BlackListAppsModal />
                <WhiteListAppsModal />
            </div>
            <p className="font-bold text-2xl mt-0">Allowed Applications</p>
            <div className="flex w-[1150px] mt-2 items-center ">
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
            <DataGrid
                style={{
                    height: 400,
                    width: "100%",
                    backgroundColor: "white",
                    marginTop: 10,
                }}
                rows={apps ? apps : []}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={handleRowClick}
            />
        </div>
    );
};

export default Applications;
