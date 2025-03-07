import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import pb from "@/lib/pocketbase"
import { useWebstoryStore } from "@/stores/webstoryStore"
import type { WebstoryComponent } from "@/types/webstory"
import { Pencil, PlusCircle } from "lucide-react"
import type { RecordModel } from "pocketbase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type Webstory = RecordModel & {
  data: WebstoryComponent[]
  title: string
}

export default function HomePage() {
  const [webstories, setWebstories] = useState<Webstory[]>([])
  const [user, setUser] = useState<RecordModel | null>(null)
  const { setComponents } = useWebstoryStore()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWebstories = async () => {
      const currentUser = pb.authStore.model

      if (currentUser) {
        setUser(currentUser)
        const records = await pb.collection("webstories").getFullList<Webstory>({
          filter: `user = "${currentUser.id}"`,
        })

        setWebstories(records)
      }
    }
    fetchWebstories()
  }, [])

  const loadWebstory = (story: Webstory) => {
    setComponents(story.data)
    navigate(`/editor/${story.id}`)
  }

  const createNewWebstory = async () => {
    const currentUser = pb.authStore.model

    if (!currentUser) {
      alert("Please log in to create a new webstory.")
      return
    }

    try {
      const newWebstory = await pb.collection("webstories").create({
        user: currentUser.id,
        title: "New Webstory",
        content: JSON.stringify([
          {
            id: `${Date.now()}`,
            type: "header",
            backgroundColor: "#ffaaaa",
            order: 1,
            title: "Default Header",
            subtitle: "Subtitle",
            titleStyle: { fontSize: "20px", fontFamily: "Arial", color: "black", textAlign: "center" },
            subtitleStyle: { fontSize: "16px", fontFamily: "Arial", color: "gray", textAlign: "center" },
          },
        ]),
      })

      navigate(`/editor/${newWebstory.id}`)
    } catch (error) {
      console.error("Failed to create new webstory", error)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user?.avatar ? `${pb.baseUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}` : ""}
              alt="User avatar"
            />
            <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name || "Creator"}</h1>
            <p className="text-muted-foreground">Manage your webstories</p>
          </div>
        </div>
        <Button onClick={createNewWebstory} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Webstory
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {webstories.map((story) => (
          <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-primary/10 p-4">
              <CardTitle className="truncate text-lg">{story.title || "Untitled Webstory"}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 aspect-square flex items-center justify-center bg-muted/50">
              {/* Preview content could go here */}
              <div className="text-4xl text-muted-foreground">{story.title?.charAt(0) || "W"}</div>
            </CardContent>
            <CardFooter className="p-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadWebstory(story)}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}

        {webstories.length === 0 && (
          <Card className="col-span-full p-8 flex flex-col items-center justify-center gap-4 bg-muted/30">
            <div className="text-muted-foreground text-center">
              <p className="mb-2">You don't have any webstories yet.</p>
              <p>Create your first webstory to get started!</p>
            </div>
            <Button onClick={createNewWebstory} variant="default" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Webstory
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
