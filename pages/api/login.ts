import { NextApiRequest, NextApiResponse } from 'next';
const jwt = require('jsonwebtoken');
 
export default async function login(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password } = req.body;
  
    if (username === process.env.NEXT_PUBLIC_USER_NAME && password ===  process.env.NEXT_PUBLIC_USER_PASSWORD) {
      const token = jwt.sign({
        isLogged: true
      }, process.env.CLIENT_SECRET)
      res.setHeader('Set-Cookie', `wallet_token=${token}; HttpOnly; Path=/`);
      return res.status(200).json({ 
          error: false,
          message: "Successfully logged in.",
          data: {token}
       });
    } else {
      return res.status(401).json({ 
        error: true,
        message: "Failed to login",
     });
    }
}

