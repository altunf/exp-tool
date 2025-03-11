import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

export function GroupNode({ data, id }: any) {
  return (
    <Card
      className="shadow-md p-0"
      style={{ width: data.width || 300, height: data.height || 200 }}
    >
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
      <CardHeader className="bg-gray-100 p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers size={16} />
          Group: {data.label}
          <span className="text-xs text-gray-500 ml-auto">{id}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 h-full overflow-auto">
        <div className="space-y-2 h-full">
          <div className="text-xs text-gray-500">
            <p>Duration: {data.duration}ms</p>
          </div>

          {data.childNodes && data.childNodes.length > 0 && (
            <div className="mt-2 border-t pt-2 h-[calc(100%-40px)] overflow-auto">
              <p className="text-xs font-medium mb-1">Child Nodes:</p>
              <div className="space-y-1">
                {data.childNodes.map((node: any) => (
                  <div
                    key={node.id}
                    className="text-xs bg-gray-50 p-2 rounded flex items-center"
                  >
                    <span className="truncate">
                      {node.type.charAt(0).toUpperCase() + node.type.slice(1)}:{" "}
                      {node.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
