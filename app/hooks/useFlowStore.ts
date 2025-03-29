'use client';

import { create } from 'zustand';
import { Flow, FlowNode, FlowEdge } from '../types/flow';

interface FlowState {
  // Current flow
  currentFlow: Flow | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFlow: (flow: Flow) => void;
  updateNode: (nodeId: string, updates: Partial<FlowNode>) => void;
  addNode: (node: FlowNode) => void;
  removeNode: (nodeId: string) => void;
  updateEdge: (edgeId: string, updates: Partial<FlowEdge>) => void;
  addEdge: (edge: FlowEdge) => void;
  removeEdge: (edgeId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetFlow: () => void;
}

// Default empty flow
const defaultFlow: Flow = {
  id: '',
  name: '',
  description: '',
  createdAt: '',
  updatedAt: '',
  nodes: [],
  edges: []
};

export const useFlowStore = create<FlowState>((set) => ({
  currentFlow: null,
  isLoading: false,
  error: null,

  setFlow: (flow) => set({ currentFlow: flow, error: null }),
  
  updateNode: (nodeId, updates) => set((state) => {
    if (!state.currentFlow) return state;
    
    const updatedNodes = state.currentFlow.nodes.map((node) => 
      node.id === nodeId ? { ...node, ...updates } : node
    );
    
    return {
      currentFlow: {
        ...state.currentFlow,
        nodes: updatedNodes,
        updatedAt: new Date().toISOString(),
      }
    };
  }),
  
  addNode: (node) => set((state) => {
    if (!state.currentFlow) return state;
    
    return {
      currentFlow: {
        ...state.currentFlow,
        nodes: [...state.currentFlow.nodes, node],
        updatedAt: new Date().toISOString(),
      }
    };
  }),
  
  removeNode: (nodeId) => set((state) => {
    if (!state.currentFlow) return state;
    
    // Remove all edges connected to this node
    const updatedEdges = state.currentFlow.edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );
    
    return {
      currentFlow: {
        ...state.currentFlow,
        nodes: state.currentFlow.nodes.filter((node) => node.id !== nodeId),
        edges: updatedEdges,
        updatedAt: new Date().toISOString(),
      }
    };
  }),
  
  updateEdge: (edgeId, updates) => set((state) => {
    if (!state.currentFlow) return state;
    
    const updatedEdges = state.currentFlow.edges.map((edge) => 
      edge.id === edgeId ? { ...edge, ...updates } : edge
    );
    
    return {
      currentFlow: {
        ...state.currentFlow,
        edges: updatedEdges,
        updatedAt: new Date().toISOString(),
      }
    };
  }),
  
  addEdge: (edge) => set((state) => {
    if (!state.currentFlow) return state;
    
    return {
      currentFlow: {
        ...state.currentFlow,
        edges: [...state.currentFlow.edges, edge],
        updatedAt: new Date().toISOString(),
      }
    };
  }),
  
  removeEdge: (edgeId) => set((state) => {
    if (!state.currentFlow) return state;
    
    return {
      currentFlow: {
        ...state.currentFlow,
        edges: state.currentFlow.edges.filter((edge) => edge.id !== edgeId),
        updatedAt: new Date().toISOString(),
      }
    };
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  resetFlow: () => set({ currentFlow: null, error: null }),
})); 