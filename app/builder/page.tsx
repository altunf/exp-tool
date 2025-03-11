"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useState, useEffect } from "react";
import { FlowCanvas } from "@/components/flow-canvas";
import { PropertyPanel } from "@/components/panels/property-panel";
import { useFlowStore } from "@/store/use-flow-store";
import { Button } from "@/components/ui/button";
import { Save, Play, ArrowLeft, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { ExperimentRunner } from "@/components/experiment-runner";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export default function BuilderPage() {
  const [experimentName, setExperimentName] = useState("New Experiment");
  const [mounted, setMounted] = useState(false);

  const {
    nodes,
    selectedNode,
    rightPanelOpen,
    isRunning,
    runnerBackgroundColor,
    setRunnerBackgroundColor,
    setRightPanelOpen,
    deleteNode,
    addNodeToGroup,
    removeNodeFromGroup,
    handleStartExperiment,
    handleStopExperiment,
    saveExperiment,
  } = useFlowStore();

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleDeleteSelectedNode = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
    }
  };

  if (isRunning) {
    return <ExperimentRunner onStop={handleStopExperiment} />;
  }

  const toolbar = (
    <div className="flex flex-row gap-2">
      <Button variant="outline" onClick={saveExperiment}>
        <Save className="mr-1 h-4 w-4" /> Save
      </Button>
      <Button onClick={handleStartExperiment}>
        <Play className="mr-1 h-4 w-4" color="green"/> Run
      </Button>
      <Button variant="outline" asChild>
        <Link href="/experiments">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Experiments
        </Link>
      </Button>
      {/* Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
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
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1">
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SidebarTrigger>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="flex-1">
              <BreadcrumbList >
                <BreadcrumbItem className="hidden md:block">
                  {experimentName}
                </BreadcrumbItem>
                <BreadcrumbItem className="hidden md:block ml-auto">
                  {toolbar}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {mounted && <FlowCanvas />}
        </div>
      </SidebarInset>
      {selectedNode && rightPanelOpen && (
        <div className="hidden md:block  bg-background w-80">
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
    </SidebarProvider>
  );
}
