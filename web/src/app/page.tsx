'use client'

import { useState } from 'react';
import { BusinessContext, StrategyStatements } from '@/lib/types';
import dynamic from 'next/dynamic';

const StrategyFlow = dynamic(() => import('@/components/StrategyFlow'), {
  ssr: false
});
const InputForm = dynamic(() => import('@/components/InputForm'), {
  ssr: false
});

export default function Home() {
  const [strategy, setStrategy] = useState<StrategyStatements | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (context: BusinessContext) => {
    setLoading(true);
    console.log('Submitting context:', context);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.statements) {
        console.error('No statements in response:', data);
        return;
      }
      
      setStrategy(data.statements);
      console.log('Set strategy state:', data.statements);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Strategy Statement Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <InputForm onSubmit={handleSubmit} disabled={loading} />
        </div>
        <div className="h-[600px] border rounded-lg p-4">
          {strategy ? (
            <StrategyFlow strategy={strategy} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Generate a strategy to visualize relationships
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
