import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { useFlowStore } from "@/store/use-flow-store";

export function InstructionNode({ data, id }: any) {
  const {runnerBackgroundColor} = useFlowStore()
  return (
    <Card className="w-64 shadow-md p-0 overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-2 h-2 !bg-blue-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2 !bg-green-500"
      />
      <CardHeader className="bg-purple-100 p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText size={16} />
          Instructions
          <span className="text-xs text-gray-500 ml-auto">{id}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3"
        style={{ backgroundColor: runnerBackgroundColor }}>
        <div className="space-y-2">
          <div
            className="text-xs"
            style={{ color: data.textColor || "inherit" }}
          >
            {data.text ? (
              <div 
                className="line-clamp-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            ) : (
              <p className="text-gray-400">No instructions set</p>
            )}
          </div>
        </div>
      </CardContent>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2 h-2 !bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-2 h-2 !bg-blue-500"
      />
    </Card>
  );
}
