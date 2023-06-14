import TablePlaceholder from "@/components/table-placeholder"
import WalletForm from "@/components/wallet-form"
import WalletList from "@/components/wallet-list"
import { Suspense } from "react"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen bg-slate-50'>
      <div className="flex flex-col gap-4 min-w-[30rem] shadow-xl bg-white/30 p-12">
        <WalletForm/>
        <Suspense fallback={<div>loading...</div>}>
          {/* @ts-expect-error Async Server Component */}
          <WalletList/>
        </Suspense>
      </div>
      {children}
    </div>
  )
}
