import { CreateTransaction, EditTransaction, GetLatestTransaction, GetWallets } from '@/lib/wallet';
import { NextApiRequest, NextApiResponse } from 'next';
import {config} from "../../../config";
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: '6b6df6c76f2f1c11a6c2de6ef2dea1f4-e5475b88-2f777a5d',
});

const handleTelegramMessage = async (message: string) => {
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


const handleEmail = async (to: string[], message: string, subject: string) => {
    mg.messages
	.create("sandbox1de7d4375ff248ba90ae4124717756eb.mailgun.org", {
		from: "Mailgun Sandbox <postmaster@sandbox1de7d4375ff248ba90ae4124717756eb.mailgun.org>",
		to: to,
		subject: subject,
		text: message,
	});
}



// You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

// You can send up to 300 emails/day from this sandbox server.
// Next, you should add your own domain so you can send 10000 emails/month for free.

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
    let headers = new Headers();
    headers.set('Authorization', `Bearer ${process.env.API_KEY}`);

    // Go through each alert
    for(const i of config.alerts){
        // Get last time cron was called
        const db = await GetLatestTransaction();

        // If first time cron run, 
        if(db.latest_transaction.rows.length === 0){
            await CreateTransaction(new Date());
            return res.status(200).json({ 
                error: false,
                message: "First run",
                data: ""
            });
        }

        const db_recent = new Date(db.latest_transaction.rows[0].created_at);

        // Get latest transactions of addresses in the alert
        const results = await Promise.all(i.addresses.map(async (o,i) => {
            const resp =  fetch(`https://api.covalenthq.com/v1/eth-mainnet/address/${o}/transactions_v3/`, {
                method: "GET",
                headers: headers
            }).then(resp => resp.json())

            const transactions = await resp;
            return [...transactions.data.items]
        }))
        .catch(async function(err) {
            await handleTelegramMessage(err.message);
        });

        if(!results){
            return res.status(402).json({ 
                error: true,
            });
        }

        // Sort by most recent and flatten array
        const transactions = results.flat().sort((a: any, b: any) => {
            return new Date(b.block_signed_at).getTime() - new Date(a.block_signed_at).getTime();
        });

        // Go through each transaction
        for(const k of transactions){
            // Only check transactions more recent than last cron
            if(new Date(k.block_signed_at) > db_recent){
                // Filter function for transaction

                // const message = `Recent transaction alert From: ${k.from_address} To: ${k.to_address} Value: ${k.value} Time: ${k.block_signed_at}`;
                const ping = i.filter(k);
                if(ping){
                    if(i.telegram.active){
                        await handleTelegramMessage(i.message);
                    }
                    if(i.email.active){
                        await handleEmail(i.email.to, i.message, i.email.subject);
                    }
                }
            }
        }

    }

    // Edit latest cron call
    await EditTransaction(new Date());

    return res.status(200).json({ 
        error: false,
        message: "Cron Ran"
    });


}

