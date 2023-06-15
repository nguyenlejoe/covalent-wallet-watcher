import { CreateTransaction, EditTransaction, GetLatestTransaction, GetWallets } from '@/lib/wallet';
import { NextApiRequest, NextApiResponse } from 'next';

const handleTelegramMessage = async () => {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_ID}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: "There has been a new transaction! Please visit your wallet application for more details"
        }), 
    })
}
 
export default async function transactions(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
    

    const wallets = await GetWallets();
    let results: Response[] = []
    let transactions: any = [];
    let headers = new Headers();
    headers.set('Authorization', `Bearer ${process.env.API_KEY}`)

    try {
        results = await Promise.all(wallets.wallets.rows?.map((o,i) => {
            return fetch(`https://api.covalenthq.com/v1/eth-mainnet/address/${o.address}/transactions_summary/`, {
                method: "GET",
                headers: headers
              })
        }))
    } catch (error) {
        return res.status(401).json({ 
            error: true,
            message: "Failed to collect data",
         });
    }


    
    for(const i of results){
        const resp = await i.json();
        const latest = resp.data.items[0].latest_transaction.block_signed_at
        transactions = [...transactions, latest]
    }

    const recent = new Date(Math.max(...transactions.map((e: string | number | Date) => new Date(e))));
    const db = await GetLatestTransaction();

    if(db.latest_transaction.rows.length === 0){
        await CreateTransaction(recent);
        return res.status(200).json({ 
            error: false,
            message: "First run",
            data: transactions
        });
    }
    const db_recent = new Date(db.latest_transaction.rows[0].created_at);

    if(db_recent >= recent){
        return res.status(200).json({ 
            error: false,
            message: "No Change",
            data: recent
        });
    }
    

    if(db_recent < recent){
        await EditTransaction(recent);
        try {
            await handleTelegramMessage();
            return res.status(200).json({ 
                error: false,
                message: "Change",
                data: recent
            });
        } catch (error) {
            return res.status(401).json({ 
                error: true,
                message: "Failed to send message",
             });
        }

    }

}

