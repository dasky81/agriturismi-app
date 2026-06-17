export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-72 sm:h-96 bg-gray-200" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonna sinistra */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Info luogo */}
            <div className="flex flex-col gap-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/5" />
            </div>

            {/* Mappa skeleton */}
            <div className="h-64 bg-gray-200 rounded-xl" />

            {/* Descrizione skeleton */}
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/5" />
            </div>
          </div>

          {/* Colonna destra */}
          <div className="flex flex-col gap-6">
            {/* Servizi skeleton */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-7 w-20 bg-gray-200 rounded-full" />
              ))}
            </div>

            {/* Contatti skeleton */}
            <div className="flex flex-col gap-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>

            {/* Share skeleton */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-24 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
