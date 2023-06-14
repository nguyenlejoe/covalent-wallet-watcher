'use client';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { API_BASE_URL, cookie_write } from '@/lib/utils';
import { useRouter } from 'next/navigation'

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
    const router = useRouter()

    const handleLogin = async () => {
        const resp:any = await fetch(`${API_BASE_URL}/api/login`, {
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
        router.push("/dashboard")
        

    }

    return (
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto min-w-[30rem] w-full flex flex-col gap-[2rem]">
        <h1 className='text-xl'>Login</h1>
        {failed && <Alert severity="error">Unknown user or bad credentials</Alert>}
        <TextField className="w-full" id="standard-basic" label="Username" variant="standard" onChange={(e)=>{
            setUser({...user, ...{username: e.target.value}})
        }}/>
        <TextField type='password' className="w-full" id="standard-basic" label="Password" variant="standard" onChange={(e)=>{
            setUser({...user, ...{password: e.target.value}})
        }}/>
        <Button className="w-full" variant="outlined" onClick={handleLogin}>Login</Button>
      </div>
    )
  }
  