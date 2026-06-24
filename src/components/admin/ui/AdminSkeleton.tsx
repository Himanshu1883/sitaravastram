export function AdminDashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-card p-6 h-32">
            <div className="w-10 h-10 rounded-xl bg-gray-100 mb-4" />
            <div className="h-7 w-24 bg-gray-100 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-card h-72" />
        <div className="admin-card h-72" />
      </div>
      <div className="admin-card h-64" />
    </div>
  );
}

export function AdminErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 text-xl font-bold">
        !
      </div>
      <p className="font-heading text-lg font-semibold text-navy-700 mb-1">
        Could not load admin data
      </p>
      <p className="font-body text-sm text-gray-500 max-w-md">{message}</p>
    </div>
  );
}
