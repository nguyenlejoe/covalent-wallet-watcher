import { CreateTransaction, EditTransaction, GetLatestTransaction, GetWallets } from '@/lib/wallet';
import { NextApiRequest, NextApiResponse } from 'next';

const handleTelegramMessage = async (tx: any) => {
    const message = `Recent transaction alert From: ${tx.from_address} To: ${tx.to_address} Value: ${tx.value} Time: ${tx.block_signed_at}`;

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_ID}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "HTML"
        }), 
    })
}

const handleTransaction = async (address: string) => {
    let headers = new Headers();
    headers.set('Authorization', `Bearer ${process.env.API_KEY}`);

    const resp = await fetch(`https://api.covalenthq.com/v1/eth-mainnet/transaction_v2/${address}/`, {
        method: "GET",
        headers: headers
    })

    return await resp.json();
}

export default async function transactions(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    if(!process.env.TELEGRAM_CHAT_ID || !process.env.API_KEY || !process.env.TELEGRAM_CHAT_ID ){
        return res.status(500).json({ 
            error: true,
            message: "No ENV",
         });
    }

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const wallets = await GetWallets();
    let results: Response[] = []
    let transactions: any = [];
    let headers = new Headers();
    headers.set('Authorization', `Bearer ${process.env.API_KEY}`)

    results = await Promise.all(wallets.wallets.rows?.map((o,i) => {
        return fetch(`https://api.covalenthq.com/v1/eth-mainnet/address/${o.address}/transactions_summary/`, {
            method: "GET",
            headers: headers
        })
    }))

    if(!results || results.length <= 0){
        return res.status(500).json({ 
            error: true,
            message: "No transactions",
        });
    }
    
    for(const i of results){
        const resp = await i.json();
        const latest = resp.data.items[0].latest_transaction
        transactions = [...transactions, latest]
    }

    console.log(transactions)

    if(!transactions || transactions.length === 0){
        return res.status(500).json({ 
            error: true,
            message: "No transactions",
        });
    }

    const recent = new Date(Math.max(...transactions.map(((e: { block_signed_at: string | number | Date; }) => new Date(e.block_signed_at)))));
    const recentTransaction = transactions.sort((a: any, b: any) => {
        return new Date(b.block_signed_at).getTime() - new Date(a.block_signed_at).getTime();
      })[0];
    

    const db = await GetLatestTransaction();

    if(!recent || !db){
        return res.status(500).json({ 
            error: true,
            message: "No recent",
        });
    }

    if(db.latest_transaction.rows.length === 0){
        await CreateTransaction(recent);
        return res.status(200).json({ 
            error: false,
            message: "First run",
            data: recentTransaction
        });
    }
    const db_recent = new Date(db.latest_transaction.rows[0].created_at);
    
    if(db_recent < recent){
        await EditTransaction(recent);
        try {
            const transaction_detail = await handleTransaction(recentTransaction.tx_hash);
            await handleTelegramMessage(transaction_detail.data.items[0]);
            return res.status(200).json({ 
                error: false,
                message: "Change",
                data: transaction_detail
            });
        } catch (error) {
            return res.status(500).json({ 
                error: true,
                message: "Failed to send message",
             });
        }
    }

    if(db_recent >= recent){
        return res.status(200).json({ 
            error: false,
            message: "No Change",
            data: {
                db_recent,
                recent
            }
        });
    }


}

