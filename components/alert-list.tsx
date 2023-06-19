import Link from "next/link";
import data from "../config.json";

export default function AlertList () {

    return (
        <div className="w-full py-3">
            <div className="flex gap-4 flex-col">
                {data.alerts.map((o, i) => {
                    return <Link key={i} href={`/dashboard/${o.id}`}>
                    <div className="flex gap-2 border-b w-full rounded-md py-6 px-4 shadow-sm bg-slate-100" key={i}>
                        <p className='overflow-hidden truncate'>{o.name}</p>
                    </div>
                    </Link>
                })}
            </div>
        </div>
    )
}