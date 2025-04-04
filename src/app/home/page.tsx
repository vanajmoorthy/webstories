import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import pb from "@/lib/pocketbase"
import { useWebstoryStore } from "@/stores/webstoryStore"
import type { WebstoryComponent } from "@/types/webstory"
import { Pencil, PlusCircle } from "lucide-react"
import type { RecordModel } from "pocketbase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type Webstory = RecordModel & {
  content: string // Changed from 'data' to 'content'
  title: string
  pageBackgroundColor?: string
}

export default function HomePage() {
  const [webstories, setWebstories] = useState<Webstory[]>([])
  const [user, setUser] = useState<RecordModel | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStoryTitle, setNewStoryTitle] = useState("New Webstory")
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#ffffff")
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("#ffaaaa")
  const [syncColors, setSyncColors] = useState(true)
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

  // When page color changes and sync is enabled, update header color
  useEffect(() => {
    if (syncColors) {
      setHeaderBackgroundColor(pageBackgroundColor)
    }
  }, [pageBackgroundColor, syncColors])

  const loadWebstory = (story: Webstory) => {
    // Parse components from content field
    const components = typeof story.content === "string" ? JSON.parse(story.content) : story.content
    setComponents(components)
    navigate(`/editor/${story.id}`)
  }

  const handleCreateClick = () => {
    setIsModalOpen(true)
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
        title: newStoryTitle,
        pageBackgroundColor: pageBackgroundColor,
        content: JSON.stringify([
          {
            id: `${Date.now()}`,
            type: "header",
            backgroundColor: headerBackgroundColor,
            order: 1,
            title: "Default Header",
            subtitle: "Subtitle",
            titleStyle: { fontSize: "20px", fontFamily: "Arial", color: "black", textAlign: "center" },
            subtitleStyle: { fontSize: "16px", fontFamily: "Arial", color: "gray", textAlign: "center" },
          },
        ]),
      })

      setIsModalOpen(false)
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
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
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
            <CardContent
              className="p-6 aspect-square flex items-center justify-center"
              style={{ backgroundColor: story.pageBackgroundColor || "#ffffff" }}
            >
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
            <Button onClick={handleCreateClick} variant="default" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Webstory
            </Button>
          </Card>
        )}
      </div>

      {/* New Webstory Creation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Webstory</DialogTitle>
            <DialogDescription>Enter a name for your webstory and choose background colors.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newStoryTitle}
                onChange={(e) => setNewStoryTitle(e.target.value)}
                className="col-span-3"
                placeholder="My Awesome Webstory"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pageColor" className="text-right">
                Page Background
              </Label>
              <div className="col-span-3 flex items-center gap-3">
                <Input
                  id="pageColor"
                  type="color"
                  value={pageBackgroundColor}
                  onChange={(e) => setPageBackgroundColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <div
                  className="flex-1 h-10 rounded-md border flex items-center px-3"
                  style={{ backgroundColor: pageBackgroundColor }}
                >
                  <span className="text-sm font-mono">{pageBackgroundColor}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="syncColors" className="mr-2">
                  Sync colors
                </Label>
              </div>
              <div className="col-span-3">
                <Checkbox
                  id="syncColors"
                  checked={syncColors}
                  onCheckedChange={(checked) => setSyncColors(checked === true)}
                />
                <span className="ml-2 text-sm text-muted-foreground">Use the same color for header and page</span>
              </div>
            </div>

            {!syncColors && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="headerColor" className="text-right">
                  Header Background
                </Label>
                <div className="col-span-3 flex items-center gap-3">
                  <Input
                    id="headerColor"
                    type="color"
                    value={headerBackgroundColor}
                    onChange={(e) => setHeaderBackgroundColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <div
                    className="flex-1 h-10 rounded-md border flex items-center px-3"
                    style={{ backgroundColor: headerBackgroundColor }}
                  >
                    <span className="text-sm font-mono">{headerBackgroundColor}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createNewWebstory}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
