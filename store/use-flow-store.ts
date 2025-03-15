import { useCoreFlowStore } from "./use-core-flow-store";
import { useNodeActionsStore } from "./use-node-actions-store";
import { useExperimentActionsStore } from "./use-experiment-actions-store";
import type { FlowStore } from "@/types/store-types";

// This is a convenience function that combines all three stores
export const useFlowStore = (): FlowStore => {
  const coreStore = useCoreFlowStore();
  const nodeActions = useNodeActionsStore();
  const experimentActions = useExperimentActionsStore();

  return {
    ...coreStore,
    ...nodeActions,
    ...experimentActions,
  };
};