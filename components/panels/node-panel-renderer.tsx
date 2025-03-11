import { type ReactElement } from 'react'
import { type ExperimentNode } from "@/types/node-types"
import { StimulusPanel } from "./stimulus-panel"
import { ResponsePanel } from "./response-panel"
import { InstructionPanel } from "./instruction-panel"
import { SoundPanel } from "./sound-panel"
import { GroupPanel } from "./group-panel"

interface BasePanelProps {
  node: ExperimentNode;
}

interface GroupPanelProps extends BasePanelProps {
  nodes: ExperimentNode[];
  addNodeToGroup: (groupId: string, node: ExperimentNode) => void;
  removeNodeFromGroup: (groupId: string, nodeId: string) => void;
}

const NODE_PANELS = {
  "stimulus": StimulusPanel,
  "response": ResponsePanel,
  "instruction": InstructionPanel,
  "sound": SoundPanel,
  "group": GroupPanel,
} as const

export function NodePanelRenderer({ 
  node, 
  nodes, 
  addNodeToGroup, 
  removeNodeFromGroup 
}: GroupPanelProps): ReactElement {
  const PanelComponent = NODE_PANELS[node.type as keyof typeof NODE_PANELS]

  if (!PanelComponent) {
    return <p>No properties available for this node type.</p>
  }

  if (node.type === "group") {
    return (
      <PanelComponent
        node={node}
        nodes={nodes}
        addNodeToGroup={addNodeToGroup}
        removeNodeFromGroup={removeNodeFromGroup}
      />
    )
  }

  return <PanelComponent 
    node={node}
    nodes={nodes}
    addNodeToGroup={addNodeToGroup}
    removeNodeFromGroup={removeNodeFromGroup}
  />
}

