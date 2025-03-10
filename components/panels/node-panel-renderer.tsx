import { StimulusPanel } from "./stimulus-panel"
import { ResponsePanel } from "./response-panel"
import { InstructionPanel } from "./instruction-panel"
import { SoundPanel } from "./sound-panel"
import { GroupPanel } from "./group-panel"

// Map of node types to their panel components
const NODE_PANELS = {
  stimulus: StimulusPanel,
  response: ResponsePanel,
  instruction: InstructionPanel,
  sound: SoundPanel,
  group: GroupPanel,
}

export function NodePanelRenderer({ node, nodes, addNodeToGroup, removeNodeFromGroup }) {
  // Get the appropriate panel component for this node type
  const PanelComponent = NODE_PANELS[node.type]

  if (!PanelComponent) {
    return <p>No properties available for this node type.</p>
  }

  // Render the panel with appropriate props
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

  return <PanelComponent node={node} />
}

