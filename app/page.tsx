import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Experiment Builder</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        Create and run psychological experiments with an intuitive drag-and-drop interface.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/builder">Create New Experiment</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/experiments">My Experiments</Link>
        </Button>
      </div>
    </div>
  )
}

