import { sql } from '@vercel/postgres'
import { timeAgo } from '@/lib/utils'
import RefreshButton from './refresh-button'
import { seed } from '@/lib/seed'
import { GetWallets } from '@/lib/wallet';
import DataTable from './data-table';
import {config} from "../config";

async function getData () {
  const addresses = config.alerts[0].addresses;
  let transactions: any[] = [];
  let headers = new Headers();

  headers.set('Authorization', `Bearer ${process.env.API_KEY}`)

  const results = await Promise.all(addresses.map((o,i) => {
    return fetch(`https://api.covalenthq.com/v1/eth-mainnet/address/${o}/transactions_v3/`, {
        method: "GET",
        headers: headers
    })
      .then(resp => resp.json())
      .then(data => data.data.items);
    }));

    for(const i of await results){
      transactions = [...transactions, ...i]
    }
    
    return transactions.map((o, i) => {
        return { id: i, col1: new Date(o.block_signed_at).toLocaleDateString("en-US"), col2: o.from_address, col3: o.to_address , col4: o.pretty_value_quote }
    })
}

export default async function Table() {
  const data:any = await getData();
  return (
    <div className="p-12 rounded-lg backdrop-blur-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <p className="text-sm text-gray-500">
          </p>
        </div>
        <RefreshButton />
      </div>
      <div className="bg-slate-100 flex flex-col">
        <DataTable rows={data}/>
      </div>
    </div>
  )
}
