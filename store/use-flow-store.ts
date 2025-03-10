import { create } from "zustand"
import { addEdge, MarkerType, applyNodeChanges, applyEdgeChanges } from "@xyflow/react"

export const useFlowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeCounter: 0,
  reactFlowInstance: null,
  selectedNode: null,
  leftSidebarOpen: true,
  rightPanelOpen: false,

  // UI state setters
  setSelectedNode: (node) => set({ selectedNode: node, rightPanelOpen: !!node }),
  setLeftSidebarOpen: (open) => set({ leftSidebarOpen: open }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setReactFlowInstance: (instance) => set({ reactFlowInstance: instance }),

  // Flow operations
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }))
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }))
  },

  onConnect: (params) => {
    set((state) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#555" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#555",
        },
      }
      return { edges: addEdge(newEdge, state.edges) }
    })
  },

  onDragOver: (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  },

  onDrop: (event) => {
    event.preventDefault()

    const type = event.dataTransfer.getData("application/reactflow")
    if (typeof type === "undefined" || !type) {
      return
    }

    const { reactFlowInstance, nodeCounter } = get()
    if (!reactFlowInstance) return

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })

    const newNode = {
      id: `${type}-${nodeCounter}`,
      type,
      position,
      data: {
        order: nodeCounter,
      },
    }

    // Set default data based on node type
    if (type === "stimulus") {
      newNode.data = {
        ...newNode.data,
        imageUrl: "",
        duration: 1000,
        showFixationPoint: false,
        position: "center", // Default position
      }
    } else if (type === "response") {
      newNode.data = {
        ...newNode.data,
        responseType: "keyboard",
        timeout: 5000,
        correctResponse: "",
      }
    } else if (type === "instruction") {
      newNode.data = {
        ...newNode.data,
        text: "Instructions for the participant",
      }
    } else if (type === "sound") {
      newNode.data = {
        ...newNode.data,
        audioUrl: "",
        duration: 3000,
        delay: 0,
        volume: 80,
        loop: false,
      }
    } else if (type === "group") {
      newNode.data = {
        ...newNode.data,
        label: `Group ${nodeCounter}`,
        childNodes: [],
        duration: 1000,
      }
    }

    set((state) => ({
      nodes: [...state.nodes, newNode],
      nodeCounter: state.nodeCounter + 1,
    }))
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
          }
        }
        return node
      }),
    }))
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
      rightPanelOpen: state.selectedNode?.id === nodeId ? false : state.rightPanelOpen,
    }))
  },

  moveNode: (nodeId, direction) => {
    set((state) => {
      const index = state.nodes.findIndex((n) => n.id === nodeId)
      if (index === -1) return state

      const newNodes = [...state.nodes]
      const node = newNodes[index]

      if (direction === "up" && index > 0) {
        newNodes[index] = newNodes[index - 1]
        newNodes[index - 1] = node
      } else if (direction === "down" && index < newNodes.length - 1) {
        newNodes[index] = newNodes[index + 1]
        newNodes[index + 1] = node
      }

      return { nodes: newNodes }
    })
  },

  addNodeToGroup: (groupId, nodeToAdd) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === groupId) {
          return {
            ...node,
            data: {
              ...node.data,
              childNodes: [...node.data.childNodes, nodeToAdd],
            },
          }
        }
        return node
      }),
    }))
  },

  removeNodeFromGroup: (groupId, nodeIdToRemove) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === groupId) {
          return {
            ...node,
            data: {
              ...node.data,
              childNodes: node.data.childNodes.filter((childNode) => childNode.id !== nodeIdToRemove),
            },
          }
        }
        return node
      }),
    }))
  },

  handleFileUpload: (event, nodeId, fileType) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target.result
        get().updateNodeData(nodeId, {
          [`${fileType}Url`]: dataUrl,
          [`${fileType}Name`]: file.name,
          [`${fileType}Type`]: file.type,
        })
      }
      reader.readAsDataURL(file)
    }
  },

  handleStartExperiment: () => {
    console.log("Starting experiment...")
    // Implement experiment start logic
  },
}))

