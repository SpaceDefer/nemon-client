import { Link, Navigate } from "react-router-dom";
import DisplaySolid from "../assets/display-solid.svg";
import ListUlSOlid from "../assets/list-ul-solid.svg";
import GearSolid from "../assets/gear-solid.svg";
import ExitSOlid from "../assets/exit-solid.svg";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { internalIpV4 } from "internal-ip";

export default function Sidebar() {
    const location = useLocation();
    const [ip, setIp] = useState<string>("");
    const [currLocation, setCurrLocation] = useState("");
    useEffect(() => {
        const setip = async () => {
            var i = await internalIpV4();
            setIp(i ? i : "connect to a LAN");
        };
        setip();
        setCurrLocation(location.pathname.split("/")[1]);
    }, [location]);
    return (
        <div className="h-screen w-[250px] bg-neutral-900 rounded-tr-[50px] pt-[150px] flex flex-col items-center">
            <div className="flex-grow w-[250px]">
                <div
                    className={
                        "flex border-l-4 h-12 pl-6 " +
                        (currLocation == "machines"
                            ? "border-[#0bbe6e]"
                            : "border-neutral-900")
                    }
                >
                    <Link to="/machines" className="flex items-center">
                        <img
                            src={DisplaySolid}
                            className="h-[20px] pr-[15px]"
                        />
                        <p className="text-slate-50 text-sm">Machines</p>
                    </Link>
                </div>
                <div
                    className={
                        "flex border-l-4 h-12 pl-6 " +
                        (currLocation == "applications"
                            ? "border-[#0bbe6e]"
                            : "border-neutral-900")
                    }
                >
                    <Link to="/applications" className="flex items-center">
                        <img src={ListUlSOlid} className="h-[20px] pr-[18px]" />
                        <p className="text-slate-50 text-sm">Applications</p>
                    </Link>
                </div>
            </div>
            <div className="flex-grow-0  border-t-[1px] border-t-slate-100  w-[200px]">
                <div className="flex py-6 items-center">
                    <div className="h-[40px] w-[40px] rounded-full bg-slate-100 mr-2" />
                    <div className="flex flex-col">
                        <p className="text-slate-50 font-semibold text-sm">
                            Admin
                        </p>
                        <p className="text-slate-50 text-xs">{ip}</p>
                    </div>
                </div>
                <div className="flex mb-2">
                    <img src={GearSolid} className="h-[20px] pr-[14px]" />
                    <p className="text-slate-50 text-sm font-semibold">
                        Settings
                    </p>
                </div>
                <div className="flex mt-2 mb-8">
                    <img src={ExitSOlid} className="h-[20px] pr-[15px]" />
                    <p className="text-slate-50 text-sm font-semibold">Exit</p>
                </div>
            </div>
        </div>
    );
}
