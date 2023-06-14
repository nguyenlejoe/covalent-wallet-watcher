"use client"
import { Alert, Snackbar } from "@mui/material"

interface ToasterProps {
    toast: any,
    setToast: Function;
}

export default function Toaster(props: ToasterProps){
    return <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={props.toast.open} autoHideDuration={6000} onClose={()=>{props.setToast({...props.toast, ...{open: false}})}}>
    <Alert onClose={()=>{props.setToast({...props.toast, ...{open: false}})}} severity={props.toast.error ? "error" : "success"} sx={{ width: '100%' }}>
        {props.toast.message}
    </Alert>
</Snackbar>
}