import SearchSolid from "../assets/search-solid.svg"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button'

function convertToDateAndTime(ts: number) {
    var date = new Date(ts*1000);
    const tstring = date.getDate() +
        "/" + (date.getMonth() + 1) +
        "/" + date.getFullYear() +
        " " + date.getHours() +
        ":" + date.getMinutes()
    return tstring;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    p: 4,
};

type App = {
    id: string;
    name: string;
    installationDate: number;
    priority: string;
    version: string;
    type: string;
}

type Machine = {
    id: string;
    name: string;
    ipAddress: string;
    status: string;
}

const machines = [
    {
        id: '1',
        name: "machine 1",
        ipAddress: "192.168.20.89",
        status: "offline"
    }
]
const apps = [
    {
        id: "1",
        name: "windows 11",
        installationDate: 1649521342,
        priority: "high",
        version: "11.11.1",
        type: "office"
    }
]

export default function Machines() {
    //const [apps, setApps] = useState<App[]>();
    //const [machines, setMachines] = useState<Machine[]>();
    const [appListOpen, setAppListOpen] = useState(false)
    const handleRowClick = (id: string) => {
        setAppListOpen(true)
    }
    return (
        <div className="p-12">
            <p className="font-bold text-2xl">Network Computers</p>
            <div className="flex w-[1150px] mt-2 items-center mb-2">
                <div className="flex bg-white items-center p-2 shadow-sm rounded-lg w-[500px] border-2 ">
                    <img src={SearchSolid} className="h-[20px] mr-4 ml-2" />
                    <input type="text" placeholder="Search" className="bg-transperant appearance-none outline-none" />
                </div>
                <div className="flex-grow" />
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1150 }} aria-label="Machines">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">IP Address</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {machines?.map((machine) => (
                            <TableRow
                                key={machine.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onClick={(e) => handleRowClick(machine.id)}
                            >
                                <TableCell component="th" scope="row">
                                    {machine.name}
                                </TableCell>
                                <TableCell align="right">{machine.ipAddress}</TableCell>
                                <TableCell align="right" style={{ color: ((machine.status === 'online') ? '#03C04A' : '#E3242B') }}>{machine.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
            >
                <TableContainer component={Paper} style={style}>
                    <Table sx={{ minWidth: 1150 }} aria-label="Machines">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Installation Date</TableCell>
                                <TableCell align="right">Priority</TableCell>
                                <TableCell align="right">Version</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {apps?.map((app) => (
                                <TableRow
                                    key={app.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {app.name}
                                    </TableCell>
                                    <TableCell align="right">{convertToDateAndTime(app.installationDate)}</TableCell>
                                    <TableCell align="right">{app.priority}</TableCell>
                                    <TableCell align="right">{app.version}</TableCell>
                                    <TableCell align="right">
                                        <Button>Update</Button>
                                        <Button color="error">Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Modal>
        </div>
    )
}