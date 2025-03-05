import { Card, CardContent } from "@/components/ui/card"

interface TextCardProps {
  onClick: () => void
}

export function TextCard({ onClick }: TextCardProps) {
  return (
    <Card className="mt-2 cursor-pointer" onClick={onClick}>
      <CardContent className="p-3">
        <p>Text Block</p>
      </CardContent>
    </Card>
  )
}
