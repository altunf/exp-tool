"use client";

import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { NodePanelRenderer } from "./node-panel-renderer";

export function PropertyPanel({
  selectedNode,
  deleteNode,
  nodes,
  addNodeToGroup,
  removeNodeFromGroup,
  onClose,
}: any) {
  if (!selectedNode) return null;

  return (
    <div className="h-full flex flex-col bg-[#fafafa]">
      <div className="px-2 py-4 flex justify-between items-center">
        <h3 className="font-medium">Properties: {selectedNode.id}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:flex hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-4">
        <>
          <header className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">
                Selected{" "}
                {selectedNode.type.charAt(0).toUpperCase() +
                  selectedNode.type.slice(1)}{" "}
                Node
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={deleteNode}>
               Delete <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <>
            <NodePanelRenderer
              node={selectedNode}
              nodes={nodes}
              addNodeToGroup={addNodeToGroup}
              removeNodeFromGroup={removeNodeFromGroup}
            />
          </>
        </>
      </div>
    </div>
  );
}
