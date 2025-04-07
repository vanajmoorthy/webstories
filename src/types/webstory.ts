export type WebstoryComponent = TextComponent | PhotoTimelineComponent | HeaderComponent

type BaseComponent = {
  id: string
  type: "text" | "header" | "photoTimeline"
  backgroundColor: string
  order: number
}

export type HeaderComponent = BaseComponent & {
  type: "header"
  title: string
  subtitle: string
  height: string
  verticalAlignment: "top" | "center" | "bottom"
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

export type TextComponent = BaseComponent & {
  type: "text"
  content: string
  fontSize: string
  fontFamily: string
  italic: boolean
  bold: boolean
  underline: boolean
  alignment: "left" | "center" | "right"
  height: string
  verticalAlignment: "top" | "center" | "bottom"
}

export type TimelinePhoto = {
  id: string
  url: string
  caption?: string
}

export type TimelineRow = {
  id: string
  photos: TimelinePhoto[]
  date: string | Date
  text: string
}

export type PhotoTimelineComponent = BaseComponent & {
  type: "photoTimeline"
  alignment: "left" | "right" | "alternate"
  rows: TimelineRow[]
  photoSize: "small" | "medium" | "large"
}
