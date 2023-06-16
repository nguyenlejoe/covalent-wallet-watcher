import { CreateTransaction, EditTransaction, GetLatestTransaction, GetWallets } from '@/lib/wallet';
import { NextApiRequest, NextApiResponse } from 'next';
const jwt = require('jsonwebtoken');
 
export default async function GetTelegramChat(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const token = ""
    let decode;

    try {
        decode = jwt.verify(token, process.env.CLIENT_SECRET);
    } catch (error) {
        decode = false;
    }

    if(!decode){
        return res.status(401).json({ 
            error: false,
            message: "Unsuccessful authentication.",
            data: {token}
         });
    }

    const resp:any = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_ID}/getUpdates`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }})
    
    const result = await resp.json();  
    const chat = result.result;

    return res.status(200).json({ 
        error: false,
        message: "Successful",
        data: {
            chat_id: chat
        }
    });
    
    if(chat || chat.length > 0){
        return res.status(200).json({ 
            error: false,
            message: "Successful",
            data: {
                chat_id: chat[0].message.chat.id
            }
        });
    }

    return res.status(200).json({ 
        error: true,
        message: "Failed",
        data:""
    });
}

