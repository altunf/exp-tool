import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music } from "lucide-react"
import { Handle, Position } from "@xyflow/react"

export function SoundNode({ data, id }:any) {
  return (
    <Card className="w-64 shadow-md p-0 overflow-hidden">
      <Handle type="target" position={Position.Top} id="top" className="w-2 h-2 !bg-blue-500" />
      <Handle type="target" position={Position.Left} id="left" className="w-2 h-2 !bg-green-500" />
      <CardHeader className="bg-amber-100 p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Music size={16} />
          Sound Stimulus
          <span className="text-xs text-gray-500 ml-auto">{id}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-center p-2 bg-gray-100 rounded-md">
            <audio controls className="w-full h-8">
              {data.audioUrl && <source src={data.audioUrl} type={data.audioType} />}
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="text-xs text-gray-500">
            <p>Duration: {data.duration}ms</p>
            <p>Delay: {data.delay || 0}ms</p>
            <p>Volume: {data.volume}%</p>
            {data.loop && <p>Loop: Enabled</p>}
          </div>
        </div>
      </CardContent>
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-green-500" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 !bg-blue-500" />
    </Card>
  )
}

