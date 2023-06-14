import Form from './form';
import { API_BASE_URL, cookie_read } from '@/lib/utils';
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

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
            return false;
        }
        redirect('/dashboard');

    }
        
};

export default async function Auth() {
    await handleAuth();

    return <div className='flex h-screen justify-center items-center'><Form/></div>

}
