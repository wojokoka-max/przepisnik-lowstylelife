import { useState, useRef, useEffect } from "react"

type CatKey =
  | "warzywa" | "owoce" | "nabial" | "mieso"
  | "piekarnia" | "napoje" | "suche" | "inne"

const CATS: Record<CatKey, { emoji: string; label: string }> = {
  warzywa:   { emoji: "🥦", label: "Warzywa" },
  owoce:     { emoji: "🍓", label: "Owoce" },
  nabial:    { emoji: "🥛", label: "Nabiał" },
  mieso:     { emoji: "🥩", label: "Mięso" },
  piekarnia: { emoji: "🍞", label: "Piekarnia" },
  napoje:    { emoji: "🧃", label: "Napoje" },
  suche:     { emoji: "🫙", label: "Sypkie i puszki" },
  inne:      { emoji: "✨", label: "Inne" },
}

const CAT_KEYS = Object.keys(CATS) as CatKey[]

const DAYS   = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"]
const MONTHS = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"]

type Filter = "all" | "active" | "done"

interface ShopItem {
  id: number
  name: string
  qty: string
  cat: CatKey
  done: boolean
}

const STORAGE_KEY = "pp-lista-zakupow"

function loadItems(): ShopItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (i): i is ShopItem =>
          i && Number.isFinite(i.id) && typeof i.name === "string" && i.cat in CATS,
      )
      .map(i => ({
        id: i.id,
        name: i.name,
        qty: typeof i.qty === "string" ? i.qty : "",
        cat: i.cat,
        done: i.done === true,
      }))
  } catch {
    return []
  }
}

