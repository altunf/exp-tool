"use client"

import { Button } from "@/components/ui/button"
import type { ExperimentNode } from "@/types/node-types"
import { useEffect } from "react"

type NodeContentRendererProps = {
  node: ExperimentNode
  isPaused: boolean
  handleSkip: () => void
  getPositionStyle: (position: string) => React.CSSProperties
}

export function NodeContentRenderer({ node, isPaused, handleSkip, getPositionStyle }:NodeContentRendererProps) {
  if (!node) return null

  const nodeRenderers = {
    stimulus: () => (
      <div className={`absolute`} style={getPositionStyle(typeof node.data.position === 'string' ? node.data.position : "center")}>
        {typeof node.data.imageUrl === 'string' ? (
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

    sound: () => {

      useEffect(() => {
        if (!isPaused && typeof node.data.audioUrl === 'string') {
          const audio = new Audio(node.data.audioUrl);
          audio.play();
          
          return () => {
            audio.pause();
            audio.currentTime = 0;
          };
        }
      }, [node.data.audioUrl, isPaused]);
      
      return null;
    },

    instruction: () => {
      const position = typeof node.data.position === 'string' ? node.data.position : "center";
      const positionStyle = getPositionStyle(position);
      
      return (
        <div 
          className="absolute"
          style={positionStyle}
        >
          {typeof node.data.text === 'string' ? (
            <div 
              className="prose prose-sm max-w-xl"
              style={{ color: typeof node.data.textColor === 'string' ? node.data.textColor : "inherit" }}
              dangerouslySetInnerHTML={{ __html: node.data.text }}
            />
          ) : (
            <div className="text-gray-400">No instructions provided</div>
          )}
          
          {Boolean(node.data.showContinueButton) && (
            <Button 
              className="mt-4" 
              onClick={handleSkip}
            >
              Continue
            </Button>
          )}
        </div>
      );
    },

    response: () => (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl mb-4">Waiting for response...</div>
        <div className="text-lg mb-8">Response type: {typeof node.data.responseType === 'string' ? node.data.responseType : 'unknown'}</div>
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

  const renderer = nodeRenderers[node.type]
  return renderer ? renderer() : <div>Unknown node type</div>
}