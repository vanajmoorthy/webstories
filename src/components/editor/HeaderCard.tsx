import { Card, CardContent } from "@/components/ui/card"

interface HeaderCardProps {
  onClick: () => void
}

export function HeaderCard({ onClick }: HeaderCardProps) {
  return (
    <Card className="mt-2 cursor-pointer" onClick={onClick}>
      <CardContent className="p-3">
        <p>Header</p>
      </CardContent>
    </Card>
  )
}