export default function Lista() {
  const [items, setItems]     = useState<ShopItem[]>(loadItems)
  const [name, setName]       = useState("")
  const [qty, setQty]         = useState("")
  const [cat, setCat]         = useState<CatKey>("warzywa")
  const [filter, setFilter]   = useState<Filter>("all")
  const [vanishing, setVanishing] = useState<Set<number>>(new Set())
  const nameRef   = useRef<HTMLInputElement>(null)
  const idRef     = useRef<number>(
    Math.max(0, ...loadItems().map(i => i.id)) + 1,
  )

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items])

  const uid = () => idRef.current++

  const now = new Date()
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`

  const total     = items.length
  const doneCount = items.filter(i => i.done).length
  const leftCount = total - doneCount

  function addItem() {
    if (!name.trim()) { nameRef.current?.focus(); return }
    setItems(prev => [...prev, { id: uid(), name: name.trim(), qty: qty.trim(), cat, done: false }])
    setName("")
    setQty("")
    nameRef.current?.focus()
    if (filter === "done") setFilter("all")
  }

  function toggleItem(id: number) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, done: !i.done } : i)))
  }

  function deleteItem(id: number) {
    setVanishing(prev => new Set([...prev, id]))
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id))
      setVanishing(prev => { const set = new Set(prev); set.delete(id); return set })
    }, 420)
  }

  function clearDone() {
    const doneIds = items.filter(i => i.done).map(i => i.id)
    setVanishing(new Set(doneIds))
    setTimeout(() => {
      setItems(prev => prev.filter(i => !i.done))
      setVanishing(new Set())
    }, 420)
  }

  const visible = items.filter(i => {
    if (filter === "active") return !i.done
    if (filter === "done") return i.done
    return true
  })

  const groups: Partial<Record<CatKey, ShopItem[]>> = {}
  visible.forEach(item => {
    ;(groups[item.cat] ??= []).push(item)
  })

  return (
    <div style={s.body}>
      <div style={s.app}>

        {/* HEADER */}
        <div style={s.header}>
          <div style={s.eyebrow}>twoja</div>
          <div style={s.h1}>Lista<br /><em style={s.h1em}>Zakupów</em></div>
          <div style={s.dateLine}>{dateStr}</div>
        </div>

        {/* STATS */}
        <div style={s.stats}>
          {([["total", total, "produktów"], ["left", leftCount, "zostało"], ["done", doneCount, "gotowe"]] as const).map(([k, n, lbl]) => (
            <div key={k} style={s.statPill}>
              <div style={s.statNum}>{n}</div>
              <div style={s.statLabel}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* ADD FORM */}
        <div style={s.addForm}>
          <div style={s.addRow}>
            <input
              ref={nameRef}
              className="lista-input"
              style={s.input}
              type="text"
              placeholder="Co kupić?"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addItem()}
              autoComplete="off"
            />
            <input
              className="lista-input"
              style={{ ...s.input, width: 72, textAlign: "center", flexShrink: 0 }}
              type="text"
              placeholder="szt."
              value={qty}
              onChange={e => setQty(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addItem()}
              autoComplete="off"
            />
          </div>
          <div style={s.addRow}>
            <select className="lista-select" style={s.select} value={cat} onChange={e => setCat(e.target.value as CatKey)}>
              {CAT_KEYS.map(k => (
                <option key={k} value={k}>{CATS[k].emoji} {CATS[k].label}</option>
              ))}
            </select>
            <button
              style={s.addBtn}
              onClick={addItem}
              onMouseEnter={e => (e.currentTarget.style.background = "#7a3fc0")}
              onMouseLeave={e => (e.currentTarget.style.background = "#8b4fd1")}
            >+ Dodaj</button>
          </div>
        </div>

        {/* FILTER TABS */}
        <div style={s.tabs}>
          {([["all", "Wszystko"], ["active", "Do kupienia"], ["done", "Gotowe"]] as const).map(([f, lbl]) => (
            <button
              key={f}
              style={filter === f ? s.tabActive : s.tab}
              onClick={() => setFilter(f)}
            >{lbl}</button>
          ))}
        </div>

        {/* LIST */}
        {visible.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>🌿</div>
            <div style={s.emptyTitle}>
              {filter === "done" ? "Nic tu nie ma" : "Lista jest pusta"}
            </div>
            <div style={s.emptySub}>
              {filter === "done" ? "Może to i dobrze — odpocznij chwilę." : "Dodaj pierwszy produkt powyżej."}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {CAT_KEYS.map(catKey => {
              const group = groups[catKey]
              if (!group) return null
              return (
                <div key={catKey} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={s.sectionLabel}>{CATS[catKey].emoji} {CATS[catKey].label}</div>
                  {group.map(item => (
                    <Item
                      key={item.id}
                      item={item}
                      vanishing={vanishing.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                      onDelete={() => deleteItem(item.id)}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        )}

        {/* CLEAR DONE */}
        {doneCount > 0 && (
          <div style={{ textAlign: "center" }}>
            <button
              style={s.clearBtn}
              onClick={clearDone}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0788a"; e.currentTarget.style.color = "#c0788a" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e3d9c4"; e.currentTarget.style.color = "#9a8e78" }}
            >Usuń gotowe produkty</button>
          </div>
        )}

        <div style={s.deco}>𖦹 𖦹 𖦹</div>
      </div>

      <style>{`
        .lista-input::placeholder { color: #b9aa8c; }
        .lista-input:focus, .lista-select:focus { outline: none; border-color: #8b4fd1 !important; }
      `}</style>
    </div>
  )
}

function Item({
  item, vanishing, onToggle, onDelete,
}: {
  item: ShopItem
  vanishing: boolean
  onToggle: () => void
  onDelete: () => void
}) {
  const cat = CATS[item.cat]

  return (
    <div style={{
      ...s.item,
      ...(item.done ? s.itemDone : {}),
      ...(vanishing ? s.itemVanish : {}),
    }}>
      <button
        style={{ ...s.checkBtn, ...(item.done ? s.checkBtnDone : {}) }}
        onClick={onToggle}
        aria-label={item.done ? "Odznacz" : "Odhacz"}
      >✓</button>
      <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{cat.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...s.itemName, ...(item.done ? s.itemNameDone : {}) }}>
          {item.name}
          {item.done && <span style={s.strikeBar} />}
        </div>
        {item.qty && <div style={s.itemQty}>{item.qty}</div>}
      </div>
      <button
        style={s.delBtn}
        onClick={onDelete}
        aria-label="Usuń"
        onMouseEnter={e => (e.currentTarget.style.color = "#c0788a")}
        onMouseLeave={e => (e.currentTarget.style.color = "#cdbf9f")}
      >✕</button>
    </div>
  )
}

const SERIF = "Georgia, 'Times New Roman', serif"

const s: Record<string, React.CSSProperties> = {
  body: {
    background: "#f5f1ea",
    backgroundImage:
      "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(139,79,209,0.10) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 80% 105%, rgba(216,177,92,0.12) 0%, transparent 55%)",
    minHeight: "100vh",
    color: "#1a1a2e",
    display: "flex",
    justifyContent: "center",
    padding: "1rem 1rem 5rem",
    paddingTop: 116,
    overflowX: "hidden",
    width: "100%",
  },
  app: { width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: "1.5rem" },

  header: { textAlign: "center", paddingTop: "0.25rem" },
  eyebrow: { fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e78", marginBottom: 6 },
  h1: { fontFamily: SERIF, fontSize: "2.6rem", fontWeight: 600, lineHeight: 1.1, color: "#1a1a2e" },
  h1em: { fontStyle: "italic", fontWeight: 400, color: "#8b4fd1" },
  dateLine: { marginTop: 6, fontSize: "0.82rem", color: "#9a8e78", fontWeight: 400 },

  stats: { display: "flex", gap: 10 },
  statPill: { flex: 1, background: "#fffdf8", borderRadius: 16, padding: "0.85rem 1rem", textAlign: "center", border: "1px solid #ece3d2" },
  statNum: { fontFamily: SERIF, fontSize: "1.9rem", fontWeight: 700, color: "#8b4fd1", lineHeight: 1 },
  statLabel: { fontSize: "0.67rem", color: "#9a8e78", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 },

  addForm: { background: "#fffdf8", borderRadius: 20, padding: "1.1rem", border: "1px solid #ece3d2", display: "flex", flexDirection: "column", gap: 10 },
  addRow: { display: "flex", gap: 8 },
  input: { flex: 1, background: "#f5f1ea", border: "1.5px solid #e3d9c4", borderRadius: 12, padding: "0.65rem 1rem", fontSize: "0.9rem", color: "#1a1a2e", transition: "border-color 0.2s" },
  select: { flex: 1, background: "#f5f1ea", border: "1.5px solid #e3d9c4", borderRadius: 12, padding: "0.65rem 0.8rem", fontSize: "0.85rem", color: "#1a1a2e", cursor: "pointer" },
  addBtn: { background: "#8b4fd1", color: "#fff", border: "none", borderRadius: 12, padding: "0.65rem 1.1rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" },

  tabs: { display: "flex", gap: 8, flexWrap: "wrap" },
  tab: { background: "#fffdf8", border: "1.5px solid #e3d9c4", borderRadius: 999, padding: "0.32rem 0.85rem", fontSize: "0.78rem", color: "#9a8e78", cursor: "pointer" },
  tabActive: { background: "#8b4fd1", border: "1.5px solid #8b4fd1", borderRadius: 999, padding: "0.32rem 0.85rem", fontSize: "0.78rem", color: "#fff", cursor: "pointer", fontWeight: 600 },

  sectionLabel: { fontSize: "0.67rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a8e78", paddingLeft: 2 },

  item: { background: "#fffdf8", border: "1.5px solid #ece3d2", borderRadius: 16, padding: "0.8rem 0.9rem", display: "flex", alignItems: "center", gap: 10, transition: "opacity 0.3s, transform 0.3s, filter 0.3s" },
  itemDone: { opacity: 0.55, background: "#f3eee3" },
  itemVanish: { opacity: 0, transform: "translateX(20px) scale(0.93)", filter: "blur(3px)" },

  checkBtn: { width: 26, height: 26, borderRadius: "50%", border: "2px solid #e0d4ee", background: "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "transparent", fontSize: "0.7rem", transition: "all 0.2s" },
  checkBtnDone: { background: "#8b4fd1", borderColor: "#8b4fd1", color: "#fff" },

  itemName: { fontSize: "0.92rem", fontWeight: 600, color: "#1a1a2e", position: "relative", display: "inline-block", transition: "color 0.3s" },
  itemNameDone: { color: "#a89b85" },
  strikeBar: { position: "absolute", left: 0, top: "50%", width: "100%", height: 1.5, background: "#a89b85", display: "block" },
  itemQty: { fontSize: "0.75rem", color: "#9a8e78", marginTop: 2 },
  delBtn: { background: "none", border: "none", color: "#cdbf9f", cursor: "pointer", fontSize: "0.9rem", padding: "0.2rem", borderRadius: 6, lineHeight: 1, flexShrink: 0, transition: "color 0.2s" },

  empty: { textAlign: "center", padding: "2.5rem 1rem", color: "#9a8e78" },
  emptyTitle: { fontFamily: SERIF, fontSize: "1.2rem", fontStyle: "italic", marginBottom: 6, color: "#1a1a2e" },
  emptySub: { fontSize: "0.78rem" },

  clearBtn: { background: "none", border: "1.5px solid #e3d9c4", borderRadius: 999, padding: "0.38rem 1.1rem", fontSize: "0.78rem", color: "#9a8e78", cursor: "pointer", transition: "all 0.2s" },
  deco: { textAlign: "center", fontSize: "1.3rem", letterSpacing: "0.3em", opacity: 0.3, userSelect: "none", color: "#8b4fd1" },
}
