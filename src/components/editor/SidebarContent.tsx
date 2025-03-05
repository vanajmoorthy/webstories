interface SidebarContentProps {
  children: React.ReactNode
  hidden: boolean
}

export function SidebarContent({ children, hidden }: SidebarContentProps) {
  return <div className={hidden ? "content-slide-out" : "content-slide-in"}>{children}</div>
}
