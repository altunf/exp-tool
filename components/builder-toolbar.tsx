import { Button } from "@/components/ui/button";
import { Save, Play, ArrowLeft, Settings, FileUp, FileJson } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useFlowStore } from "@/store/use-flow-store";
import RunButton  from "@/components/custom-components/RunButton";

interface BuilderToolbarProps {
  experimentName: string;
  setExperimentName: (name: string) => void;
  runnerBackgroundColor: string;
  setRunnerBackgroundColor: (color: string) => void;
}

export function BuilderToolbar({
  experimentName,
  setExperimentName,
  runnerBackgroundColor,
  setRunnerBackgroundColor,
}: BuilderToolbarProps) {
  const {
    saveExperiment,
    handleStartExperiment,
  } = useFlowStore();

  return (
    <div className="flex flex-row gap-2">
      <Button variant="outline" onClick={saveExperiment}>
        <Save className="mr-1 h-4 w-4" /> Save
      </Button>
      <Button variant="outline" asChild>
        <label htmlFor="load-experiment">
          <input
            id="load-experiment"
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const experimentData = JSON.parse(event.target?.result as string);
                    useFlowStore.setState(experimentData);
                    setExperimentName(experimentData.experimentName || "Loaded Experiment");
                  } catch (error) {
                    console.error("Error loading experiment:", error);
                    alert("Failed to load experiment file. Invalid format.");
                  }
                };
                reader.readAsText(file);
                e.target.value = ''; // Reset input
              }
            }}
          />
          <FileJson className="mr-1 h-4 w-4" /> Load File
        </label>
      </Button>
      <RunButton onClick={handleStartExperiment}/>
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
}