// ---------------------------------------------------------------------------
// Skalowane ilości składników dla dań z Planera.
// Każdy znany składnik ma "bazową porcję dla dania ~400 kcal". Funkcja
// formatScaledIngredients() bierze listę składników z PlanerDish (string),
// dopasowuje wzorce i skaluje ilości proporcjonalnie do kcal danego dania
// (już uwzględniających scaleFactor diety). Nieznane składniki dostają
// etykietę "do smaku" zamiast losowych liczb.
// ---------------------------------------------------------------------------

type Unit = "g" | "ml" | "szt" | "łyżka" | "łyżeczka" | "ząbki" | "kromka" | "garść";

interface PortionRule {
  /** wzorzec pasujący do tokenu składnika (po lowercase) */
  match: RegExp;
  /** ile per 400 kcal porcję */
  base: number;
  unit: Unit;
  /** etykieta wyświetlania zamiast oryginalnego tokenu (opcjonalna) */
  label?: string;
  /** zaokrąglenie liczby */
  step?: number;
  /** minimalna ilość (np. 1 jajko) */
  min?: number;
  /** maksymalna ilość (np. 4 jajka) */
  max?: number;
  /** jeśli true → ilość renderowana jako ułamek (1/2, 1, 1 1/2, 2…) */
  fraction?: boolean;
}

// Składniki traktowane jako "do smaku" (przyprawy, zioła, ekstrakty)
const TO_TASTE = /\b(sól|pieprz|zioła|przyprawy|oregano|bazylia|mięta|koper|tymianek|rozmaryn|szałwia|kumin|kolendra|imbir|kurkuma|curry(?!\s*pasta)|papryka wędzona|papryka słodka|chili|pietruszka|natka|szczypiorek|gałka|skórka cytrynow|skórka pomarańcz|wanilia|cynamon|goździk|kardamon|estragon|lawenda|szafran|trawa cytrynowa|liść laurow|ziele angielsk|szałwia)\b/i;

