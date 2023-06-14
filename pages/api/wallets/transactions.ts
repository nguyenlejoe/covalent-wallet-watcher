import { NextApiRequest, NextApiResponse } from 'next';
const jwt = require('jsonwebtoken');
 
export default async function transactions(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { address } = req.body;

    let headers = new Headers();
    headers.set('Authorization', `Bearer ${process.env.API_KEY}`)

    const resp:any = await fetch(`https://api.covalenthq.com/v1/eth-mainnet/address/${address}/transactions_summary/`, {
        method: "GET",
        headers: headers
      })
    
    const result = await resp.json();

    return res.status(200).json({ 
        error: false,
        message: "Successfully logged in.",
        data: result
    });

}

