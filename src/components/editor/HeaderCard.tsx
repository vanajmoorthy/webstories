"use client"

import { Card, CardContent } from "@/components/ui/card"

export function HeaderCard({ onClick }: { onClick: () => void }) {
  return (
    <Card className="mt-2 cursor-pointer" onClick={onClick}>
      <CardContent className="p-3">
        <p>Header</p>
      </CardContent>
    </Card>
  )
}