const RULES: PortionRule[] = [
  // ── BIAŁKO – mięso ────────────────────────────────────────────────────
  { match: /\b(filet z kurczak|pierś z kurczak|kurczak)\w*/i, base: 150, unit: "g", label: "kurczaka", step: 10 },
  { match: /\b(filet z indyk|indyk)\w*/i,       base: 150, unit: "g", label: "indyka",   step: 10 },
  { match: /\b(polędwica wołow|wołowin|łopatka wołow|stek)\w*/i, base: 150, unit: "g", label: "wołowiny", step: 10 },
  { match: /\b(schab|polędwiczka wieprzow|karkówka)\w*/i, base: 150, unit: "g", label: "wieprzowiny", step: 10 },
  { match: /\b(boczek|bekon)\w*/i,              base: 50,  unit: "g", label: "boczku",   step: 5 },
  { match: /\b(mięso mielon|wołowina mielon)\w*/i, base: 150, unit: "g", label: "mięsa mielonego", step: 10 },
  { match: /\b(szynka|prosciutto|parmesz|salami|chorizo|jamon|serrano)\w*/i, base: 60, unit: "g", label: "wędliny", step: 5 },

  // ── BIAŁKO – ryby/owoce morza ─────────────────────────────────────────
  { match: /\b(filet łosoś|łoś|łosos)\w*/i,     base: 150, unit: "g", label: "łososia",  step: 10 },
  { match: /\b(łosoś wędzon)\w*/i,              base: 80,  unit: "g", label: "łososia wędzonego", step: 5 },
  { match: /\b(dorsz|filet (dorsz|tilapia|ryby)|ryba|tilapia|halibut|sandacz|mintaj)\w*/i, base: 150, unit: "g", label: "ryby", step: 10 },
  { match: /\btuńczyk\w*/i,                     base: 100, unit: "g", label: "tuńczyka", step: 5 },
  { match: /\b(makrela|sardynki?|śledź|sledz|anchois|szproty)\w*/i, base: 80, unit: "g", label: "ryby", step: 5 },
  { match: /\bkrewetk\w*/i,                     base: 120, unit: "g", label: "krewetek", step: 10 },
  { match: /\b(małż|owoce morza|kalmary|ośmior)\w*/i, base: 120, unit: "g", label: "owoców morza", step: 10 },

  // ── BIAŁKO – roślinne ────────────────────────────────────────────────
  { match: /\btofu (jedwabist|naturaln|twardym?)?/i, base: 150, unit: "g", label: "tofu", step: 10 },
  { match: /\btofu\w*/i,                        base: 150, unit: "g", label: "tofu", step: 10 },
  { match: /\btempeh\w*/i,                      base: 120, unit: "g", label: "tempehu", step: 10 },
  { match: /\bedamame\w*/i,                     base: 100, unit: "g", label: "edamame", step: 10 },
  { match: /\b(ciecierzyc|soczewic|fasola|fasolk)\w*/i, base: 150, unit: "g", label: "strączków", step: 10 },

  // ── JAJKA ────────────────────────────────────────────────────────────
  { match: /\bjajk(a|o)\b/i,                    base: 2,   unit: "szt", label: "jajka", step: 1, min: 1, max: 4 },
  { match: /\bżółtk\w*/i,                       base: 2,   unit: "szt", label: "żółtka", step: 1, min: 1 },
  { match: /\bbiałk(a|o) (jaj|jajek)\w*/i,      base: 2,   unit: "szt", label: "białka", step: 1, min: 1 },

  // ── NABIAŁ / SERY ────────────────────────────────────────────────────
  { match: /\bmascarpone\w*/i,                  base: 60,  unit: "g", label: "mascarpone", step: 5 },
  { match: /\bricott\w*/i,                      base: 80,  unit: "g", label: "ricotty", step: 5 },
  { match: /\bmozzarell\w*/i,                   base: 80,  unit: "g", label: "mozzarelli", step: 5 },
  { match: /\bparmezan\w*/i,                    base: 25,  unit: "g", label: "parmezanu", step: 5 },
  { match: /\bgorgonzol\w*/i,                   base: 40,  unit: "g", label: "gorgonzoli", step: 5 },
  { match: /\b(brie|camembert|ser kozi|ser pleśniow)\w*/i, base: 50, unit: "g", label: "sera", step: 5 },
  { match: /\bfeta\w*/i,                        base: 60,  unit: "g", label: "fety", step: 5 },
  { match: /\bhalloumi\w*/i,                    base: 80,  unit: "g", label: "halloumi", step: 5 },
  { match: /\bcheddar\w*/i,                     base: 40,  unit: "g", label: "cheddara", step: 5 },
  { match: /\b(ser żółt|gouda|edam|ser topion)\w*/i, base: 50, unit: "g", label: "sera", step: 5 },
  { match: /\b(serek wiej|cottage|serek kremow|serek)\w*/i, base: 100, unit: "g", label: "serka", step: 10 },
  { match: /\btwar(óg|ożek)\w*/i,               base: 150, unit: "g", label: "twarogu", step: 10 },
  { match: /\bjogurt grecki\w*/i,               base: 150, unit: "g", label: "jogurtu greckiego", step: 10 },
  { match: /\bjogurt\w*/i,                      base: 150, unit: "g", label: "jogurtu", step: 10 },
  { match: /\bkefir\w*/i,                       base: 200, unit: "ml", label: "kefiru", step: 10 },
  { match: /\bśmietank(a|i) (36|30|18)/i,       base: 50,  unit: "ml", label: "śmietanki", step: 5 },
  { match: /\bśmietank\w*/i,                    base: 50,  unit: "ml", label: "śmietanki", step: 5 },
  { match: /\bśmietan\w*/i,                     base: 60,  unit: "ml", label: "śmietany", step: 5 },
  { match: /\bmleko kokosow\w*/i,               base: 200, unit: "ml", label: "mleka kokosowego", step: 10 },
  { match: /\bmleko migdałow\w*/i,              base: 200, unit: "ml", label: "mleka migdałowego", step: 10 },
  { match: /\bmleko roślinn\w*/i,               base: 200, unit: "ml", label: "mleka roślinnego", step: 10 },
  { match: /\bmleko\w*/i,                       base: 200, unit: "ml", label: "mleka", step: 10 },

  // ── TŁUSZCZE ─────────────────────────────────────────────────────────
  { match: /\boliwa( z oliwek)?\w*/i,           base: 1,   unit: "łyżka", label: "oliwy", step: 1, min: 1, max: 4 },
  { match: /\bmasło kokosow\w*/i,               base: 1,   unit: "łyżka", label: "masła kokosowego", step: 1, min: 1, max: 3 },
  { match: /\b(ghee|masło klarowan)\w*/i,       base: 1,   unit: "łyżka", label: "masła klarowanego", step: 1, min: 1, max: 3 },
  { match: /\bmasło\w*/i,                       base: 1,   unit: "łyżka", label: "masła", step: 1, min: 1, max: 3 },
  { match: /\b(olej (sezamow|kokosow|rzepak|lnian|orzechow))\w*/i, base: 1, unit: "łyżka", label: "oleju", step: 1, min: 1 },
  { match: /\bolej\w*/i,                        base: 1,   unit: "łyżka", label: "oleju", step: 1, min: 1 },

  // ── WARZYWA ──────────────────────────────────────────────────────────
  { match: /\bawokado\w*/i,                     base: 0.5, unit: "szt", label: "awokado", step: 0.5, min: 0.5, max: 2, fraction: true },
  { match: /\bcukini\w*/i,                      base: 1,   unit: "szt", label: "cukinii", step: 0.5, min: 0.5, fraction: true },
  { match: /\bbakłażan\w*/i,                    base: 1,   unit: "szt", label: "bakłażana", step: 0.5, min: 0.5, fraction: true },
  { match: /\bpapryk\w*/i,                      base: 1,   unit: "szt", label: "papryki", step: 0.5, min: 0.5, fraction: true },
  { match: /\b(pomidor(y|ów)? pelati|pomidory pelati|pomidory z puszki)\b/i, base: 200, unit: "g", label: "pomidorów pelati", step: 10 },
  { match: /\bpomidork(i|ów)? koktajlow\w*/i,   base: 100, unit: "g", label: "pomidorków", step: 10 },
  { match: /\bpomidor\w*/i,                     base: 1,   unit: "szt", label: "pomidora", step: 1, min: 1, max: 4 },
  { match: /\bogór\w*/i,                        base: 0.5, unit: "szt", label: "ogórka", step: 0.5, min: 0.5, fraction: true },
  { match: /\b(cebul[ay] dymk|szczypior|dymk)\w*/i, base: 20, unit: "g", label: "szczypioru", step: 5 },
  { match: /\b(cebul|szalotk)\w*/i,             base: 0.5, unit: "szt", label: "cebuli", step: 0.5, min: 0.5, fraction: true },
  { match: /\bczosn(ek|ku)\w*/i,                base: 2,   unit: "ząbki", label: "czosnku", step: 1, min: 1, max: 5 },
  { match: /\bszpinak\w*/i,                     base: 80,  unit: "g", label: "szpinaku", step: 10 },
  { match: /\b(jarmuż|kale)\w*/i,               base: 60,  unit: "g", label: "jarmużu", step: 10 },
  { match: /\b(rukol|sałat)\w*/i,               base: 40,  unit: "g", label: "sałaty", step: 5 },
  { match: /\bbrokuł\w*/i,                      base: 200, unit: "g", label: "brokuła", step: 10 },
  { match: /\bkalafior\w*/i,                    base: 200, unit: "g", label: "kalafiora", step: 10 },
  { match: /\bmarchew\w*/i,                     base: 1,   unit: "szt", label: "marchewki", step: 1, min: 1 },
  { match: /\b(seler nacio|seler\b)\w*/i,       base: 50,  unit: "g", label: "selera", step: 5 },
  { match: /\b(pieczark|grzyb|shiitake|portobello|borowik|kurk)\w*/i, base: 150, unit: "g", label: "grzybów", step: 10 },
  { match: /\b(dynia|dyni)\w*/i,                base: 200, unit: "g", label: "dyni", step: 10 },
  { match: /\b(buraka?|buraczk)\w*/i,           base: 150, unit: "g", label: "buraka", step: 10 },
  { match: /\b(rzodkiew|rzodkiewk)\w*/i,        base: 60,  unit: "g", label: "rzodkiewki", step: 10 },
  { match: /\b(kapust(a|y)? pekińsk|kapusta pekiń)\w*/i, base: 150, unit: "g", label: "kapusty pekińskiej", step: 10 },
  { match: /\b(kapusta kiszon|ogórki kiszon|kiszonk)\w*/i, base: 100, unit: "g", label: "kiszonek", step: 10 },
  { match: /\b(szparag)\w*/i,                   base: 150, unit: "g", label: "szparagów", step: 10 },
  { match: /\b(fasolka szparagow)\w*/i,         base: 150, unit: "g", label: "fasolki szparagowej", step: 10 },
  { match: /\b(oliwk(i|ek))\b/i,                base: 40,  unit: "g", label: "oliwek", step: 5 },
  { match: /\bkapar\w*/i,                       base: 10,  unit: "g", label: "kaparów", step: 5 },
  { match: /\bsuszone pomidor\w*/i,             base: 30,  unit: "g", label: "suszonych pomidorów", step: 5 },

  // ── OWOCE ───────────────────────────────────────────────────────────
  { match: /\b(jagod|borów)\w*/i,               base: 80,  unit: "g", label: "jagód", step: 10 },
  { match: /\b(maliny|truskawk)\w*/i,           base: 100, unit: "g", label: "owoców", step: 10 },
  { match: /\b(wiśn|jeżyn)\w*/i,                base: 80,  unit: "g", label: "owoców", step: 10 },
  { match: /\bbanan\w*/i,                       base: 0.5, unit: "szt", label: "banana", step: 0.5, fraction: true, min: 0.5 },
  { match: /\b(jabłk|gruszk)\w*/i,              base: 1,   unit: "szt", label: "owoca", step: 0.5, fraction: true, min: 0.5 },
  { match: /\b(mango|pitay)\w*/i,               base: 0.5, unit: "szt", label: "owoca", step: 0.5, fraction: true, min: 0.5 },
  { match: /\bananas\w*/i,                      base: 80,  unit: "g", label: "ananasa", step: 10 },
  { match: /\b(daktyl|rodzynk|figi suszon|morel suszon|śliwk suszon)\w*/i, base: 25, unit: "g", label: "suszonych owoców", step: 5 },
  { match: /\b(cytryn|limonk)\w*/i,             base: 0.5, unit: "szt", label: "cytrusa", step: 0.5, fraction: true, min: 0.5 },

  // ── ORZECHY / NASIONA ────────────────────────────────────────────────
  { match: /\borzech(y|ów)? włosk\w*/i,         base: 25,  unit: "g", label: "orzechów włoskich", step: 5 },
  { match: /\b(migdał|nerkow|pistacj|orzech laskow|orzech brazyl|orzech makadami|orzech)\w*/i, base: 25, unit: "g", label: "orzechów", step: 5 },
  { match: /\bnasiona chia\b/i,                 base: 15,  unit: "g", label: "nasion chia", step: 5 },
  { match: /\b(siemię lnian|nasion|len|ziarna)\w*/i, base: 15, unit: "g", label: "nasion", step: 5 },
  { match: /\bpestki dyni\b/i,                  base: 15,  unit: "g", label: "pestek dyni", step: 5 },
  { match: /\b(słonecznik|sezam)\w*/i,          base: 15,  unit: "g", label: "ziaren", step: 5 },
  { match: /\bwiórki kokosow\w*/i,              base: 20,  unit: "g", label: "wiórków kokosowych", step: 5 },
  { match: /\b(masło orzechow|masło migdałow|krem orzechow)\w*/i, base: 1, unit: "łyżka", label: "masła orzechowego", min: 1, max: 3 },
  { match: /\btahini\w*/i,                      base: 1,   unit: "łyżka", label: "tahini", min: 1, max: 3 },

  // ── SKROBIE ─────────────────────────────────────────────────────────
  { match: /\b(makaron konjac)\b/i,             base: 100, unit: "g", label: "makaronu konjac", step: 10 },
  { match: /\b(makaron|spaghett|penne|tagliatell|fettuccine|lasagn|gnocchi)\w*/i, base: 60, unit: "g", label: "makaronu", step: 5 },
  { match: /\b(kasza gryczan|gryczan)\w*/i,     base: 50,  unit: "g", label: "kaszy gryczanej", step: 5 },
  { match: /\b(kasza jaglan|jaglan)\w*/i,       base: 50,  unit: "g", label: "kaszy jaglanej", step: 5 },
  { match: /\b(kasz|bulgur|quinoa|komosa)\w*/i, base: 50,  unit: "g", label: "kaszy", step: 5 },
  { match: /\bryż\w*/i,                         base: 60,  unit: "g", label: "ryżu", step: 5 },
  { match: /\b(ziemniak|kartofl)\w*/i,          base: 200, unit: "g", label: "ziemniaków", step: 10 },
  { match: /\bbatat\w*/i,                       base: 200, unit: "g", label: "batatów", step: 10 },
  { match: /\bchleb keto\b/i,                   base: 1,   unit: "kromka", label: "chleba keto", step: 1, min: 1, max: 3 },
  { match: /\bchleb\w*/i,                       base: 1,   unit: "kromka", label: "chleba", step: 1, min: 1, max: 3 },

  // ── MĄKI / DODATKI DO PIECZENIA ─────────────────────────────────────
  { match: /\bmąka migdałow\w*/i,               base: 50,  unit: "g", label: "mąki migdałowej", step: 5 },
  { match: /\bmąka kokosow\w*/i,                base: 30,  unit: "g", label: "mąki kokosowej", step: 5 },
  { match: /\bmąka\w*/i,                        base: 50,  unit: "g", label: "mąki", step: 5 },
  { match: /\b(proszek do piecz|soda oczyszczon)\w*/i, base: 5, unit: "g", label: "proszku do pieczenia", step: 1 },
  { match: /\b(białko (w proszku|prot)|protein)\w*/i, base: 30, unit: "g", label: "białka w proszku", step: 5 },

  // ── SOSY / KONCENTRATY / SŁODZIDŁA ──────────────────────────────────
  { match: /\bsos sojow\w*/i,                   base: 1,   unit: "łyżka", label: "sosu sojowego", min: 1, max: 3 },
  { match: /\b(majonez|aioli)\w*/i,             base: 1,   unit: "łyżka", label: "majonezu", min: 1, max: 3 },
  { match: /\bmusztard\w*/i,                    base: 1,   unit: "łyżeczka", label: "musztardy", min: 1, max: 3 },
  { match: /\bocet\w*/i,                        base: 1,   unit: "łyżka", label: "octu", min: 1, max: 2 },
  { match: /\bbalsamico\b/i,                    base: 1,   unit: "łyżka", label: "balsamico", min: 1, max: 2 },
  { match: /\b(miód|syrop klonow)\w*/i,         base: 1,   unit: "łyżeczka", label: "miodu", min: 1, max: 2 },
  { match: /\berytrytol\w*/i,                   base: 1,   unit: "łyżka", label: "erytrytolu", min: 1, max: 3 },
  { match: /\bksylitol\w*/i,                    base: 1,   unit: "łyżka", label: "ksylitolu", min: 1, max: 3 },
  { match: /\bcuk(ier|ru)\w*/i,                 base: 1,   unit: "łyżeczka", label: "cukru", min: 1, max: 2 },
  { match: /\b(kakao|kakaow)\w*/i,              base: 1,   unit: "łyżka", label: "kakao", min: 1, max: 3 },
  { match: /\b(czekolada|kakao masło)\w*/i,     base: 30,  unit: "g", label: "czekolady", step: 5 },
  { match: /\bpest(o|a)\b/i,                    base: 1,   unit: "łyżka", label: "pesto", min: 1, max: 3 },
  { match: /\bpasta curry\b/i,                  base: 1,   unit: "łyżka", label: "pasty curry", min: 1, max: 2 },
  { match: /\bpasta miso\b/i,                   base: 1,   unit: "łyżka", label: "pasty miso", min: 1, max: 2 },
  { match: /\b(hummus|guacamole)\w*/i,          base: 50,  unit: "g", label: "dipu", step: 5 },
  { match: /\bbulion\w*/i,                      base: 400, unit: "ml", label: "bulionu", step: 50 },
  { match: /\b(woda|wody)\b/i,                  base: 200, unit: "ml", label: "wody", step: 50 },
  { match: /\bżelatyn\w*/i,                     base: 5,   unit: "g", label: "żelatyny", step: 1 },
  { match: /\bwodorost\w*/i,                    base: 5,   unit: "g", label: "wodorostów", step: 1 },
];

