'use client';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { cookie_write } from '@/lib/utils';

interface UserForm {
    username: string,
    password: string
}
export default function Form() {
    const [user, setUser] = useState<UserForm>({
        username: "",
        password: ""
    });
    const [failed, setFailed] = useState<boolean>(false);

    const handleLogin = async () => {
        const resp:any = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password
            }), 
          })
        
        const result = await resp.json();


        if(result.error){
            setFailed(true);
            return;
        }

        cookie_write("wallet_token", result.data.token);

    }

    return (
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full flex flex-col gap-[2rem]">
        <h1 className='text-xl'>Login</h1>
        {failed && <Alert severity="error">Unknown user or bad credentials</Alert>}
        <TextField className="w-full" id="standard-basic" label="Username" variant="standard" onChange={(e)=>{
            setUser({...user, ...{username: e.target.value}})
        }}/>
        <TextField className="w-full" id="standard-basic" label="Password" variant="standard" onChange={(e)=>{
            setUser({...user, ...{password: e.target.value}})
        }}/>
        <Button className="w-full" variant="outlined" onClick={handleLogin}>Login</Button>
      </div>
    )
  }
  