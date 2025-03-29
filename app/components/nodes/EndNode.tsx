'use client';

import { Handle, Position } from 'reactflow';
import { useFlowStore } from '../../hooks/useFlowStore';

interface EndNodeProps {
  id: string;
  data: {
    nodeType: 'end';
    message?: string;
  };
}

export default function EndNode({ id, data }: EndNodeProps) {
  const { updateNode } = useFlowStore();
  
  return (
    <div className="p-4 rounded-md border bg-white shadow-sm min-w-[200px]">
      <div className="font-semibold text-sm text-red-600 mb-1">End Flow</div>
      {data.message && (
        <div className="text-sm">{data.message}</div>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  );
} 