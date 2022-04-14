import DownloadSolid from "../assets/download-solid.svg";
import SearchSolid from "../assets/search-solid.svg";
import DownSolid from "../assets/down-solid.svg";

export default function Toolbar() {
    return (
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
            <div className="flex flex-grow-0 bg-white items-center p-2 shadow-sm rounded-lg border-2 mr-4">
                <p className="text-slate-600 text-sm font-semibold px-4 border-r-2 h-full">
                    Sort by
                </p>
                <img src={DownSolid} className="h-[20px] ml-2" />
            </div>
            <img
                src={DownloadSolid}
                className="h-[35px] flex-grow-0 hover:cursor-pointer"
            />
        </div>
    );
}
