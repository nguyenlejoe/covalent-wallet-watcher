"use client"
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteWallet, GetWallets } from '@/lib/wallet'
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Toaster from './Toaster';

interface DeleteProps {
    id: string;
}

export default function DeleteWalletButton (props: DeleteProps) {

    const [toast, setToast] = useState({
        error: false,
        open: false,
        message: ""
    });
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleAddWallet = async () =>{
        try{
            await DeleteWallet(props.id);
            setToast({
                open: true,
                error:false,
                message: "Successfully deleted wallet"
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

    return <div className='cursor-pointer' onClick={handleAddWallet}>
        <Toaster toast={toast} setToast={setToast}/>
        <DeleteIcon/>
    </div>
} 