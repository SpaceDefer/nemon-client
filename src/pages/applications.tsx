import Toolbar from "../components/toolbar";
import {useState} from 'react'

export default function Applications() {
    const [types,setTypes] = useState<[string]>();
    return (
        <div className="p-12">
            <p className="font-bold text-2xl mb-4">Allowed Applications</p>

            <p className="font-bold text-2xl mt-4">Office Applications</p>
            <Toolbar/>
            <div>

            </div>
        </div>
    )
}