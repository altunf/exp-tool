import { create } from "zustand";
import type { ExperimentActions } from "@/types/store-types";
import type { ExperimentNode } from "@/types/node-types";
import { useCoreFlowStore } from "./use-core-flow-store";

interface AdjacencyList {
  [key: string]: string[];
}

export const useExperimentActionsStore = create<ExperimentActions>((set, get) => ({
  getSequenceChildNodes: (sequenceId: string) => {
    const { nodes, edges } = useCoreFlowStore.getState();
    return nodes.filter((node) =>
      edges.some(
        (edge) =>
          edge.source === sequenceId &&
          edge.sourceHandle === "bottom" &&
          edge.target === node.id
      )
    );
  },

  getLoopChildNodes: (loopId: string) => {
    const { nodes, edges } = useCoreFlowStore.getState();
    return nodes.filter((node) =>
      edges.some(
        (edge) =>
          edge.source === loopId &&
          edge.sourceHandle === "bottom" &&
          edge.target === node.id
      )
    );
  },

  getNodeGroups: () => {
    const { nodes, edges } = useCoreFlowStore.getState();
    // Type assertion to avoid TypeScript error
    const sequenceNodes = nodes.filter(
      (node) => node.type === ("sequence" as ExperimentNode["type"])
    );
    const loopNodes = nodes.filter(
      (node) => node.type === ("loop" as ExperimentNode["type"])
    );

    if (sequenceNodes.length === 0 && loopNodes.length === 0) {
      return nodes.map((node) => [node]);
    }

    // Create a map for quick node lookup
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    // Create adjacency list for horizontal connections between sequence nodes
    const sequenceAdjacencyList: AdjacencyList = {};
    edges.forEach((edge) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      // Only consider horizontal connections between sequence nodes
      if (
        sourceNode?.type === ("sequence" as ExperimentNode["type"]) &&
        targetNode?.type === ("sequence" as ExperimentNode["type"]) &&
        (edge.sourceHandle === "right" || edge.targetHandle === "left")
      ) {
        if (!sequenceAdjacencyList[edge.source]) {
          sequenceAdjacencyList[edge.source] = [];
        }
        sequenceAdjacencyList[edge.source].push(edge.target);
      }
    });

    // Find starting sequence nodes
    const startSequenceNodes = sequenceNodes.filter(
      (node) =>
        !edges.some(
          (edge) =>
            edge.target === node.id &&
            nodeMap.get(edge.source)?.type ===
              ("sequence" as ExperimentNode["type"]) &&
            (edge.sourceHandle === "right" || edge.targetHandle === "left")
        )
    );

    const startingPoints =
      startSequenceNodes.length > 0
        ? startSequenceNodes
        : sequenceNodes.length > 0
        ? [sequenceNodes[0]]
        : [];

    // Process sequence nodes in horizontal order
    const sequentialGroups: ExperimentNode[][] = [];
    const visited = new Set<string>();
    
    // First, identify all nodes that are direct children of loops
    // so we can skip them in the regular sequence processing
    const loopChildrenIds = new Set<string>();
    loopNodes.forEach(loopNode => {
      const directChildNodes = get().getLoopChildNodes(loopNode.id);
      directChildNodes.forEach(node => {
        loopChildrenIds.add(node.id);
      });
    });

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
        // and the sequence is not a child of a loop
        if (childNodes.length > 0 && !loopChildrenIds.has(currentNodeId)) {
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
    startingPoints.forEach((node) => {
      if (!visited.has(node.id) && !loopChildrenIds.has(node.id)) {
        processSequenceChain(node.id);
      }
    });

    // Handle any disconnected sequence nodes
    sequenceNodes.forEach((node) => {
      if (!visited.has(node.id) && !loopChildrenIds.has(node.id)) {
        const childNodes = get().getSequenceChildNodes(node.id);
        if (childNodes.length > 0) {
          sequentialGroups.push(childNodes);
        }
        visited.add(node.id);
      }
    });

    // Handle loop nodes
    loopNodes.forEach((loopNode) => {
      // Get direct children of this loop
      const directChildNodes = get().getLoopChildNodes(loopNode.id);
      if (directChildNodes.length === 0) return;
      
      // Mark all direct children as visited
      directChildNodes.forEach(node => visited.add(node.id));
      
      // Create a flat array of all node groups that should be included in this loop
      const loopContent: ExperimentNode[][] = [];
      
      // Process direct child sequences
      const directChildSequences = directChildNodes.filter(
        node => node.type === "sequence" as any
      );
      
      // Process each direct child sequence
      directChildSequences.forEach(sequenceNode => {
        // Get children of this sequence
        const sequenceChildren = get().getSequenceChildNodes(sequenceNode.id);
        if (sequenceChildren.length > 0) {
          loopContent.push(sequenceChildren);
        }
      });
      
      // Add non-sequence direct children
      const nonSequenceChildren = directChildNodes.filter(
        node => node.type !== ("sequence" as ExperimentNode["type"])
      );
      
      if (nonSequenceChildren.length > 0) {
        loopContent.push(nonSequenceChildren);
      }
      
      // Process loop iterations
      if (loopContent.length > 0) {
        // Ensure iterations is at least 1
        const iterations = typeof loopNode.data.iterations === 'number' 
          ? Math.max(1, loopNode.data.iterations) 
          : 3;
        const isRandom = typeof loopNode.data.isRandom === 'boolean' 
          ? loopNode.data.isRandom 
          : false;
        
        // Create a complete iteration block
        const iterationBlock: ExperimentNode[][] = [];
        
        // For each iteration, add a copy of the loop content
        for (let i = 0; i < iterations; i++) {
          // Create a deep copy of the loop content for this iteration
          const iterationContent = JSON.parse(JSON.stringify(loopContent));
          
          // If random mode is enabled, shuffle the content
          if (isRandom) {
            iterationContent.sort(() => Math.random() - 0.5);
          }
          
          // Add this iteration's content to the iteration block
          iterationBlock.push(...iterationContent);
        }
        
        // Add the entire iteration block to the sequential groups
        sequentialGroups.push(...iterationBlock);
      }
    });

    // Handle any nodes not connected to sequences or loops
    const nonControlNodes = nodes.filter(
      (node) =>
        node.type !== ("sequence" as ExperimentNode["type"]) &&
        node.type !== ("loop" as ExperimentNode["type"]) &&
        !edges.some(
          (edge) =>
            (edge.source === node.id &&
              (nodeMap.get(edge.target)?.type === ("sequence" as ExperimentNode["type"]) ||
               nodeMap.get(edge.target)?.type === ("loop" as ExperimentNode["type"]))) ||
            (edge.target === node.id &&
              (nodeMap.get(edge.source)?.type === ("sequence" as ExperimentNode["type"]) ||
               nodeMap.get(edge.source)?.type === ("loop" as ExperimentNode["type"])))
        )
    );

    if (nonControlNodes.length > 0) {
      nonControlNodes.forEach((node) => {
        sequentialGroups.push([node]);
      });
    }

    return sequentialGroups;
  },

  handleStartExperiment: () => {
    useCoreFlowStore.setState({ isRunning: true, currentRunningNodeIndex: 0 });
  },

  handleStopExperiment: () => {
    useCoreFlowStore.setState({ isRunning: false, currentRunningNodeIndex: 0 });
  },

  handleNextNode: () => {
    const nodeGroups = get().getNodeGroups();
    useCoreFlowStore.setState((state) => {
      const nextIndex = state.currentRunningNodeIndex + 1;
      if (nextIndex >= nodeGroups.length) {
        return { isRunning: false, currentRunningNodeIndex: 0 };
      }

      return { currentRunningNodeIndex: nextIndex };
    });
  },
}));