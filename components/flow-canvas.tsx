"use client"

import type React from "react"

import { useRef, useCallback } from "react"
import { ReactFlow,Controls, MiniMap, Background, Panel, ReactFlowProvider } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Settings } from "lucide-react"
import { nodeTypes } from "./node-types"
import { useFlowStore } from "@/store/use-flow-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CustomEdge from "./custom-edge"

const edgeTypes = {
  custom: CustomEdge,
}

export function FlowCanvas() {
  const reactFlowWrapper = useRef(null)

  const {
    nodes,
    edges,
    leftSidebarOpen,
    runnerBackgroundColor,
    setRunnerBackgroundColor,
    setLeftSidebarOpen,
    setReactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
  } = useFlowStore()

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }, [])

  return (
    <div className="flex-1" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: "custom" }}
          connectionLineType="custom"
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          style={{ width: "100%", height: "100%" }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          connectOnClick={false}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />

          {/* Top Left Panel - Sidebar Toggle */}
          {leftSidebarOpen && (
            <Panel position="top-left">
              <Button
                variant="outline"
                size="icon"
                className="mt-2 ml-2 bg-white"
                onClick={() => setLeftSidebarOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Panel>
          )}

          {/* Top Right Panel - Settings */}
          <Panel position="top-right">
            <div className="bg-white p-2 rounded shadow-md mt-2 mr-2 flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" /> Settings
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Experiment Settings</h4>
                    <div className="space-y-2">
                      <Label htmlFor="bgColor">Runner Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bgColor"
                          type="color"
                          value={runnerBackgroundColor}
                          onChange={(e) => setRunnerBackgroundColor(e.target.value)}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={runnerBackgroundColor}
                          onChange={(e) => setRunnerBackgroundColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

