import { create } from "zustand";
import type { NodeActions } from "@/types/store-types";
import type { ExperimentNode, ExperimentNodeData } from "@/types/node-types";
import { useCoreFlowStore } from "./use-core-flow-store";

export const useNodeActionsStore = create<NodeActions>((set, get) => ({
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

    const coreStore = useCoreFlowStore.getState();
    const { reactFlowInstance, nodeCounter } = coreStore;
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
      case "loop":
        newNode.data = {
          ...newNode.data,
          label: `Loop ${nodeCounter}`,
          iterations: 3,
          isRandom: false,
          interStimulusInterval: 500,
          childNodes: [],
        } as ExperimentNodeData;
        break;
    }

    useCoreFlowStore.setState((state) => ({
      nodes: [...state.nodes, newNode],
      nodeCounter: state.nodeCounter + 1,
    }));
  },

  updateNodeData: (id, newData) => {
    useCoreFlowStore.setState((state) => ({
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
    useCoreFlowStore.setState((state) => ({
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
    const { nodes, edges, runnerBackgroundColor } = useCoreFlowStore.getState();
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

  removeEdge: (edgeId: string) => {
    useCoreFlowStore.setState((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },
}));