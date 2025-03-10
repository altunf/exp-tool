"use client"

import { useState, useEffect } from "react"
import { FlowCanvas } from "@/components/flow-canvas"
import { NodePalette } from "@/components/panels/node-palette"
import { PropertyPanel } from "@/components/panels/property-panel"
import { useFlowStore } from "@/store/use-flow-store"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Save, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ExperimentRunner } from "@/components/experiment-runner"

export default function BuilderPage() {
  const [experimentName, setExperimentName] = useState("New Experiment")
  const [mounted, setMounted] = useState(false)

  const {
    nodes,
    selectedNode,
    leftSidebarOpen,
    rightPanelOpen,
    isRunning,
    setSelectedNode,
    setLeftSidebarOpen,
    setRightPanelOpen,
    deleteNode,
    addNodeToGroup,
    removeNodeFromGroup,
    handleStartExperiment,
    handleStopExperiment,
    saveExperiment,
  } = useFlowStore()

  // Only render the FlowCanvas after the component has mounted
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleNodeClick = (event, node) => {
    setSelectedNode(node)
  }

  const handleDeleteSelectedNode = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id)
    }
  }

  if (isRunning) {
    return <ExperimentRunner onStop={handleStopExperiment} />
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{experimentName}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveExperiment}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button onClick={handleStartExperiment}>
            <Play className="mr-2 h-4 w-4" /> Run
          </Button>
          <Button variant="outline" asChild>
            <Link href="/experiments">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Experiments
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="absolute top-4 left-4 z-10">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <NodePalette />
            </SheetContent>
          </Sheet>
        </div>

        {/* Left Sidebar - Desktop */}
        <div
          className={`hidden md:block border-r bg-background transition-all ${
            leftSidebarOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <NodePalette />
        </div>

        {/* Main Content */}
        {mounted && <FlowCanvas />}

        {/* Right Panel - Mobile */}
        <div className="md:hidden">
          {selectedNode && (
            <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}>
              <SheetContent side="right" className="w-80 p-0">
                <PropertyPanel
                  selectedNode={selectedNode}
                  deleteNode={handleDeleteSelectedNode}
                  nodes={nodes}
                  addNodeToGroup={addNodeToGroup}
                  removeNodeFromGroup={removeNodeFromGroup}
                  onClose={() => setRightPanelOpen(false)}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Right Panel - Desktop */}
        {selectedNode && rightPanelOpen && (
          <div className="hidden md:block border-l bg-background w-80">
            <PropertyPanel
              selectedNode={selectedNode}
              deleteNode={handleDeleteSelectedNode}
              nodes={nodes}
              addNodeToGroup={addNodeToGroup}
              removeNodeFromGroup={removeNodeFromGroup}
              onClose={() => setRightPanelOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

