import { DeleteWallet, GetWallets } from '@/lib/wallet'
import DeleteWalletButton from './delete-wallet';

export default async function WalletList () {
    const data = await GetWallets();
    return (
        <div className="w-full py-3">
            <div className="flex gap-4 flex-col">
                {data.wallets.rows?.map((o, i) => {
                    return <div className="flex gap-2 bg-slate-100 w-full rounded-md p-2 shadow-sm" key={i}>
                        <DeleteWalletButton id={o.id}/>
                        {o.address}
                    </div>
                })}
            </div>
        </div>
    )
}