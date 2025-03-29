export type NodeType = 
  | 'text' 
  | 'multipleChoice' 
  | 'collectInfo' 
  | 'conditional' 
  | 'end';

export interface FlowNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
}

export interface TextNodeData {
  nodeType: 'text';
  message: string;
  next?: string;
}

export interface MultipleChoiceNodeData {
  nodeType: 'multipleChoice';
  message: string;
  choices: {
    id: string;
    text: string;
    next: string;
  }[];
}

export interface CollectInfoNodeData {
  nodeType: 'collectInfo';
  message: string;
  variableName: string;
  next: string;
}

export interface ConditionalNodeData {
  nodeType: 'conditional';
  variable: string;
  conditions: {
    id: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
    value: string;
    next: string;
  }[];
  defaultNext?: string;
}

export interface EndNodeData {
  nodeType: 'end';
  message?: string;
}

export type NodeData = 
  | TextNodeData 
  | MultipleChoiceNodeData 
  | CollectInfoNodeData 
  | ConditionalNodeData 
  | EndNodeData;

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
} 