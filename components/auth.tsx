'use client'

import { Suspense, useEffect, useState } from 'react'
import Form from './form';
import Table from './table';
import TablePlaceholder from './table-placeholder';
import { cookie_read } from '@/lib/utils';
import { useRouter } from 'next/navigation'

export default function Auth() {
    const [isLogged, setLogged] = useState(true);

    // useEffect(()=>{
    //     handleAuth()
    // },[])


    // const handleAuth = async () => {
    //     const cookie = cookie_read("wallet_token");

    //     if (cookie) {
    //         const resp:any = await fetch("http://localhost:3001/api/auth", {
    //             method: "POST",
    //             headers: {
    //               "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                token: cookie
    //             }), 
    //           })
            
    //         const result = await resp.json();    
    
    //         if(result.error){
    //             return;
    //         }

    //         setLogged(true)

    //     }
            
    // };

    if(!isLogged){
        return <Form/>
    }


    return <Suspense fallback={<TablePlaceholder />}>
        {/* @ts-expect-error Async Server Component */}
        <Table />
  </Suspense>

}
