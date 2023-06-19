import TablePlaceholder from "@/components/table-placeholder"
import WalletForm from "@/components/wallet-form"
import AlertList from "@/components/alert-list"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { API_BASE_URL } from "@/lib/utils"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: {
    tag: string
    item: string
  }
}) {

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

  await handleAuth();

  return (
    <div className='flex min-h-screen bg-slate-50'>
      <div className="flex flex-col gap-4 min-w-[25rem] shadow-xl bg-white/30 p-12">
         <AlertList/>
      </div>
      {children}
    </div>
  )
}
