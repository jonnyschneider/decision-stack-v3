import { useState } from 'react';
import { BusinessContext } from '@/lib/types';

interface InputFormProps {
  onSubmit: (context: BusinessContext) => Promise<void>;
  disabled?: boolean;
}

export default function InputForm({ onSubmit, disabled }: InputFormProps) {
  const [formData, setFormData] = useState<BusinessContext>({
    industry: '',
    targetMarket: '',
    uniqueValue: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Industry</label>
        <input
          type="text"
          value={formData.industry}
          onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))}
          className="w-full p-2 border rounded"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block mb-2">Target Market</label>
        <input
          type="text"
          value={formData.targetMarket}
          onChange={e => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
          className="w-full p-2 border rounded"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block mb-2">Unique Value</label>
        <textarea
          value={formData.uniqueValue}
          onChange={e => setFormData(prev => ({ ...prev, uniqueValue: e.target.value }))}
          className="w-full p-2 border rounded"
          disabled={disabled}
        />
      </div>
      <button 
        type="submit" 
        disabled={disabled}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {disabled ? 'Generating...' : 'Generate Strategy'}
      </button>
    </form>
  );
}
