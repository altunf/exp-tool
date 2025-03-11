import { create } from "zustand";
import {
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
} from "@xyflow/react";
import type { FlowStore } from "@/types/store-types";
import type { ExperimentNode, ExperimentNodeData } from "@/types/node-types";

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: [],
  edges: [],
  nodeCounter: 0,
  reactFlowInstance: null,
  selectedNode: null,
  leftSidebarOpen: true,
  rightPanelOpen: false,
  isRunning: false,
  currentRunningNodeIndex: 0,
  runnerBackgroundColor: "#000000",

  setSelectedNode: (node) =>
    set({ selectedNode: node, rightPanelOpen: !!node }),
  setLeftSidebarOpen: (open) => set({ leftSidebarOpen: open }),
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

  addNodeToGroup: (groupId, nodeToAdd) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === groupId && node.type === "group") {
          return {
            ...node,
            data: {
              ...node.data,
              childNodes: [
                ...(node.data.childNodes as ExperimentNode[]),
                nodeToAdd,
              ],
            },
          };
        }
        return node;
      }),
    }));
  },

  removeNodeFromGroup: (groupId, nodeIdToRemove) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === groupId && node.type === "group") {
          return {
            ...node,
            data: {
              ...node.data,
              childNodes: (node.data.childNodes as ExperimentNode[]).filter(
                (childNode) => childNode.id !== nodeIdToRemove
              ),
            },
          };
        }
        return node;
      }),
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

  getOrderedNodes: () => {
    const { nodes, edges } = get();
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const visited = new Set<string>();
    const orderedNodes: ExperimentNode[] = [];

    const startNodes = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.id)
    );

    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (node) orderedNodes.push(node);

      const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
      outgoingEdges.forEach((edge) => {
        dfs(edge.target);
      });
    };

    startNodes.forEach((node) => {
      dfs(node.id);
    });

    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        orderedNodes.push(node);
      }
    });

    return orderedNodes;
  },

  getParallelNodes: (currentNodeId: string) => {
    const { nodes, edges } = get();
    const parallelNodes: ExperimentNode[] = [];

    // Aynı kaynaktan gelen edge'leri bul
    const incomingEdges = edges.filter((edge) => edge.target === currentNodeId);
    incomingEdges.forEach((incomingEdge) => {
      const siblingEdges = edges.filter(
        (edge) =>
          edge.source === incomingEdge.source && edge.target !== currentNodeId
      );
      siblingEdges.forEach((siblingEdge) => {
        const siblingNode = nodes.find(
          (node) => node.id === siblingEdge.target
        );
        if (
          siblingNode &&
          !parallelNodes.some((node) => node.id === siblingNode.id)
        ) {
          parallelNodes.push(siblingNode);
        }
      });
    });

    // Aynı hedefe giden edge'leri bul
    const outgoingEdges = edges.filter((edge) => edge.source === currentNodeId);
    outgoingEdges.forEach((outgoingEdge) => {
      const siblingEdges = edges.filter(
        (edge) =>
          edge.target === outgoingEdge.target && edge.source !== currentNodeId
      );
      siblingEdges.forEach((siblingEdge) => {
        const siblingNode = nodes.find(
          (node) => node.id === siblingEdge.source
        );
        if (
          siblingNode &&
          !parallelNodes.some((node) => node.id === siblingNode.id)
        ) {
          parallelNodes.push(siblingNode);
        }
      });
    });

    return parallelNodes;
  },

  getNodeGroups: () => {
    const { nodes, edges } = get();
    
    // Find starting nodes (nodes with no incoming edges)
    const startNodes = nodes.filter(node => 
      !edges.some(edge => edge.target === node.id)
    );
    
    if (startNodes.length === 0 && nodes.length > 0) {
      // If no starting nodes but we have nodes, just use the first node
      return [[nodes[0]]];
    }
    
    // Create a map for quick node lookup
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    
    // Create adjacency list for the graph
    const adjacencyList = {};
    edges.forEach(edge => {
      if (!adjacencyList[edge.source]) {
        adjacencyList[edge.source] = [];
      }
      adjacencyList[edge.source].push(edge.target);
    });
    
    // Function to check if connection is vertical (one node above/below another)
    const isVerticalConnection = (sourceNode, targetNode) => {
      // Check if nodes are roughly aligned vertically (similar X, different Y)
      const xDiff = Math.abs(sourceNode.position.x - targetNode.position.x);
      const yDiff = Math.abs(sourceNode.position.y - targetNode.position.y);
      
      // If X positions are similar (nodes are aligned vertically)
      return xDiff < 100 && yDiff > 50;
    };
    
    // Process the graph to create sequential groups
    const sequentialGroups = [];
    const visited = new Set();
    
    // Process a node and its vertical connections as a group
    const processNodeGroup = (nodeId) => {
      if (visited.has(nodeId)) return null;
      
      const currentNode = nodeMap.get(nodeId);
      if (!currentNode) return null;
      
      // Mark this node as visited
      visited.add(nodeId);
      
      // This group will contain the current node and all its vertical connections
      const group = [currentNode];
      
      // Find all vertically connected nodes (should run simultaneously)
      const findVerticalConnections = (id) => {
        if (!adjacencyList[id]) return;
        
        adjacencyList[id].forEach(targetId => {
          if (visited.has(targetId)) return;
          
          const targetNode = nodeMap.get(targetId);
          if (!targetNode) return;
          
          // If vertically connected, add to current group
          if (isVerticalConnection(nodeMap.get(id), targetNode)) {
            group.push(targetNode);
            visited.add(targetId);
            // Continue finding vertical connections from this node
            findVerticalConnections(targetId);
          }
        });
      };
      
      // Find all vertical connections
      findVerticalConnections(nodeId);
      
      return group.length > 0 ? group : null;
    };
    
    // Process nodes in horizontal sequence
    const processHorizontalSequence = (startNodeId) => {
      let currentNodeId = startNodeId;
      
      while (currentNodeId) {
        // Process this node and its vertical connections as a group
        const group = processNodeGroup(currentNodeId);
        if (group) {
          sequentialGroups.push(group);
        }
        
        // Find the next horizontal node
        let nextNodeId = null;
        
        if (adjacencyList[currentNodeId]) {
          // Look for any unvisited connection
          for (const targetId of adjacencyList[currentNodeId]) {
            if (!visited.has(targetId)) {
              nextNodeId = targetId;
              break;
            }
          }
        }
        
        currentNodeId = nextNodeId;
      }
    };
    
    // Start processing from each start node
    startNodes.forEach(node => {
      if (!visited.has(node.id)) {
        processHorizontalSequence(node.id);
      }
    });
    
    // Handle any disconnected nodes
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        sequentialGroups.push([node]);
        visited.add(node.id);
      }
    });
    
    
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
}));
