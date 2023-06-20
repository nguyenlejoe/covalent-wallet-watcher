import RefreshButton from './refresh-button'

export default function TablePlaceholder() {
  return (
    <div className="p-12 rounded-lg backdrop-blur-lg w-full">
    <div className="flex justify-between items-center mb-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <p className="text-sm text-gray-500">
        </p>
      </div>
      <RefreshButton />
    </div>
    <div className="bg-slate-100 flex flex-col">
      {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4">
            <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse" />
          </div>
        ))}
    </div>
  </div>

  )
}
