"use client"

import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NodePanelRenderer } from "./node-panel-renderer"

export function PropertyPanel({ selectedNode, deleteNode, nodes, addNodeToGroup, removeNodeFromGroup, onClose }) {
  if (!selectedNode) return null

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Properties: {selectedNode.id}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:flex hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">
                {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)} Node
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={deleteNode}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <NodePanelRenderer
              node={selectedNode}
              nodes={nodes}
              addNodeToGroup={addNodeToGroup}
              removeNodeFromGroup={removeNodeFromGroup}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

