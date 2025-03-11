import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExperimentsPage() {
  const experiments = [
    { id: 1, title: "Visual Perception Test", updatedAt: "2023-05-15" },
    { id: 2, title: "Auditory Response Time", updatedAt: "2023-06-22" },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Experiments</h1>
        <Button asChild>
          <Link href="/builder">Create New</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((experiment) => (
          <Card key={experiment.id}>
            <CardHeader>
              <CardTitle>{experiment.title}</CardTitle>
              <CardDescription>Last updated: {experiment.updatedAt}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Click to edit or run this experiment.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/builder?id=${experiment.id}`}>Edit</Link>
              </Button>
              <Button asChild>
                <Link href={`/runner?id=${experiment.id}`}>Run</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

