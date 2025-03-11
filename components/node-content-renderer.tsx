"use client"

import { Button } from "@/components/ui/button"
import type { ExperimentNode } from "@/types/node-types"

type NodeContentRendererProps = {
  node: ExperimentNode
  isPaused: boolean
  handleSkip: () => void
  getPositionStyle: (position: string) => React.CSSProperties
}

export function NodeContentRenderer({ node, isPaused, handleSkip, getPositionStyle }: NodeContentRendererProps) {
  if (!node) return null

  const nodeRenderers = {
    stimulus: () => (
      <div className={`absolute`} style={getPositionStyle(node.data.position || "center")}>
        {node.data.imageUrl ? (
          <div className="relative">
            <img
              src={node.data.imageUrl || "/placeholder.svg"}
              alt="Visual Stimulus"
              className="max-h-64 max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="text-gray-400">No image available</div>
        )}
      </div>
    ),

    sound: () => (
      <div className={`flex flex-col items-center justify-center h-64`}>
        <div className="text-xl mb-4">🔊 Sound Stimulus</div>
        {node.data.audioUrl ? (
          <audio
            src={node.data.audioUrl}
            autoPlay={!isPaused}
            loop={node.data.loop}
            controls
            style={{ width: "80%" }}
          />
        ) : (
          <div className="text-gray-400">No audio available</div>
        )}
      </div>
    ),

    instruction: () => (
      <div className={`flex flex-col items-center justify-center h-64`}>
        <div className="text-lg mb-4 max-w-lg text-center" style={{ color: node.data.textColor || "inherit" }}>
          {node.data.text || "No instructions provided"}
        </div>
        {node.data.showContinueButton && (
          <Button onClick={handleSkip} className="mt-4">
            Continue
          </Button>
        )}
      </div>
    ),

    response: () => (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl mb-4">Waiting for response...</div>
        <div className="text-lg mb-8">Response type: {node.data.responseType}</div>
        <div className="flex gap-4">
          {node.data.responseType === "button" && (
            <>
              <Button onClick={handleSkip}>Yes</Button>
              <Button variant="outline" onClick={handleSkip}>
                No
              </Button>
            </>
          )}
          {node.data.responseType !== "button" && (
            <div className="text-gray-500">
              {node.data.responseType === "keyboard" ? "Press any key to continue" : "Click anywhere to continue"}
            </div>
          )}
        </div>
      </div>
    ),

  }

  // Use the renderer from the map or return default content
  const renderer = nodeRenderers[node.type]
  return renderer ? renderer() : <div>Unknown node type</div>
}