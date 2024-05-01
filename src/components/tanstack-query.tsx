'use client';

import { type QueryFunction, useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import React from 'react';

const getTodos: QueryFunction = async () => {
  const response = await fetch('/api/hello');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function TanstackQuery() {
  const { data, error, refetch, isLoading, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
  return (
    <div className="flex items-center justify-center flex-col gap-3 border rounded-xl p-5 relative">
      <button
        onClick={() => refetch()}
        className="absolute -top-2.5 -right-2.5 p-1 rounded-full flex items-center justify-center bg-gray-200 text-black border"
      >
        <RefreshCw size={18} />
      </button>
      <h1 className="text-2xl font-semibold">
        Data from <span className="font-regular text-gray-400">/api/hello</span>
      </h1>
      {error ? <pre>Error</pre> : null}
      <pre>
        {!error && (isLoading || isFetching)
          ? 'Loading for 1s...'
          : JSON.stringify(data)}
      </pre>
    </div>
  );
}

export default TanstackQuery;
