export type WebstoryComponent = TextComponent | TimelineComponent | HeaderComponent

type BaseComponent = {
  id: string
  type: "text" | "timeline" | "header"
  backgroundColor: string
  order: number
}

export type TextComponent = BaseComponent & {
  type: "text"
  content: string
  fontSize: string
  fontFamily: string
  italic: boolean
  bold: boolean
  underline: boolean
  alignment: "left" | "center" | "right"
  backgroundColor: string
}

export type TimelineComponent = BaseComponent & {
  type: "timeline"
  rows: TimelineRow[]
  itemsPerRow: number
}

type TimelineRow = {
  id: string
  items: TimelineItem[]
}

type TimelineItem = {
  id: string
  imageUrl: string
  caption: string
  captionStyle: {
    fontSize: string
    color: string
  }
}

export type HeaderComponent = BaseComponent & {
  type: "header"
  title: string
  subtitle: string
  titleStyle: {
    fontSize: string
    fontFamily: string
    color: string
    textAlign: "left" | "right" | "center"
    bold: boolean
    italic: boolean
    underline: boolean
  }
  subtitleStyle: {
    fontSize: string
    fontFamily: string
    color: string
    textAlign: "left" | "right" | "center"
    bold: boolean
    italic: boolean
    underline: boolean
  }
}
