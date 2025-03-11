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
import { Menu } from "lucide-react";
import { ExperimentRunner } from "@/components/experiment-runner";
import { BuilderToolbar } from "@/components/builder-toolbar";

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
    handleStopExperiment,
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
                  <BuilderToolbar 
                    experimentName={experimentName}
                    setExperimentName={setExperimentName}
                    runnerBackgroundColor={runnerBackgroundColor}
                    setRunnerBackgroundColor={setRunnerBackgroundColor}
                  />
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
            onClose={() => setRightPanelOpen(false)}
          />
        </div>
      )}
    </SidebarProvider>
  );
}
