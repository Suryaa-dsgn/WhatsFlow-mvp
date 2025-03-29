'use client';

import { Handle, Position } from 'reactflow';
import { useFlowStore } from '../../hooks/useFlowStore';

interface CollectInfoNodeProps {
  id: string;
  data: {
    nodeType: 'collectInfo';
    message: string;
    variableName: string;
    next?: string;
  };
}

export default function CollectInfoNode({ id, data }: CollectInfoNodeProps) {
  const { updateNode } = useFlowStore();
  
  return (
    <div className="p-4 rounded-md border bg-white shadow-sm min-w-[220px]">
      <div className="font-semibold text-sm text-purple-600 mb-1">Collect Information</div>
      <div className="text-sm mb-2">{data.message}</div>
      <div className="text-xs text-gray-600 bg-purple-50 p-1 rounded">
        Variable: {data.variableName}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="next"
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  );
} 