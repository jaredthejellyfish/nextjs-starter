'use client';

import React from 'react';

import counterStore from '@s/counter.store';

function StoreSubscriber() {
  const { set, increase, decrease, count } = counterStore();
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 border p-3 rounded-xl">
      <h1 className="text-4xl font-semibold">{count}</h1>
      <div className="flex flex-row gap-2">
        <button
          className="rounded px-2 py-1 bg-neutral-400"
          onClick={() => increase(1)}
        >
          Increase
        </button>
        <button
          className="rounded px-2 py-1 bg-neutral-400"
          onClick={() => set(0)}
        >
          Reset
        </button>
        <button
          className="rounded px-2 py-1 bg-neutral-400"
          onClick={() => decrease(1)}
        >
          Decrease
        </button>
      </div>
    </div>
  );
}

export default StoreSubscriber;
