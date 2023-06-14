import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense} from 'react'
import Table from '../../components/table';
import TablePlaceholder from '../../components/table-placeholder';
import { headers } from 'next/headers';
import { API_BASE_URL } from '@/lib/utils';


const handleAuth = async () => {
    const cookieStore = cookies()
    const cookie = cookieStore.get('wallet_token')

    if (cookie) {
        const resp:any = await fetch(`${API_BASE_URL}/api/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: cookie.value
            }), 
            })
        
        const result = await resp.json();    

        if(result.error){
            redirect('/')
        }

        return true;

    }else{
        redirect('/')
    }
        
};

export default async function Dashboard () {
    await handleAuth();
    
    return <Suspense fallback={<TablePlaceholder />}>
    {/* @ts-expect-error Async Server Component */}
    <Table />
</Suspense>
}