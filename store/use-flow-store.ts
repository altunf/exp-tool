import { create } from "zustand";
import {
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
} from "@xyflow/react";
import type { FlowStore } from "@/types/store-types";
import type { ExperimentNode, ExperimentNodeData } from "@/types/node-types";

// Add this interface for the adjacency list
interface AdjacencyList {
  [key: string]: string[];
}

export const useFlowStore = create<FlowStore>((set, get) => ({
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

  onDragOver: (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  },

  onDrop: (event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("application/reactflow");
    if (typeof type === "undefined" || !type) {
      return;
    }

    const { reactFlowInstance, nodeCounter } = get();
    if (!reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: ExperimentNode = {
      id: `${type}-${nodeCounter}`,
      type: type as ExperimentNode["type"],
      position,
      data: {
        order: nodeCounter,
      } as ExperimentNodeData,
    };

    // Set default data based on node type
    switch (type) {
      case "stimulus":
        newNode.data = {
          ...newNode.data,
          imageUrl: "",
          duration: 1000,
          position: "center",
        } as ExperimentNodeData;
        break;
      case "response":
        newNode.data = {
          ...newNode.data,
          responseType: "keyboard",
          timeout: 5000,
          correctResponse: "",
        } as ExperimentNodeData;
        break;
      case "instruction":
        newNode.data = {
          ...newNode.data,
          text: "Instructions for the participant",
          textColor: "#ffffff",
        } as ExperimentNodeData;
        break;
      case "sound":
        newNode.data = {
          ...newNode.data,
          audioUrl: "",
          duration: 3000,
          delay: 0,
          volume: 80,
          loop: false,
        } as ExperimentNodeData;
        break;
      case "group":
        newNode.data = {
          ...newNode.data,
          label: `Group ${nodeCounter}`,
          childNodes: [],
          duration: 1000,
          width: 300,
          height: 200,
        } as ExperimentNodeData;
        break;
    }

    set((state) => ({
      nodes: [...state.nodes, newNode],
      nodeCounter: state.nodeCounter + 1,
    }));
  },

  updateNodeData: (id, newData) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      }),
      selectedNode:
        state.selectedNode?.id === id
          ? {
              ...state.selectedNode,
              data: {
                ...state.selectedNode.data,
                ...newData,
              },
            }
          : state.selectedNode,
    }));
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNode:
        state.selectedNode?.id === nodeId ? null : state.selectedNode,
      rightPanelOpen:
        state.selectedNode?.id === nodeId ? false : state.rightPanelOpen,
    }));
  },

  handleFileUpload: (event, nodeId, fileType) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        get().updateNodeData(nodeId, {
          [`${fileType}Url`]: dataUrl,
          [`${fileType}Name`]: file.name,
          [`${fileType}Type`]: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  },

  saveExperiment: () => {
    const { nodes, edges, runnerBackgroundColor } = get();
    const experimentData = {
      nodes,
      edges,
      runnerBackgroundColor,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(experimentData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `experiment-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Simplified sequence-related functions
  getSequenceChildNodes: (sequenceId: string) => {
    const { nodes, edges } = get();
    return nodes.filter(node => 
      edges.some(edge => 
        edge.source === sequenceId && 
        edge.sourceHandle === 'bottom' && 
        edge.target === node.id
      )
    );
  },
  
  getNodeGroups: () => {
    const { nodes, edges } = get();
    
    // First, find all sequence nodes
    const sequenceNodes = nodes.filter(node => node.type === 'sequence');
    
    // If no sequence nodes, use simplified logic
    if (sequenceNodes.length === 0) {
      // Just return each node as its own group
      return nodes.map(node => [node]);
    }
    
    // Create a map for quick node lookup
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    
    // Create adjacency list for horizontal connections between sequence nodes
    const sequenceAdjacencyList: AdjacencyList = {};
    edges.forEach(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      
      // Only consider horizontal connections between sequence nodes
      if (sourceNode?.type === 'sequence' && targetNode?.type === 'sequence' && 
          (edge.sourceHandle === 'right' || edge.targetHandle === 'left')) {
        if (!sequenceAdjacencyList[edge.source]) {
          sequenceAdjacencyList[edge.source] = [];
        }
        sequenceAdjacencyList[edge.source].push(edge.target);
      }
    });
    
    // Find starting sequence nodes
    const startSequenceNodes = sequenceNodes.filter(node => 
      !edges.some(edge => 
        edge.target === node.id && 
        nodeMap.get(edge.source)?.type === 'sequence' &&
        (edge.sourceHandle === 'right' || edge.targetHandle === 'left')
      )
    );
    
    const startingPoints = startSequenceNodes.length > 0 ? 
      startSequenceNodes : 
      (sequenceNodes.length > 0 ? [sequenceNodes[0]] : []);
    
    // Process sequence nodes in horizontal order
    const sequentialGroups: ExperimentNode[][] = [];
    const visited = new Set<string>();
    
    const processSequenceChain = (startNodeId: string) => {
      let currentNodeId: string | null = startNodeId;
      
      while (currentNodeId) {
        if (visited.has(currentNodeId)) break;
        visited.add(currentNodeId);
        
        // Get the current sequence node
        const sequenceNode = nodeMap.get(currentNodeId);
        if (!sequenceNode) break;
        
        // Get all child nodes of this sequence node
        const childNodes = get().getSequenceChildNodes(currentNodeId);
        
        // Add this group to the sequential groups only if it has children
        if (childNodes.length > 0) {
          sequentialGroups.push(childNodes);
        }
        
        // Find the next sequence node in the chain
        let nextNodeId: string | null = null;
        
        if (sequenceAdjacencyList[currentNodeId]) {
          for (const targetId of sequenceAdjacencyList[currentNodeId]) {
            if (!visited.has(targetId)) {
              nextNodeId = targetId;
              break;
            }
          }
        }
        
        currentNodeId = nextNodeId;
      }
    };
    
    // Process each starting sequence node
    startingPoints.forEach(node => {
      if (!visited.has(node.id)) {
        processSequenceChain(node.id);
      }
    });
    
    // Handle any disconnected sequence nodes
    sequenceNodes.forEach(node => {
      if (!visited.has(node.id)) {
        const childNodes = get().getSequenceChildNodes(node.id);
        if (childNodes.length > 0) {
          sequentialGroups.push(childNodes);
        }
        visited.add(node.id);
      }
    });
    
    // Handle any nodes not connected to sequences
    const nonSequenceNodes = nodes.filter(node => 
      node.type !== 'sequence' && 
      !edges.some(edge => 
        edge.source === node.id && nodeMap.get(edge.target)?.type === 'sequence' ||
        edge.target === node.id && nodeMap.get(edge.source)?.type === 'sequence'
      )
    );
    
    if (nonSequenceNodes.length > 0) {
      nonSequenceNodes.forEach(node => {
        sequentialGroups.push([node]);
      });
    }
    
    return sequentialGroups;
  },

  handleStartExperiment: () => {
    set({ isRunning: true, currentRunningNodeIndex: 0 });
  },

  handleStopExperiment: () => {
    set({ isRunning: false, currentRunningNodeIndex: 0 });
  },

  handleNextNode: () => {
    set((state) => {
      const nodeGroups = get().getNodeGroups();
      const nextIndex = state.currentRunningNodeIndex + 1;
      if (nextIndex >= nodeGroups.length) {
        return { isRunning: false, currentRunningNodeIndex: 0 };
      }

      return { currentRunningNodeIndex: nextIndex };
    });
  },
  
  removeEdge: (edgeId: string) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },
}));
