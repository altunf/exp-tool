import { create } from "zustand";
import {
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
} from "@xyflow/react";
import type { FlowState, FlowActions } from "@/types/store-types";
import type { ExperimentNode } from "@/types/node-types";

export const useCoreFlowStore = create<FlowState & FlowActions>((set) => ({
  nodes: [],
  edges: [],
  nodeCounter: 0,
  reactFlowInstance: null,
  selectedNode: null,
  rightPanelOpen: false,

  isRunning: false,
  currentRunningNodeIndex: 0,
  runnerBackgroundColor: "#000000",

  setSelectedNode: (node) =>
    set({ selectedNode: node, rightPanelOpen: !!node }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setReactFlowInstance: (instance) => set({ reactFlowInstance: instance }),
  setIsRunning: (isRunning) => set({ isRunning, currentRunningNodeIndex: 0 }),
  setCurrentRunningNodeIndex: (index) =>
    set({ currentRunningNodeIndex: index }),
  setRunnerBackgroundColor: (color) => set({ runnerBackgroundColor: color }),

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as ExperimentNode[],
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (params: Connection) => {
    set((state) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: "custom",
        animated: true,
        style: { stroke: "#555" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#555",
        },
      };
      // Eğer edge zaten varsa, onu güncelle
      const edgeExists = state.edges.some(
        (edge) =>
          edge.source === params.source &&
          edge.target === params.target &&
          edge.sourceHandle === params.sourceHandle &&
          edge.targetHandle === params.targetHandle
      );
      if (edgeExists) {
        return {
          edges: state.edges.map((edge) =>
            edge.source === params.source &&
            edge.target === params.target &&
            edge.sourceHandle === params.sourceHandle &&
            edge.targetHandle === params.targetHandle
              ? newEdge
              : edge
          ),
        };
      }
      // Yoksa yeni edge ekle
      return { edges: [...state.edges, newEdge] };
    });
  },
}));