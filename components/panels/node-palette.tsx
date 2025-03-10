"use client"

import type React from "react"

import { ImageIcon, MessageSquare, FileText, Music, Layers } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useFlowStore } from "@/store/use-flow-store"

export function NodePalette() {
  const { onDrop } = useFlowStore()

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium mb-2">Experiment Components</h3>

      <div className="space-y-2">
        <Card
          className="cursor-move hover:bg-blue-50"
          onDragStart={(event) => onDragStart(event, "stimulus")}
          draggable
        >
          <CardContent className="p-3 flex items-center gap-2">
            <ImageIcon size={16} />
            <span>Visual Stimulus</span>
          </CardContent>
        </Card>

        <Card
          className="cursor-move hover:bg-green-50"
          onDragStart={(event) => onDragStart(event, "response")}
          draggable
        >
          <CardContent className="p-3 flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Response Collection</span>
          </CardContent>
        </Card>

        <Card
          className="cursor-move hover:bg-purple-50"
          onDragStart={(event) => onDragStart(event, "instruction")}
          draggable
        >
          <CardContent className="p-3 flex items-center gap-2">
            <FileText size={16} />
            <span>Instructions</span>
          </CardContent>
        </Card>

        <Card className="cursor-move hover:bg-amber-50" onDragStart={(event) => onDragStart(event, "sound")} draggable>
          <CardContent className="p-3 flex items-center gap-2">
            <Music size={16} />
            <span>Sound Stimulus</span>
          </CardContent>
        </Card>

        <Card className="cursor-move hover:bg-gray-100" onDragStart={(event) => onDragStart(event, "group")} draggable>
          <CardContent className="p-3 flex items-center gap-2">
            <Layers size={16} />
            <span>Group</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