const FRACTION_MAP: Array<[number, string]> = [
  [0.25, "1/4"],
  [0.33, "1/3"],
  [0.5,  "1/2"],
  [0.67, "2/3"],
  [0.75, "3/4"],
];

function formatFraction(n: number): string {
  const whole = Math.floor(n);
  const frac = n - whole;
  if (frac < 0.1) return String(whole);
  // znajdź najbliższy ułamek
  let best: [number, string] = [0.5, "1/2"];
  let bestDiff = 1;
  for (const [v, s] of FRACTION_MAP) {
    const d = Math.abs(frac - v);
    if (d < bestDiff) { bestDiff = d; best = [v, s]; }
  }
  return whole > 0 ? `${whole} ${best[1]}` : best[1];
}

function formatQty(qty: number, rule: PortionRule): string {
  const minQ = rule.min ?? (rule.unit === "szt" ? 0.5 : rule.unit === "ząbki" ? 1 : 1);
  const maxQ = rule.max ?? Infinity;
  let q = Math.max(minQ, Math.min(maxQ, qty));

  if (rule.fraction) {
    // zaokrąglenie do step (np. 0.5)
    const step = rule.step ?? 0.5;
    q = Math.round(q / step) * step;
    return formatFraction(q);
  }

  const step = rule.step ?? 1;
  q = Math.round(q / step) * step;

  if (rule.unit === "szt" || rule.unit === "ząbki" || rule.unit === "łyżka" ||
      rule.unit === "łyżeczka" || rule.unit === "kromka" || rule.unit === "garść") {
    return String(Math.max(1, Math.round(q)));
  }
  return String(q);
}

