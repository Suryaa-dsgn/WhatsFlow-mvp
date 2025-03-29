'use client';

import { Handle, Position } from 'reactflow';
import { useFlowStore } from '../../hooks/useFlowStore';

interface Condition {
  id: string;
  operator: string;
  value: string;
  next?: string;
}

interface ConditionalNodeProps {
  id: string;
  data: {
    nodeType: 'conditional';
    variable: string;
    conditions: Condition[];
    defaultNext?: string;
  };
}

export default function ConditionalNode({ id, data }: ConditionalNodeProps) {
  const { updateNode } = useFlowStore();
  
  return (
    <div className="p-4 rounded-md border bg-white shadow-sm min-w-[250px]">
      <div className="font-semibold text-sm text-orange-600 mb-1">Conditional</div>
      <div className="text-sm mb-2">
        If <span className="font-medium">{data.variable}</span>:
      </div>
      
      <div className="space-y-1 mb-2">
        {data.conditions.map((condition, index) => (
          <div key={condition.id} className="text-xs py-1 px-2 bg-orange-50 rounded flex justify-between">
            <span>{condition.operator} "{condition.value}"</span>
            
            <Handle
              type="source"
              position={Position.Right}
              id={condition.id}
              className="w-2 h-2 bg-orange-400"
              style={{ 
                right: -10,
                top: '50%'
              }}
            />
          </div>
        ))}
        
        {data.defaultNext && (
          <div className="text-xs py-1 px-2 bg-gray-100 rounded">
            Default
            
            <Handle
              type="source"
              position={Position.Bottom}
              id="default"
              className="w-2 h-2 bg-gray-400"
            />
          </div>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  );
} 