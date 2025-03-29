'use client';

import { Handle, Position } from 'reactflow';
import { useFlowStore } from '../../hooks/useFlowStore';

interface TextNodeProps {
  id: string;
  data: {
    nodeType: 'text';
    message: string;
    next?: string;
  };
}

export default function TextNode({ id, data }: TextNodeProps) {
  const { updateNode } = useFlowStore();
  
  return (
    <div className="p-4 rounded-md border bg-white shadow-sm min-w-[200px]">
      <div className="font-semibold text-sm text-green-600 mb-1">Text Message</div>
      <div className="text-sm">{data.message}</div>
      
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