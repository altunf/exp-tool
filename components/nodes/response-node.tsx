import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { Handle, Position } from "@xyflow/react"

export function ResponseNode({ data, id }:any) {
  return (
    <Card className="w-64 shadow-md">
    <Handle type="target" position={Position.Top} id="top" className="w-2 h-2 !bg-blue-500" />
    <Handle type="target" position={Position.Left} id="left" className="w-2 h-2 !bg-green-500" />
      <CardHeader className="bg-green-50 p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare size={16} />
          Response Collection
          <span className="text-xs text-gray-500 ml-auto">{id}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            <p>Type: {data.responseType}</p>
            <p>Timeout: {data.timeout}ms</p>
            <p>Correct response: {data.correctResponse || "None"}</p>
          </div>
        </div>
      </CardContent>   <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-green-500" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 !bg-blue-500" />
    </Card>
  )
}

