import { useLocation, Link } from "wouter"
import { BookOpen, CalendarDays, ChefHat, ShoppingBasket } from "lucide-react"

type TabKey = "recipes" | "kreator" | "planer" | "lista"

interface TabDef {
  key: TabKey
  href: string
  label: string
  Icon: typeof BookOpen
  match: (loc: string) => boolean
}

const TABS: TabDef[] = [
  { key: "recipes", href: "/",          label: "Moje przepisy",  Icon: BookOpen,        match: (l) => !l.startsWith("/planer") && !l.startsWith("/z-lodowki") && !l.startsWith("/lista") },
  { key: "kreator", href: "/z-lodowki", label: "Z lodówki",      Icon: ChefHat,         match: (l) => l.startsWith("/z-lodowki") },
  { key: "planer",  href: "/planer",    label: "Planer",         Icon: CalendarDays,    match: (l) => l.startsWith("/planer") },
  { key: "lista",   href: "/lista",     label: "Lista zakupów",  Icon: ShoppingBasket,  match: (l) => l.startsWith("/lista") },
]

export default function TopNav() {
  const [location] = useLocation()

  return (
    <nav style={{
      position: "fixed", top: 56, left: 0, right: 0, zIndex: 200,
      background: "#111c30",
      borderTop: "1px solid rgba(216,177,92,0.12)",
      borderBottom: "1px solid rgba(139,79,209,0.18)",
      display: "flex",
      height: 44,
    }}>
      {TABS.map(({ key, href, label, Icon, match }) => {
        const active = match(location)
        return (
          <Link
            key={key}
            href={href}
            onMouseEnter={(e) => {
              if (active) return
              ;(e.currentTarget as HTMLAnchorElement).style.background = "rgba(139,79,209,0.10)"
              ;(e.currentTarget as HTMLAnchorElement).style.color = "#f0e9d6"
            }}
            onMouseLeave={(e) => {
              if (active) return
              ;(e.currentTarget as HTMLAnchorElement).style.background = "transparent"
              ;(e.currentTarget as HTMLAnchorElement).style.color = "#cfc6b6"
            }}
            onFocus={(e) => {
              if (active) return
              ;(e.currentTarget as HTMLAnchorElement).style.background = "rgba(139,79,209,0.10)"
              ;(e.currentTarget as HTMLAnchorElement).style.color = "#f0e9d6"
            }}
            onBlur={(e) => {
              if (active) return
              ;(e.currentTarget as HTMLAnchorElement).style.background = "transparent"
              ;(e.currentTarget as HTMLAnchorElement).style.color = "#cfc6b6"
            }}
            style={{
              flex: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              color: active ? "#f0e9d6" : "#cfc6b6",
              fontSize: 13, fontWeight: active ? 600 : 400,
              letterSpacing: "0.03em",
              textDecoration: "none",
              background: active ? "rgba(139,79,209,0.18)" : "transparent",
              borderBottom: active ? "2px solid #8b4fd1" : "2px solid transparent",
              transition: "all 0.18s",
              minWidth: 0,
            }}
          >
            <Icon size={15} strokeWidth={active ? 2 : 1.5} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
