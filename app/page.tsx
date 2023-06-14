import Auth from '@/components/auth'
import TablePlaceholder from '@/components/table-placeholder'
import { Suspense } from 'react'
export const runtime = 'edge'
export const preferredRegion = 'home'
export const dynamic = 'force-dynamic'

export default function Home({}) {
  return (
    <main className="">
      <Suspense fallback={<TablePlaceholder />}>
          {/* @ts-expect-error Async Server Component */}
        <Auth/>
      </Suspense>
    </main>
  )
}
