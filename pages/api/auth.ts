import { NextApiRequest, NextApiResponse } from 'next';
const jwt = require('jsonwebtoken');
 
export default async function auth(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
    const { token } = req.body;
    let decode

    try {
        decode = jwt.verify(token, 'shh');
    } catch (error) {
        decode = false;
    }
  
    if(decode){
        return res.status(200).json({ 
            error: false,
            message: "Successfully authenticated.",
            data: decode
         });
    }else{
        return res.status(401).json({ 
            error: false,
            message: "Unsuccessful authentication.",
            data: {token}
         });
    }

}