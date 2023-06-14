"use client"
import { useState } from "react";
import { Alert, IconButton, Input, InputAdornment, Snackbar } from "@mui/material";
import WalletIcon from '@mui/icons-material/Wallet';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { AddWallet } from '@/lib/wallet';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Toaster from "./Toaster";

export default function WalletForm () {
    const [address, setAddress] = useState<string>("");
    const [toast, setToast] = useState({
        error: false,
        open: false,
        message: ""
    });
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleAddWallet = async () =>{
        try{
            await AddWallet(address);
            setToast({
                open: true,
                error:false,
                message: "Successfully added wallet"
            })
            startTransition(() => {
                router.refresh()
            })

        }catch(e){
            setToast({
                open: true,
                error:true,
                message: "Something went wrong, please try again."
            })

        }
    }

    return (
        <div className="w-full">
            <Toaster toast={toast} setToast={setToast}/>
            <div className="flex gap-4">
                <Input
                    onChange={(e)=>{
                        setAddress(e.target.value);
                    }}
                    className="w-full"
                    placeholder="Add wallet address"
                    id="input-with-icon-adornment"
                    startAdornment={
                    <InputAdornment position="start">
                        <WalletIcon />
                    </InputAdornment>
                    }
                />
                <IconButton aria-label="add" color="primary" onClick={handleAddWallet}>
                    <AddBoxIcon />
                </IconButton>
            </div>
        </div>
    )
}