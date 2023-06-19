import DataTable from "@/components/data-table";
import RefreshButton from "@/components/refresh-button";
import {config} from "../../../config";

async function getData (id: string ) {
  const addresses = config.alerts.filter(e => e.id === parseInt(id))[0].addresses;
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
      return { id: i, col1: o.block_signed_at, col2: o.from_address, col3: o.to_address , col4: o.pretty_value_quote }
  })
}

export default async function Page({ params }: { params: { slug: string } }) {
    const data:any = await getData(params.slug);
    return (
      <div className="p-12 rounded-lg backdrop-blur-lg   w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <p className="text-sm text-gray-500">
            </p>
          </div>
          <RefreshButton />
        </div>
        <div className="divide-y divide-gray-900/5 flex flex-col">
          <DataTable rows={data}/>
        </div>
      </div>
    )
}