const UNIT_LABEL: Record<Unit, string> = {
  g: "g",
  ml: "ml",
  szt: "",            // "1 jajko" zamiast "1 szt jajko"
  łyżka: "łyżka",
  łyżeczka: "łyżeczka",
  ząbki: "ząbki",
  kromka: "kromka",
  garść: "garść",
};

function pluralizeUnit(unit: Unit, qty: number): string {
  const n = Math.round(qty);
  if (unit === "łyżka")    return n === 1 ? "łyżka" : n < 5 ? "łyżki" : "łyżek";
  if (unit === "łyżeczka") return n === 1 ? "łyżeczka" : n < 5 ? "łyżeczki" : "łyżeczek";
  if (unit === "ząbki")    return n === 1 ? "ząbek" : n < 5 ? "ząbki" : "ząbków";
  if (unit === "kromka")   return n === 1 ? "kromka" : n < 5 ? "kromki" : "kromek";
  if (unit === "garść")    return n === 1 ? "garść" : n < 5 ? "garści" : "garści";
  return UNIT_LABEL[unit];
}

/**
 * Z surowego stringu składników (np. "kurczak, awokado, oliwa, sól, pieprz")
 * zwraca listę tokenów ze skalowanymi ilościami:
 *   ["120 g kurczaka", "1/2 awokado", "1 łyżka oliwy", "sól (do smaku)", "pieprz (do smaku)"]
 *
 * `dishKcal` to faktyczne kcal porcji DANEGO dania (już po skalowaniu do diety).
 * Bazowa porcja w słowniku jest dla 400 kcal — ilości skalowane przez kcal/400.
 */
export function formatScaledIngredients(skladnikiRaw: string, dishKcal: number): string[] {
  const scale = Math.max(0.4, Math.min(2.5, dishKcal / 400));
  const tokens = skladnikiRaw
    .split(/[,;]+/)
    .map(t => t.trim())
    .filter(Boolean);

  return tokens.map(tok => {
    if (TO_TASTE.test(tok)) {
      return `${tok} (do smaku)`;
    }
    for (const r of RULES) {
      if (r.match.test(tok)) {
        const qty = r.base * scale;
        const qtyStr = formatQty(qty, r);
        const unitStr = pluralizeUnit(r.unit, qty);
        const label = r.label ?? tok;
        return unitStr ? `${qtyStr} ${unitStr} ${label}` : `${qtyStr} ${label}`;
      }
    }
    // brak reguły → wyświetl token bez ilości
    return tok;
  });
}
