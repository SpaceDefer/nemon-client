import Toolbar from "../components/toolbar";
import { useState } from 'react'
import { makeStyles } from "@mui/styles";
import {Button} from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import SearchSolid from "../assets/search-solid.svg"

type App = {
    id: string;
    name: string;
    installationDate: number;
    priority: string;
    version: string;
    type: string;
}

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 400 },
    {
        field: 'installationDate', headerName: 'Instalation Date', width: 250,
        valueGetter: (params: GridValueGetterParams) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    { field: 'priority', headerName: 'Priority', width: 200 },
    { field: 'version', headerName: 'Version', width: 200 , sortable: false},
];

const useStyles = makeStyles({
    tableContainer: {
        marginTop: 10
    }
})

export default function Applications() {
    const [apps, setApps] = useState<App[]>();
    const styles = useStyles()
    return (
        <div className="p-6 h-screen">
            <p className="font-bold text-2xl">Applications</p>
            <div className="flex">
                <div className="h-[130px] w-[220px] bg-[#0bbe6e] m-6 rounded-lg shadow-md p-2"></div>
                <div className="h-[130px] w-[220px] bg-[#363e52] m-6 rounded-lg shadow-md p-2"></div>
            </div>
            <p className="font-bold text-2xl mt-0">Allowed Applications</p>
            <div className="flex w-[1150px] mt-2 items-center ">
                <div className="flex bg-white items-center p-2 shadow-sm rounded-lg w-[500px] border-2 ">
                    <img src={SearchSolid} className="h-[20px] mr-4 ml-2" />
                    <input type="text" placeholder="Search" className="bg-transperant appearance-none outline-none" />
                </div>
                <div className="flex-grow" />
                <Button>Update</Button>
                <Button color="error">Uninstall</Button>
            </div>
            <DataGrid
                style={{ height: 400, width: '100%', backgroundColor: "white", marginTop: 10 }}
                rows={(apps) ? apps : []}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    )
}