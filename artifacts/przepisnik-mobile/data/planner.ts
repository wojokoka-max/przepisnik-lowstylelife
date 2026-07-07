export interface PlanerDish {
  id: number
  nazwa: string
  czas: number
  opis: string
  skladniki: string
  przygotowanie: string
  kcal: number
  B: number
  T: number
  W: number
}

export type DietName = 'low_carb' | 'weganska' | 'srodziemnomorska' | 'dash' | 'wegetarianska' | 'niskotluszczowa' | 'bezglutenowa' | 'szybkie_20'
export type MealSlot = 'sniadanie' | 'drugie_sniadanie' | 'obiad' | 'podwieczorek' | 'kolacja'

export const DIET_LABELS: Record<DietName, string> = {
  low_carb:         'Niskowęglowodanowa',
  weganska:         'Wegańska',
  srodziemnomorska: 'Śródziemnomorska',
  dash:             'DASH',
  wegetarianska:    'Wegetariańska',
  niskotluszczowa:  'Niskotłuszczowa',
  bezglutenowa:     'Bezglutenowa',
  szybkie_20:       'Dania w 20 minut',
}

export const DIET_EMOJI: Record<DietName, string> = {
  low_carb:         '🥑',
  weganska:         '🌱',
  srodziemnomorska: '🫒',
  dash:             '💙',
  wegetarianska:    '🥦',
  niskotluszczowa:  '🍃',
  bezglutenowa:     '🌾',
  szybkie_20:       '⚡',
}

export const SLOT_LABELS: Record<MealSlot, string> = {
  sniadanie:        'Śniadanie',
  drugie_sniadanie: 'II Śniadanie',
  obiad:            'Obiad',
  podwieczorek:     'Podwieczorek',
  kolacja:          'Kolacja',
}

export const SLOT_EMOJI: Record<MealSlot, string> = {
  sniadanie:        '🌅',
  drugie_sniadanie: '☕',
  obiad:            '🍽️',
  podwieczorek:     '🍓',
  kolacja:          '🌙',
}

export const DISHES: PlanerDish[] = [
  // ── ŚNIADANIA 1–10 ────────────────────────────────────────────────────────
  { id:  1, nazwa: 'Omlet serowy z ziołami',       czas: 10, opis: 'szybki, sycący',       skladniki: 'jajka, ser, masło, zioła',               przygotowanie: 'Wymieszaj jajka, wlej na patelnię, dodaj ser, złóż.',              kcal: 360, B: 28, T: 26, W: 2  },
  { id:  2, nazwa: 'Jajka sadzone z awokado',      czas:  8, opis: 'tłuszcz + białko',     skladniki: 'jajka, awokado, sól, pieprz',             przygotowanie: 'Usmaż jajka na maśle. Awokado pokrój w plastry. Podaj razem.',    kcal: 380, B: 18, T: 32, W: 3  },
  { id:  3, nazwa: 'Twarożek ze szczypiorkiem',    czas:  5, opis: 'klasyka',               skladniki: 'twaróg, śmietana, szczypiorek, sól',      przygotowanie: 'Rozetrzeć twaróg ze śmietaną, dodać szczypiorek.',                kcal: 220, B: 18, T: 12, W: 5  },
  { id:  4, nazwa: 'Jogurt kokosowy z orzechami',  czas:  5, opis: 'wegańskie śniadanie',   skladniki: 'jogurt kokosowy, orzechy, jagody',        przygotowanie: 'Wlej jogurt do miseczki, posyp orzechami i jagodami.',            kcal: 320, B:  8, T: 24, W: 12 },
  { id:  5, nazwa: 'Omlet na słodko',              czas: 12, opis: 'deserowe śniadanie',    skladniki: 'jajka, kakao, erytrytol, masło',          przygotowanie: 'Roztrzep jajka z kakao i erytrytolem, usmaż omlet.',              kcal: 320, B: 22, T: 22, W: 4  },
  { id:  6, nazwa: 'Jajecznica z boczkiem',        czas: 10, opis: 'klasyczna, sycąca',     skladniki: 'jajka, boczek, masło',                   przygotowanie: 'Podsmaż boczek, dodaj masło, wbij jajka, smaż mieszając.',        kcal: 420, B: 24, T: 35, W: 1  },
  { id:  7, nazwa: 'Pasta jajeczna',               czas: 10, opis: 'kremowa, do warzyw',    skladniki: 'jajka, majonez, musztarda, szczypiorek',  przygotowanie: 'Ugotuj jajka, posiekaj, wymieszaj z majonezem i musztardą.',     kcal: 280, B: 16, T: 22, W: 3  },
  { id:  8, nazwa: 'Smoothie białkowe',            czas:  5, opis: 'szybkie, odżywcze',     skladniki: 'białko w proszku, mleko, banan, lód',     przygotowanie: 'Zblenduj wszystkie składniki na gładko.',                        kcal: 260, B: 30, T:  4, W: 20 },
  { id:  9, nazwa: 'Owsianka keto',                czas: 10, opis: 'zamiennik owsianki',    skladniki: 'wiórki kokosowe, nasiona chia, mleko',    przygotowanie: 'Wymieszaj składniki, gotuj 5 min na małym ogniu.',               kcal: 290, B: 10, T: 22, W: 8  },
  { id: 10, nazwa: 'Kanapki bez chleba',           czas:  5, opis: 'lekkie, szybkie',       skladniki: 'ser żółty, szynka, sałata, pomidor',      przygotowanie: 'Ułóż szynkę i ser na liściach sałaty, podaj z pomidorem.',       kcal: 240, B: 18, T: 16, W: 4  },

  // ── OBIADY 11–20 ──────────────────────────────────────────────────────────
  { id: 11, nazwa: 'Kurczak z brokułem',           czas: 20, opis: 'prosty, lekki',         skladniki: 'filet z kurczaka, brokuł, czosnek, oliwa',  przygotowanie: 'Usmaż kurczaka, dodaj brokuł i czosnek, duś 10 min.',            kcal: 380, B: 42, T: 18, W: 8  },
  { id: 12, nazwa: 'Łosoś z masłem',              czas: 15, opis: 'tłusty, omega-3',        skladniki: 'filet łososia, masło, cytryna, koperek',  przygotowanie: 'Piecz łososia w 180°C z masłem i cytryną przez 15 min.',        kcal: 420, B: 38, T: 28, W: 1  },
  { id: 13, nazwa: 'Wołowina stir-fry',            czas: 15, opis: 'azjatyckie, szybkie',   skladniki: 'wołowina, papryka, cebula, sos sojowy',   przygotowanie: 'Podsmaż wołowinę na woku, dodaj warzywa i sos sojowy.',          kcal: 400, B: 36, T: 22, W: 8  },
  { id: 14, nazwa: 'Curry kokosowe',               czas: 25, opis: 'aromatyczne, wegańskie', skladniki: 'mleko kokosowe, ciecierzyca, curry, szpinak', przygotowanie: 'Podsmaż przyprawy, wlej mleko kokosowe, dodaj ciecierzycę.',  kcal: 380, B: 12, T: 26, W: 18 },
  { id: 15, nazwa: 'Indyk z warzywami',            czas: 20, opis: 'lekki, wysokobiałkowy', skladniki: 'indyk, cukinia, papryka, oliwa',           przygotowanie: 'Usmaż indyka, dodaj pokrojone warzywa, duś razem 10 min.',       kcal: 340, B: 40, T: 12, W: 10 },
  { id: 16, nazwa: 'Sałatka z tuńczykiem',         czas: 10, opis: 'szybka, sycąca',        skladniki: 'tuńczyk w sosie własnym, sałata, pomidor, oliwa', przygotowanie: 'Odsącz tuńczyka, wymieszaj z sałatą i pomidorem.',       kcal: 280, B: 28, T: 14, W: 8  },
  { id: 17, nazwa: 'Makaron z cukinii',            czas: 15, opis: 'lekki zamiennik',        skladniki: 'cukinia, czosnek, oliwa, parmezan',       przygotowanie: 'Zetrzyj cukinię na spiralizatorze, podsmaż z czosnkiem.',        kcal: 260, B:  8, T: 16, W: 10 },
  { id: 18, nazwa: 'Zupa krem brokułowa',          czas: 25, opis: 'kremowa, sycąca',        skladniki: 'brokuł, bulion, śmietana, czosnek',       przygotowanie: 'Ugotuj brokuł w bulionie, zblenduj ze śmietaną.',               kcal: 240, B: 10, T: 16, W: 10 },
  { id: 19, nazwa: 'Selerowe puree + mięso',       czas: 30, opis: 'zamiennik ziemniaków',   skladniki: 'seler, masło, mięso mielone, cebula',     przygotowanie: 'Ugotuj seler, zblenduj z masłem. Usmaż mięso mielone.',          kcal: 360, B: 32, T: 18, W: 10 },
  { id: 20, nazwa: 'Kotlety z indyka',             czas: 25, opis: 'klasyczne, sycące',      skladniki: 'mięso mielone z indyka, jajko, zioła',    przygotowanie: 'Wymieszaj mięso z jajkiem i ziołami, uformuj, usmaż.',           kcal: 360, B: 38, T: 16, W: 4  },

  // ── KOLACJE 21–25 ─────────────────────────────────────────────────────────
  { id: 21, nazwa: 'Sałatka grecka',               czas: 10, opis: 'lekka, śródziemnomorska', skladniki: 'feta, ogórek, pomidor, oliwki, oliwa',  przygotowanie: 'Pokrój warzywa, dodaj fetę i oliwki, skrop oliwą.',             kcal: 280, B: 10, T: 22, W: 8  },
  { id: 22, nazwa: 'Jajka na miękko',              czas:  6, opis: 'proste, szybkie',        skladniki: 'jajka, sól',                             przygotowanie: 'Gotuj jajka 6 minut. Podaj z solą.',                             kcal: 160, B: 14, T: 10, W: 1  },
  { id: 23, nazwa: 'Serek + orzechy',              czas:  5, opis: 'szybka kolacja',         skladniki: 'serek wiejski, orzechy włoskie, sól',     przygotowanie: 'Przełóż serek do miseczki, posyp orzechami.',                    kcal: 280, B: 12, T: 22, W: 4  },
  { id: 24, nazwa: 'Wrapy sałatowe',               czas: 10, opis: 'lekkie, szybkie',        skladniki: 'sałata masłowa, kurczak, awokado, sos',   przygotowanie: 'Ułóż nadzienie na liściach sałaty, zwiń.',                       kcal: 260, B: 22, T: 12, W: 8  },
  { id: 25, nazwa: 'Zupa pomidorowa',              czas: 20, opis: 'klasyczna, rozgrzewająca', skladniki: 'pomidory, bulion, śmietana, bazylia',   przygotowanie: 'Podsmaż pomidory, dodaj bulion, gotuj 15 min, zblenduj.',        kcal: 180, B:  6, T:  8, W: 14 },

  // ── DESERY 26–30 ──────────────────────────────────────────────────────────
  { id: 26, nazwa: 'Sernik bez cukru',             czas: 60, opis: 'klasyczny, bez cukru',   skladniki: 'twaróg, jajka, erytrytol, masło',        przygotowanie: 'Wymieszaj składniki, piecz w 160°C przez 45 min.',               kcal: 280, B: 14, T: 20, W: 6  },
  { id: 27, nazwa: 'Mus czekoladowy',              czas: 10, opis: 'szybki, kremowy',        skladniki: 'kakao, śmietanka, erytrytol',             przygotowanie: 'Ubij śmietankę, dodaj kakao i erytrytol, wymieszaj.',            kcal: 220, B:  6, T: 16, W: 8  },
  { id: 28, nazwa: 'Pudding chia',                 czas:  5, opis: 'nocny, wegański',        skladniki: 'nasiona chia, mleko roślinne, wanilia',   przygotowanie: 'Wymieszaj chia z mlekiem, odstaw na noc do lodówki.',            kcal: 200, B:  6, T: 10, W: 16 },
  { id: 29, nazwa: 'Ciasto jogurtowe',             czas: 50, opis: 'lekkie, bez masła',      skladniki: 'jogurt grecki, jajka, mąka migdałowa',    przygotowanie: 'Wymieszaj składniki, piecz w 180°C przez 35 min.',               kcal: 240, B: 10, T: 14, W: 10 },
  { id: 30, nazwa: 'Pianka kakaowa',               czas: 20, opis: 'lekka, keto',            skladniki: 'białka jaj, kakao, erytrytol',            przygotowanie: 'Ubij białka na sztywno z kakao i erytrytolem.',                  kcal: 160, B:  8, T:  4, W: 4  },

  // ── PRZEKĄSKI 31–35 ───────────────────────────────────────────────────────
  { id: 31, nazwa: 'Orzechy mieszane',             czas:  2, opis: 'szybka przekąska',       skladniki: 'orzechy włoskie, migdały, nerkowce',      przygotowanie: 'Odmierz porcję i zjedz.',                                        kcal: 200, B:  6, T: 18, W: 4  },
  { id: 32, nazwa: 'Warzywa + dip',                czas: 10, opis: 'zdrowe, chrupiące',      skladniki: 'marchewka, seler naciowy, dip jogurtowy', przygotowanie: 'Pokrój warzywa w słupki, podaj z dipem.',                        kcal: 140, B:  4, T:  6, W: 12 },
  { id: 33, nazwa: 'Jajko na twardo',              czas: 10, opis: 'proste, białkowe',       skladniki: 'jajko, sól, pieprz',                      przygotowanie: 'Gotuj jajko 10 min, ostudź, obierz.',                            kcal: 160, B: 13, T: 10, W:  1 },
  { id: 34, nazwa: 'Ser + oliwki',                 czas:  5, opis: 'tłuste, keto',           skladniki: 'ser feta lub halloumi, oliwki',           przygotowanie: 'Pokrój ser, ułóż na talerzu z oliwkami.',                        kcal: 200, B: 10, T: 16, W:  2 },
  { id: 35, nazwa: 'Koktajl białkowy',             czas:  5, opis: 'szybkie źródło białka',  skladniki: 'białko w proszku, woda lub mleko',        przygotowanie: 'Wymieszaj białko z płynem, wstrząśnij lub zblenduj.',            kcal: 180, B: 24, T:  4, W:  8 },

  // ── SZYBKIE 36–40 ─────────────────────────────────────────────────────────
  { id: 36, nazwa: 'Omlet warzywny',               czas: 10, opis: 'szybki, kolorowy',       skladniki: 'jajka, papryka, cebula, oliwa',           przygotowanie: 'Podsmaż warzywa, wlej roztrzepane jajka, smaż do ścięcia.',     kcal: 280, B: 18, T: 18, W: 6  },
  { id: 37, nazwa: 'Sałatka z kurczakiem',         czas: 12, opis: 'szybka, sycąca',         skladniki: 'kurczak gotowany, sałata, ogórek, majonez', przygotowanie: 'Pokrój kurczaka, wymieszaj z sałatą i sosem.',                kcal: 300, B: 32, T: 14, W: 6  },
  { id: 38, nazwa: 'Tofu stir-fry',                czas: 15, opis: 'wegańskie, azjatyckie',   skladniki: 'tofu twarde, sos sojowy, sezam, czosnek', przygotowanie: 'Podsmaż tofu na oleju, dodaj sos sojowy i czosnek.',            kcal: 280, B: 16, T: 16, W: 8  },
  { id: 39, nazwa: 'Makaron konjac',               czas: 10, opis: 'prawie zero kalorii',     skladniki: 'makaron konjac, sos pesto, parmezan',     przygotowanie: 'Opłucz makaron, podgrzej, wymieszaj z pesto.',                  kcal: 160, B:  4, T:  8, W: 4  },
  { id: 40, nazwa: 'Krem z awokado',               czas:  5, opis: 'szybkie, kremowe',        skladniki: 'awokado, czosnek, sok z cytryny, sól',    przygotowanie: 'Zblenduj awokado z czosnkiem i cytryną na gładko.',              kcal: 200, B:  4, T: 18, W: 4  },

  // ── RÓŻNE / BAZOWE 41–45 ──────────────────────────────────────────────────
  { id: 41, nazwa: 'Ryż kalafiorowy',              czas: 10, opis: 'zamiennik ryżu',          skladniki: 'kalafior, oliwa, sól, pieprz',            przygotowanie: 'Zetrzyj kalafior na tarce, podsmaż na oliwie 5 min.',           kcal:  80, B:  4, T:  4, W:  6 },
  { id: 42, nazwa: 'Frytki z selera',              czas: 25, opis: 'pieczone, chrupiące',     skladniki: 'seler, oliwa, sól, papryka',              przygotowanie: 'Pokrój seler w słupki, skrop oliwą, piecz 20 min w 200°C.',     kcal: 140, B:  4, T:  6, W: 12 },
  { id: 43, nazwa: 'Placki kokosowe',              czas: 15, opis: 'deser keto',              skladniki: 'wiórki kokosowe, jajka, erytrytol',       przygotowanie: 'Wymieszaj składniki, smaż placki na suchej patelni.',            kcal: 280, B:  8, T: 22, W:  6 },
  { id: 44, nazwa: 'Zupa jarzynowa',               czas: 30, opis: 'lekka, odżywcza',        skladniki: 'warzywa mieszane, bulion, zioła',          przygotowanie: 'Pokrój warzywa, gotuj w bulionie 20 min.',                       kcal: 200, B:  8, T:  6, W: 18 },
  { id: 45, nazwa: 'Sałatka jajko + awokado',      czas: 10, opis: 'kremowa, sycąca',         skladniki: 'jajka ugotowane, awokado, majonez, sók z cytryny', przygotowanie: 'Pokrój jajka i awokado, wymieszaj z majonezem.',      kcal: 300, B: 16, T: 24, W:  4 },

  // ── BONUS 46–50 ───────────────────────────────────────────────────────────
  { id: 46, nazwa: 'Pancakes low carb',            czas: 15, opis: 'naleśniki bez mąki',      skladniki: 'jajka, ser ricotta, erytrytol',           przygotowanie: 'Zblenduj składniki, smaż małe placki na maśle.',                kcal: 320, B: 18, T: 22, W:  6 },
  { id: 47, nazwa: 'Burger bez bułki',             czas: 20, opis: 'sycący, keto',            skladniki: 'mięso mielone wołowe, sałata, pomidor, cheddar', przygotowanie: 'Usmaż kotlet, podaj z sałatą, pomidorem i serem.',        kcal: 440, B: 36, T: 30, W:  4 },
  { id: 48, nazwa: 'Zapiekanka warzywna',          czas: 40, opis: 'pieczona, sycąca',        skladniki: 'cukinia, bakłażan, pomidory, ser',         przygotowanie: 'Ułóż warzywa w naczyniu, posyp serem, piecz 35 min w 180°C.',   kcal: 300, B: 12, T: 16, W: 14 },
  { id: 49, nazwa: 'Smoothie zielone',             czas:  5, opis: 'detoksykujące, wegańskie', skladniki: 'szpinak, banan, mleko roślinne, imbir',   przygotowanie: 'Zblenduj wszystkie składniki na gładko.',                       kcal: 180, B:  4, T:  2, W: 26 },
  { id: 50, nazwa: 'Deser kokosowy',               czas: 10, opis: 'szybki, kremowy',         skladniki: 'mleko kokosowe, erytrytol, wanilia',       przygotowanie: 'Wymieszaj mleko kokosowe z wanilią i erytrytolem, schłódź.',    kcal: 220, B:  2, T: 18, W:  6 },

  // ── ŚNIADANIA 51–60 ───────────────────────────────────────────────────────
  { id: 51, nazwa: 'Jajka po turecku',             czas: 12, opis: 'kremowe, czosnkowe',      skladniki: 'jajka, jogurt grecki, czosnek, masło, papryka', przygotowanie: 'Ugotuj jajka w koszulce. Wymieszaj jogurt z czosnkiem. Polej masłem z papryką.', kcal: 310, B: 22, T: 18, W: 8 },
  { id: 52, nazwa: 'Omlet z łososiem',             czas: 12, opis: 'tłusty, sycący',          skladniki: 'jajka, łosoś wędzony, śmietana, koperek', przygotowanie: 'Roztrzep jajka ze śmietaną, wlej na patelnię, dodaj łososia.',  kcal: 380, B: 32, T: 26, W:  2 },
  { id: 53, nazwa: 'Pasta z awokado i jajka',      czas:  8, opis: 'kremowa, zdrowa',         skladniki: 'awokado, jajka ugotowane, cytryna, sól',  przygotowanie: 'Rozgnieć awokado widelcem, dodaj posiekane jajka i sok z cytryny.', kcal: 320, B: 14, T: 26, W: 4 },
  { id: 54, nazwa: 'Jogurt grecki z nasionami',    czas:  5, opis: 'szybkie, odżywcze',       skladniki: 'jogurt grecki, nasiona chia, nasiona lnu', przygotowanie: 'Wlej jogurt, posyp nasionami, dodaj odrobinę miodu.',            kcal: 290, B: 18, T: 14, W: 14 },
  { id: 55, nazwa: 'Tofu scramble',                czas: 10, opis: 'wegańska jajecznica',     skladniki: 'tofu twarde, kurkuma, sos sojowy, warzywa', przygotowanie: 'Pokrusz tofu, podsmaż z kurkumą i sosem sojowym.',             kcal: 240, B: 16, T: 14, W:  8 },
  { id: 56, nazwa: 'Placuszki migdałowe',          czas: 15, opis: 'delikatne, low carb',     skladniki: 'mąka migdałowa, jajka, masło, erytrytol', przygotowanie: 'Wymieszaj składniki, smaż małe placuszki na patelni.',           kcal: 340, B: 12, T: 28, W:  6 },
  { id: 57, nazwa: 'Smoothie kokosowo-kakaowe',    czas:  5, opis: 'deserowe, kremowe',       skladniki: 'mleko kokosowe, kakao, banan, lód',       przygotowanie: 'Zblenduj wszystkie składniki na gładko.',                        kcal: 260, B:  4, T: 16, W: 18 },
  { id: 58, nazwa: 'Twarożek z rzodkiewką',        czas:  5, opis: 'świeże, lekkie',          skladniki: 'twaróg, rzodkiewki, szczypiorek, sól',    przygotowanie: 'Pokrój rzodkiewki, wymieszaj z twarożkiem i szczypiorkiem.',    kcal: 200, B: 16, T: 10, W:  6 },
  { id: 59, nazwa: 'Jajka w koszulce + szpinak',  czas: 10, opis: 'lekkie, eleganckie',      skladniki: 'jajka, świeży szpinak, oliwa, czosnek',   przygotowanie: 'Usmaś szpinak z czosnkiem. Ugotuj jajka w koszulce, ułóż na szpinaku.', kcal: 280, B: 22, T: 16, W: 4 },
  { id: 60, nazwa: 'Mus z mascarpone',             czas:  5, opis: 'kremowy, keto',           skladniki: 'mascarpone, erytrytol, wanilia',           przygotowanie: 'Ubij mascarpone z erytrytolem i wanilią na puszysty krem.',     kcal: 340, B:  6, T: 30, W:  4 },

  // ── OBIADY 61–70 ──────────────────────────────────────────────────────────
  { id: 61, nazwa: 'Kurczak curry z kalafiorem',   czas: 25, opis: 'aromatyczny, low carb',   skladniki: 'kurczak, kalafior, mleko kokosowe, curry', przygotowanie: 'Usmaż kurczaka, dodaj kalafior i mleko kokosowe z curry, duś 15 min.', kcal: 380, B: 40, T: 18, W: 10 },
  { id: 62, nazwa: 'Krewetki czosnkowe',           czas: 10, opis: 'szybkie, eleganckie',     skladniki: 'krewetki, czosnek, masło, natka, cytryna', przygotowanie: 'Podsmaż czosnek na maśle, dodaj krewetki, smaż 3 min, skrop cytryną.', kcal: 280, B: 28, T: 14, W: 4 },
  { id: 63, nazwa: 'Tofu w sosie sojowym',         czas: 15, opis: 'azjatyckie, wegańskie',   skladniki: 'tofu twarde, sos sojowy, imbir, sezam',   przygotowanie: 'Podsmaż tofu na złoto, polej sosem sojowym z imbirem.',          kcal: 300, B: 18, T: 16, W: 10 },
  { id: 64, nazwa: 'Gulasz wołowy',                czas: 60, opis: 'klasyczny, rozgrzewający', skladniki: 'wołowina, cebula, papryka, pomidory, zioła', przygotowanie: 'Podsmaż mięso z cebulą, dodaj warzywa i przyprawy, duś 45 min.', kcal: 480, B: 38, T: 28, W: 12 },
  { id: 65, nazwa: 'Zupa kokosowa tom kha',        czas: 25, opis: 'azjatycka, kremowa',      skladniki: 'mleko kokosowe, kurczak, pieczarki, trawa cytrynowa', przygotowanie: 'Zagotuj mleko kokosowe z trawą cytrynową, dodaj kurczaka i pieczarki.', kcal: 320, B: 22, T: 24, W: 8 },
  { id: 66, nazwa: 'Kurczak pieczony z ziołami',   czas: 45, opis: 'prosty, aromatyczny',     skladniki: 'kurczak, rozmaryn, tymianek, czosnek, oliwa', przygotowanie: 'Natrzyj kurczaka ziołami i oliwą, piecz w 190°C przez 40 min.', kcal: 380, B: 44, T: 18, W: 2 },
  { id: 67, nazwa: 'Sałatka z grillowanym serem',  czas: 15, opis: 'sycąca, wegetariańska',   skladniki: 'ser halloumi, sałata, pomidorki, rukola',  przygotowanie: 'Grilluj halloumi 3 min z każdej strony, ułóż na sałacie.',       kcal: 360, B: 20, T: 26, W:  8 },
  { id: 68, nazwa: 'Makaron z bakłażana',          czas: 20, opis: 'lekki zamiennik',         skladniki: 'bakłażan, pomidory, czosnek, bazylia',    przygotowanie: 'Usmaż bakłażan w plastry, podaj z sosem pomidorowym.',           kcal: 260, B:  8, T: 14, W: 14 },
  { id: 69, nazwa: 'Pulpeciki w sosie pomidorowym', czas: 30, opis: 'klasyczne, rodzinne',    skladniki: 'mięso mielone, jajko, sos pomidorowy, bazylia', przygotowanie: 'Uformuj pulpeciki, obsmaż, gotuj w sosie pomidorowym 20 min.', kcal: 400, B: 32, T: 22, W: 14 },
  { id: 70, nazwa: 'Ryba pieczona z cytryną',      czas: 25, opis: 'lekka, śródziemnomorska', skladniki: 'dorsz lub tilapia, cytryna, oliwa, zioła', przygotowanie: 'Skrop rybę oliwą i cytryną, posyp ziołami, piecz 20 min w 180°C.', kcal: 280, B: 38, T: 10, W: 2 },

  // ── KOLACJE 71–75 ─────────────────────────────────────────────────────────
  { id: 71, nazwa: 'Sałatka z grillowanym kurczakiem', czas: 15, opis: 'szybka, sycąca', skladniki: 'kurczak, sałata, ogórek, sos vinaigrette', przygotowanie: 'Usmaż kurczaka, pokrój, wymieszaj z sałatą i sosem.',           kcal: 280, B: 28, T: 14, W:  6 },
  { id: 72, nazwa: 'Krem z cukinii',               czas: 20, opis: 'lekki, delikatny',         skladniki: 'cukinia, cebula, bulion, śmietana',       przygotowanie: 'Podsmaż cebulę, dodaj cukinię i bulion, gotuj 15 min, zblenduj.', kcal: 180, B: 6, T: 10, W: 10 },
  { id: 73, nazwa: 'Jajka faszerowane',            czas: 15, opis: 'klasyczne, keto',          skladniki: 'jajka, majonez, musztarda, szczypiorek',  przygotowanie: 'Ugotuj jajka, wyjmij żółtka, wymieszaj z majonezem, nadziej.',  kcal: 240, B: 16, T: 18, W:  2 },
  { id: 74, nazwa: 'Sałatka z awokado i tuńczykiem', czas: 10, opis: 'tłusta, keto',         skladniki: 'tuńczyk, awokado, cebula czerwona, oliwa', przygotowanie: 'Pokrój awokado, wymieszaj z odsączonym tuńczykiem i cebulą.',   kcal: 320, B: 24, T: 22, W:  4 },
  { id: 75, nazwa: 'Warzywa pieczone',             czas: 30, opis: 'łatwe, zdrowe',            skladniki: 'cukinia, papryka, cebula, oliwa, zioła',  przygotowanie: 'Pokrój warzywa, skrop oliwą, piecz 25 min w 200°C.',            kcal: 200, B:  4, T: 10, W: 16 },

  // ── DESERY 76–80 ──────────────────────────────────────────────────────────
  { id: 76, nazwa: 'Brownie low carb',             czas: 35, opis: 'czekoladowe, wilgotne',    skladniki: 'kakao, masło, jajka, erytrytol, orzechy', przygotowanie: 'Rozpuść masło z kakao, dodaj jajka i erytrytol, piecz 25 min.', kcal: 260, B: 10, T: 20, W:  6 },
  { id: 77, nazwa: 'Krem waniliowy',               czas: 10, opis: 'lekki, delikatny',         skladniki: 'śmietanka 30%, erytrytol, wanilia',       przygotowanie: 'Ubij śmietankę z erytrytolem i wanilią na gęsty krem.',         kcal: 240, B:  4, T: 20, W:  6 },
  { id: 78, nazwa: 'Lody kokosowe',                czas: 15, opis: 'mrożone, wegańskie',       skladniki: 'mleko kokosowe, erytrytol, owoce',        przygotowanie: 'Wymieszaj mleko kokosowe z erytrytolem i owocami, mroź 4 godz.', kcal: 200, B: 2, T: 14, W: 14 },
  { id: 79, nazwa: 'Sernik na zimno',              czas: 20, opis: 'bez pieczenia, kremowy',    skladniki: 'twaróg, żelatyna, erytrytol, cytryna',    przygotowanie: 'Wymieszaj twaróg z erytrytolem, dodaj żelatynę, schłódź 2 godz.', kcal: 260, B: 14, T: 16, W: 6 },
  { id: 80, nazwa: 'Kulki kakaowe',               czas: 10, opis: 'bez pieczenia, szybkie',    skladniki: 'kakao, masło orzechowe, daktyle, orzechy', przygotowanie: 'Zmiksuj składniki, uformuj kulki, schłódź 30 min.',             kcal: 180, B:  4, T: 10, W: 16 },

  // ── PRZEKĄSKI 81–85 ───────────────────────────────────────────────────────
  { id: 81, nazwa: 'Chipsy z cukinii',             czas: 25, opis: 'pieczone, chrupiące',      skladniki: 'cukinia, oliwa, sól, parmezan',           przygotowanie: 'Pokrój cukinię w plastry, piecz 20 min w 200°C do chrupkości.', kcal: 120, B: 4,  T: 6,  W: 8  },
  { id: 82, nazwa: 'Migdały prażone',              czas: 10, opis: 'chrupiące, sycące',        skladniki: 'migdały, sól, papryka lub cynamon',       przygotowanie: 'Praż migdały na suchej patelni 5 min, dopraw.',                  kcal: 200, B: 6,  T: 16, W: 4  },
  { id: 83, nazwa: 'Pasta hummus',                 czas: 15, opis: 'kremowa, wegańska',        skladniki: 'ciecierzyca, tahini, czosnek, oliwa',     przygotowanie: 'Zblenduj wszystkie składniki na gładką pastę.',                  kcal: 180, B: 8,  T: 10, W: 12 },
  { id: 84, nazwa: 'Ser grillowany',               czas: 10, opis: 'tłusty, sycący',           skladniki: 'ser halloumi lub oscypek',                przygotowanie: 'Grilluj plastry sera 2–3 min z każdej strony.',                   kcal: 220, B: 12, T: 18, W:  2 },
  { id: 85, nazwa: 'Jajka marynowane',             czas: 20, opis: 'kwaśne, do przegryzienia', skladniki: 'jajka, ocet jabłkowy, sól, zioła',        przygotowanie: 'Ugotuj jajka na twardo, marynuj w zalewie minimum 12 godz.',    kcal: 160, B: 13, T: 10, W:  2 },

  // ── SZYBKIE 86–90 ─────────────────────────────────────────────────────────
  { id: 86, nazwa: 'Omlet z warzywami',            czas: 10, opis: 'szybki, kolorowy',         skladniki: 'jajka, szpinak, papryka, ser',            przygotowanie: 'Podsmaż warzywa, wlej jajka, posyp serem, złóż.',               kcal: 300, B: 20, T: 20, W:  6 },
  { id: 87, nazwa: 'Sałatka caprese',              czas:  5, opis: 'świeża, włoska',           skladniki: 'mozzarella, pomidory, bazylia, oliwa',    przygotowanie: 'Ułóż na przemian pomidory i mozzarellę, polej oliwą, posyp bazylią.', kcal: 300, B: 16, T: 22, W: 6 },
  { id: 88, nazwa: 'Wrap z sałaty i indyka',       czas: 10, opis: 'lekki, szybki',            skladniki: 'sałata masłowa, indyk wędzone, awokado',  przygotowanie: 'Ułóż indyka i awokado na liściu sałaty, zwiń.',                  kcal: 260, B: 24, T: 14, W:  4 },
  { id: 89, nazwa: 'Stir-fry z kurczakiem',        czas: 15, opis: 'szybkie, pożywne',         skladniki: 'kurczak, brokuł, marchew, sos sojowy',    przygotowanie: 'Smaż kurczaka na woku, dodaj warzywa i sos sojowy.',             kcal: 320, B: 36, T: 12, W:  8 },
  { id: 90, nazwa: 'Krem z awokado z warzywami',   czas:  5, opis: 'szybki, zdrowy dip',       skladniki: 'awokado, czosnek, limonka, marchewka',    przygotowanie: 'Zblenduj awokado z czosnkiem i limonką. Podaj z marchewką.',      kcal: 200, B:  4, T: 16, W:  6 },

  // ── RÓŻNE / BAZOWE 91–95 ──────────────────────────────────────────────────
  { id: 91, nazwa: 'Placki z cukinii',             czas: 20, opis: 'lekkie, chrupiące',        skladniki: 'cukinia, jajka, mąka migdałowa, ser',     przygotowanie: 'Zetrzyj cukinię, odciśnij wodę, wymieszaj ze składnikami, smaż.', kcal: 260, B: 14, T: 16, W: 8 },
  { id: 92, nazwa: 'Frytki z dyni',               czas: 30, opis: 'pieczone, słodkie',         skladniki: 'dynia, oliwa, sól, cynamon',              przygotowanie: 'Pokrój dynię w słupki, skrop oliwą, piecz 25 min w 200°C.',      kcal: 150, B:  2, T:  6, W: 16 },
  { id: 93, nazwa: 'Sałatka coleslaw',             czas: 15, opis: 'klasyczna, chrupiąca',     skladniki: 'kapusta biała, marchew, majonez, ocet',   przygotowanie: 'Poszatkuj kapustę i marchew, wymieszaj z majonezem i octem.',    kcal: 180, B:  2, T: 12, W: 10 },
  { id: 94, nazwa: 'Rosół z kurczaka',             czas: 60, opis: 'tradycyjny, rozgrzewający', skladniki: 'kurczak, marchew, seler, pietruszka, zioła', przygotowanie: 'Gotuj kurczaka z warzywami minimum 45 min na wolnym ogniu.',  kcal: 220, B: 20, T:  8, W:  8 },
  { id: 95, nazwa: 'Ryż konjac',                  czas: 10, opis: 'bez kalorii, zamiennik',    skladniki: 'ryż konjac, oliwa, sól',                  przygotowanie: 'Opłucz ryż konjac, podsmaż na patelni z oliwą 5 min.',           kcal:  60, B:  1, T:  2, W:  4 },

  // ── BONUS 96–100 ──────────────────────────────────────────────────────────
  { id: 96,  nazwa: 'Pancakes kokosowe',           czas: 15, opis: 'słodkie, puszysty',        skladniki: 'wiórki kokosowe, jajka, erytrytol, śmietanka', przygotowanie: 'Wymieszaj składniki, smaż małe placki na maśle.', kcal: 300, B: 8, T: 22, W: 8 },
  { id: 97,  nazwa: 'Burger z indyka',             czas: 20, opis: 'lekki, wysokobiałkowy',    skladniki: 'mięso mielone z indyka, sałata, pomidor', przygotowanie: 'Uformuj kotlet, usmaż, podaj z sałatą i pomidorem.',              kcal: 360, B: 38, T: 16, W:  6 },
  { id: 98,  nazwa: 'Zapiekanka z kalafiora',      czas: 40, opis: 'kremowa, sycąca',          skladniki: 'kalafior, śmietana, ser żółty, czosnek',   przygotowanie: 'Ugotuj kalafior, przełóż do naczynia, polej śmietaną z serem, piecz 20 min.', kcal: 320, B: 16, T: 22, W: 10 },
  { id: 99,  nazwa: 'Smoothie malinowe',           czas:  5, opis: 'świeże, orzeźwiające',     skladniki: 'maliny, jogurt grecki, mleko, erytrytol',  przygotowanie: 'Zblenduj wszystkie składniki na gładko.',                        kcal: 200, B: 10, T:  4, W: 22 },
  { id: 100, nazwa: 'Mus czekoladowy keto',        czas: 10, opis: 'kremowy, intensywny',      skladniki: 'kakao, śmietanka 36%, erytrytol, wanilia', przygotowanie: 'Ubij śmietankę na sztywno, wmieszaj kakao i erytrytol.',          kcal: 240, B:  6, T: 20, W:  4 },

  // ── ŚNIADANIA 101–120 ─────────────────────────────────────────────────────
  { id: 101, nazwa: 'Omlet z ricottą i cytryną',       czas: 12, opis: 'lekki, świeży',        skladniki: 'jajka, ricotta, skórka cytrynowa, masło',                 przygotowanie: 'Roztrzep jajka, wmieszaj ricottę i skórkę cytrynową. Wlej na patelnię i smaż pod przykryciem.',                kcal: 320, B: 22, T: 22, W:  4 },
  { id: 102, nazwa: 'Jajka z pastą tahini',            czas:  8, opis: 'kremowe, orientalne',  skladniki: 'jajka, tahini, sok z cytryny, sól, sezam',                przygotowanie: 'Usmaż jajka sadzone. Rozcieńcz tahini z cytryną i solą. Polej pastą.',                                       kcal: 340, B: 18, T: 28, W:  3 },
  { id: 103, nazwa: 'Jogurt z masłem orzechowym',      czas:  5, opis: 'sycące, kremowe',      skladniki: 'jogurt grecki, masło orzechowe, orzechy, miód',           przygotowanie: 'Przełóż jogurt do miseczki, dodaj łyżkę masła orzechowego, posyp orzechami.',                                kcal: 310, B: 14, T: 18, W: 14 },
  { id: 104, nazwa: 'Twarożek z ogórkiem',             czas:  5, opis: 'świeży, lekki',        skladniki: 'twaróg półtłusty, ogórek, koper, sól, pieprz',           przygotowanie: 'Pokrój ogórek w kostkę, wymieszaj z twarożkiem i koperem. Dopraw.',                                          kcal: 200, B: 16, T: 10, W:  6 },
  { id: 105, nazwa: 'Omlet z pieczarkami',             czas: 12, opis: 'wytrawny, sycący',     skladniki: 'jajka, pieczarki, cebula, masło, natka pietruszki',      przygotowanie: 'Podsmaż pieczarki z cebulą. Wlej roztrzepane jajka, smaż do ścięcia, złóż omlet.',                           kcal: 280, B: 22, T: 18, W:  4 },
  { id: 106, nazwa: 'Smoothie truskawkowe',            czas:  5, opis: 'lekkie, owocowe',      skladniki: 'truskawki, banan, jogurt, mleko',                        przygotowanie: 'Zblenduj wszystkie składniki na gładko. Podaj od razu.',                                                       kcal: 180, B:  6, T:  2, W: 28 },
  { id: 107, nazwa: 'Jajka z pomidorami i oliwą',      czas:  6, opis: 'śródziemnomorski',     skladniki: 'jajka, pomidory, oliwa z oliwek, zioła prowansalskie',   przygotowanie: 'Usmaż jajka na oliwie. Podaj z pokrojonymi pomidorami i ziołami.',                                            kcal: 280, B: 16, T: 20, W:  6 },
  { id: 108, nazwa: 'Koktajl proteinowy waniliowy',    czas:  5, opis: 'szybki, białkowy',     skladniki: 'białko waniliowe, mleko, lód, wanilia',                  przygotowanie: 'Zblenduj białko z mlekiem i lodem na jednolitą masę.',                                                         kcal: 220, B: 30, T:  4, W:  8 },
  { id: 109, nazwa: 'Omlet z mozzarellą',              czas: 10, opis: 'ciągnący, kremowy',    skladniki: 'jajka, mozzarella, masło, bazylia',                      przygotowanie: 'Wlej jajka na patelnię, posyp startą mozzarellą, złóż omlet gdy ser się stopi.',                              kcal: 380, B: 28, T: 28, W:  2 },
  { id: 110, nazwa: 'Pudding kokosowy z kakao',        czas:  5, opis: 'deserowy, wegański',   skladniki: 'mleko kokosowe, kakao, erytrytol, nasiona chia',          przygotowanie: 'Wymieszaj wszystkie składniki, odstaw do lodówki na co najmniej godzinę.',                                   kcal: 280, B:  4, T: 20, W: 16 },
  { id: 111, nazwa: 'Jajka z masłem klarowanym',       czas:  7, opis: 'tłuste, keto',         skladniki: 'jajka, masło klarowane (ghee), sól morska, pieprz',      przygotowanie: 'Roztop ghee na patelni, usmaż jajka do ulubionej konsystencji. Dopraw solą morską.',                          kcal: 340, B: 18, T: 28, W:  1 },
  { id: 112, nazwa: 'Serek wiejski z borówkami',       czas:  5, opis: 'lekki, owocowy',       skladniki: 'serek wiejski, borówki, miód, mięta',                    przygotowanie: 'Przełóż serek do miseczki, ułóż borówki, skrop miodem i udekoruj miętą.',                                   kcal: 180, B: 12, T:  6, W: 16 },
  { id: 113, nazwa: 'Omlet z kurczakiem',              czas: 12, opis: 'białkowy, sycący',     skladniki: 'jajka, kurczak gotowany, szpinak, czosnek, oliwa',       przygotowanie: 'Podsmaż kurczaka ze szpinakiem. Wlej jajka, smaż pod przykryciem do ścięcia.',                                kcal: 360, B: 38, T: 20, W:  2 },
  { id: 114, nazwa: 'Twarożek z łososiem wędzonym',    czas:  5, opis: 'premium, keto',        skladniki: 'twaróg, łosoś wędzony, kapary, koper, cytryna',          przygotowanie: 'Wymieszaj twaróg z pokrojonym łososiem, kaparami i koperem. Skrop cytryną.',                                 kcal: 280, B: 24, T: 18, W:  2 },
  { id: 115, nazwa: 'Smoothie zielone z awokado',      czas:  5, opis: 'kremowe, wegańskie',   skladniki: 'awokado, szpinak, banan, mleko roślinne, imbir',         przygotowanie: 'Zblenduj wszystkie składniki na jednolitą, gładką masę.',                                                      kcal: 260, B:  4, T: 18, W: 14 },
  { id: 116, nazwa: 'Omlet kakaowy',                   czas: 10, opis: 'słodki, low carb',     skladniki: 'jajka, kakao, erytrytol, masło, śmietanka',              przygotowanie: 'Roztrzep jajka z kakao i erytrytolem. Wlej na patelnię z masłem, smaż powoli.',                               kcal: 300, B: 20, T: 20, W:  6 },
  { id: 117, nazwa: 'Jajka z pesto',                   czas:  6, opis: 'aromatyczne, keto',    skladniki: 'jajka, pesto bazyliowe, parmezan, listki bazylii',       przygotowanie: 'Usmaż jajka sadzone. Nałóż łyżkę pesto, posyp parmezanem.',                                                  kcal: 320, B: 18, T: 26, W:  2 },
  { id: 118, nazwa: 'Jogurt z migdałami',              czas:  5, opis: 'szybkie, chrupiące',   skladniki: 'jogurt naturalny, migdały, cynamon, miód',               przygotowanie: 'Przełóż jogurt do miseczki, posyp migdałami i cynamonem, skrop miodem.',                                     kcal: 280, B: 12, T: 16, W: 16 },
  { id: 119, nazwa: 'Omlet ze szpinakiem',             czas: 12, opis: 'zielony, zdrowy',      skladniki: 'jajka, świeży szpinak, czosnek, oliwa, sól',             przygotowanie: 'Podsmaż szpinak z czosnkiem. Wlej jajka, smaż do ścięcia i złóż.',                                           kcal: 280, B: 22, T: 18, W:  4 },
  { id: 120, nazwa: 'Krem kokosowy z chia',            czas:  5, opis: 'gęsty, wegański',      skladniki: 'mleko kokosowe, nasiona chia, wanilia, erytrytol',        przygotowanie: 'Wymieszaj mleko kokosowe z chia i wanilią. Odstaw na 30 min lub całą noc.',                                  kcal: 260, B:  4, T: 18, W: 14 },

  // ── OBIADY 121–150 ────────────────────────────────────────────────────────
  { id: 121, nazwa: 'Kurczak tikka masala',            czas: 30, opis: 'aromatyczny, indyjski', skladniki: 'kurczak, pomidory, jogurt, curry, czosnek, imbir, śmietanka', przygotowanie: 'Zamarynuj kurczaka w jogurcie i przyprawach. Podsmaż, dodaj sos pomidorowy, duś 20 min.',             kcal: 420, B: 40, T: 22, W: 10 },
  { id: 122, nazwa: 'Wołowina z papryką',              czas: 20, opis: 'szybka, intensywna',   skladniki: 'polędwica wołowa, papryka czerwona i żółta, czosnek, sos sojowy', przygotowanie: 'Pokrój mięso w paski, podsmaż na dużym ogniu. Dodaj paprykę i sos sojowy.',                         kcal: 400, B: 36, T: 24, W:  8 },
  { id: 123, nazwa: 'Krewetki curry',                  czas: 20, opis: 'kokosowe, kremowe',     skladniki: 'krewetki, mleko kokosowe, curry, czosnek, imbir, limonka', przygotowanie: 'Podsmaż czosnek z imbirem, dodaj mleko kokosowe i curry. Wrzuć krewetki, gotuj 5 min.',                   kcal: 320, B: 28, T: 18, W:  8 },
  { id: 124, nazwa: 'Tofu curry z warzywami',          czas: 25, opis: 'wegańskie, kremowe',    skladniki: 'tofu twarde, mleko kokosowe, curry, papryka, cukinia, cebula', przygotowanie: 'Podsmaż tofu na złoto. Przygotuj sos curry z mlekiem kokosowym, dodaj warzywa i tofu, duś 15 min.', kcal: 300, B: 14, T: 16, W: 14 },
  { id: 125, nazwa: 'Kurczak w sosie śmietanowym',     czas: 25, opis: 'kremowy, keto',         skladniki: 'filet z kurczaka, śmietanka 30%, czosnek, tymianek, masło',  przygotowanie: 'Usmaż kurczaka na maśle. Dodaj śmietankę, czosnek i tymianek, duś 10 min na małym ogniu.',            kcal: 440, B: 38, T: 30, W:  4 },
  { id: 126, nazwa: 'Łosoś w sosie koperkowym',        czas: 20, opis: 'delikatny, elegancki',  skladniki: 'filet łososia, koper, śmietana, cytryna, masło',           przygotowanie: 'Usmaż łososia na maśle. Zrób sos ze śmietany, koperku i cytryny. Polej rybę.',                          kcal: 400, B: 38, T: 26, W:  2 },
  { id: 127, nazwa: 'Indyk stir-fry',                  czas: 15, opis: 'szybki, azjatycki',     skladniki: 'filet z indyka, brokuł, marchew, sos sojowy, sezam, imbir',  przygotowanie: 'Pokrój indyka w paski, smaż na woku z warzywami. Dodaj sos sojowy i imbir.',                             kcal: 320, B: 38, T: 12, W:  8 },
  { id: 128, nazwa: 'Sałatka z grillowanym kurczakiem', czas: 15, opis: 'lekka, sycąca',       skladniki: 'filet z kurczaka, sałata mieszana, pomidorki, ogórek, oliwa, balsamico', przygotowanie: 'Grilluj kurczaka 6 min. Pokrój, wymieszaj z sałatą i warzywami. Skrop oliwą.',                  kcal: 280, B: 28, T: 14, W:  6 },
  { id: 129, nazwa: 'Makaron konjac z pesto',          czas: 10, opis: 'szybki, low carb',      skladniki: 'makaron konjac, pesto bazyliowe, parmezan, oliwki',        przygotowanie: 'Opłucz i odsącz makaron konjac. Wymieszaj z pesto, posyp parmezanem.',                                  kcal: 200, B:  6, T: 14, W:  4 },
  { id: 130, nazwa: 'Zupa dyniowa',                    czas: 30, opis: 'kremowa, jesienna',     skladniki: 'dynia hokkaido, cebula, czosnek, bulion, imbir, mleko kokosowe', przygotowanie: 'Upiecz dynię, zblenduj z bulionem, czosnkiem i imbirem. Zakończ łykiem mleka kokosowego.',            kcal: 180, B:  4, T:  6, W: 20 },
  { id: 131, nazwa: 'Gulasz z indyka',                 czas: 40, opis: 'klasyczny, rozgrzewający', skladniki: 'mięso z indyka, cebula, papryka, pomidory, zioła prowansalskie', przygotowanie: 'Podsmaż mięso z cebulą, dodaj paprykę i pomidory. Duś 30 min na małym ogniu.',                   kcal: 380, B: 38, T: 16, W: 12 },
  { id: 132, nazwa: 'Kurczak pieczony z cytryną',      czas: 45, opis: 'prosty, aromatyczny',   skladniki: 'kurczak, cytryna, czosnek, rozmaryn, oliwa, sól',          przygotowanie: 'Natrzyj kurczaka czosnkiem i rozmarynem. Włóż cytrynę do środka, piecz w 190°C przez 40 min.',         kcal: 380, B: 44, T: 18, W:  2 },
  { id: 133, nazwa: 'Ryba z warzywami',                czas: 25, opis: 'lekka, śródziemnomorska', skladniki: 'filet ryby (dorsz/tilapia), cukinia, pomidory, oliwa, zioła', przygotowanie: 'Ułóż rybę na warzywach w naczyniu, skrop oliwą, piecz 20 min w 180°C.',                              kcal: 300, B: 34, T: 12, W: 10 },
  { id: 134, nazwa: 'Wołowina duszona',                czas: 60, opis: 'klasyczna, bogata',      skladniki: 'łopatka wołowa, cebula, marchew, seler, bulion, zioła',   przygotowanie: 'Obsmaż mięso ze wszystkich stron. Dodaj warzywa i bulion, duś na małym ogniu 50 min.',               kcal: 460, B: 40, T: 28, W:  6 },
  { id: 135, nazwa: 'Curry warzywne',                  czas: 25, opis: 'roślinne, aromatyczne',  skladniki: 'ciecierzyca, szpinak, pomidory, mleko kokosowe, curry, czosnek', przygotowanie: 'Podsmaż czosnek z curry. Dodaj ciecierzycę, pomidory i mleko kokosowe. Duś 15 min, wrzuć szpinak.', kcal: 280, B:  8, T: 14, W: 22 },
  { id: 136, nazwa: 'Kurczak z cukinią',               czas: 20, opis: 'lekki, letni',          skladniki: 'filet z kurczaka, cukinia, czosnek, oliwa, bazylia',         przygotowanie: 'Usmaż kurczaka w kawałkach. Dodaj cukinię i czosnek, smaż jeszcze 8 min.',                               kcal: 340, B: 38, T: 16, W:  6 },
  { id: 137, nazwa: 'Tofu grillowane',                 czas: 15, opis: 'chrupiące, wegańskie',   skladniki: 'tofu twarde, sos sojowy, czosnek, sezam, olej sezamowy',  przygotowanie: 'Zamarynuj tofu w sosie sojowym z czosnkiem. Grilluj 4 min z każdej strony.',                            kcal: 260, B: 16, T: 16, W:  6 },
  { id: 138, nazwa: 'Sałatka z jajkiem i boczkiem',    czas: 15, opis: 'klasyczna keto',        skladniki: 'jajka, boczek, sałata, pomidory, majonez, musztarda',     przygotowanie: 'Ugotuj jajka. Podsmaż boczek. Wymieszaj z sałatą i dressingiem.',                                       kcal: 380, B: 22, T: 30, W:  4 },
  { id: 139, nazwa: 'Zupa krem z kalafiora',           czas: 25, opis: 'lekka, kremowa',        skladniki: 'kalafior, cebula, czosnek, bulion, śmietana, gałka muszkatołowa', przygotowanie: 'Ugotuj kalafior z cebulą w bulionie. Zblenduj ze śmietaną i gałką muszkatołową.',                   kcal: 200, B:  8, T: 10, W: 10 },
  { id: 140, nazwa: 'Indyk pieczony',                  czas: 45, opis: 'klasyczny, sycący',      skladniki: 'filet z indyka, masło ziołowe, czosnek, tymianek, rozmaryn',  przygotowanie: 'Natrzyj indyka masłem ziołowym. Piecz w 185°C przez 35 min.',                                          kcal: 360, B: 42, T: 16, W:  2 },
  { id: 141, nazwa: 'Stir-fry z tofu i brokułem',     czas: 15, opis: 'szybkie, wegańskie',     skladniki: 'tofu twarde, brokuł, sos sojowy, czosnek, imbir, sezam',  przygotowanie: 'Podsmaż tofu na złoto. Dodaj brokuł, czosnek i imbir, polej sosem sojowym.',                           kcal: 280, B: 16, T: 14, W: 12 },
  { id: 142, nazwa: 'Łosoś pieczony z warzywami',     czas: 25, opis: 'zdrowy, śródziemnomorski', skladniki: 'filet łososia, cukinia, pomidorki, oliwa, cytryna, koper', przygotowanie: 'Ułóż łososia na blasze z warzywami, skrop oliwą i cytryną. Piecz 20 min w 190°C.',                   kcal: 400, B: 38, T: 24, W:  8 },
  { id: 143, nazwa: 'Kurczak w sosie pomidorowym',     czas: 25, opis: 'klasyczny, sycący',      skladniki: 'filet z kurczaka, pomidory pelati, czosnek, bazylia, oliwa',  przygotowanie: 'Usmaż kurczaka. Przygotuj sos z pomidorów i czosnku. Duś mięso w sosie 15 min.',                      kcal: 340, B: 38, T: 14, W: 10 },
  { id: 144, nazwa: 'Wołowina z czosnkiem',            czas: 20, opis: 'intensywna, szybka',     skladniki: 'polędwica wołowa, czosnek, masło, tymianek, sól morska',  przygotowanie: 'Usmaż wołowinę na maśle z czosnkiem i tymiankiem. Odpoczynek 5 min przed krojeniem.',               kcal: 380, B: 36, T: 24, W:  4 },
  { id: 145, nazwa: 'Tofu w sosie curry',              czas: 25, opis: 'kremowe, wegańskie',      skladniki: 'tofu twarde, mleko kokosowe, pasta curry, cebula, czosnek', przygotowanie: 'Podsmaż cebulę z czosnkiem i pastą curry. Dodaj mleko kokosowe i tofu, duś 15 min.',                  kcal: 300, B: 14, T: 16, W: 14 },
  { id: 146, nazwa: 'Zupa jarzynowa low carb',         czas: 30, opis: 'lekka, odżywcza',        skladniki: 'cukinia, kalafior, seler naciowy, bulion, czosnek, zioła', przygotowanie: 'Pokrój warzywa, gotuj w bulionie z czosnkiem i ziołami 20 min.',                                        kcal: 160, B:  6, T:  6, W: 12 },
  { id: 147, nazwa: 'Kurczak z papryką',               czas: 20, opis: 'kolorowy, szybki',       skladniki: 'filet z kurczaka, papryka czerwona i żółta, cebula, oliwa', przygotowanie: 'Podsmaż kurczaka, dodaj paprykę i cebulę, smaż razem 10 min.',                                           kcal: 340, B: 38, T: 14, W:  8 },
  { id: 148, nazwa: 'Ryba smażona na maśle',           czas: 15, opis: 'klasyczna, keto',        skladniki: 'filet ryby, masło, czosnek, koper, cytryna, sól',         przygotowanie: 'Smaż rybę na maśle 4 min z każdej strony. Skrop cytryną, posyp koperkiem.',                             kcal: 360, B: 36, T: 22, W:  2 },
  { id: 149, nazwa: 'Wołowina z warzywami',            czas: 25, opis: 'sycąca, białkowa',       skladniki: 'wołowina, brokuł, marchew, sos sojowy, czosnek',          przygotowanie: 'Podsmaż wołowinę na dużym ogniu. Dodaj warzywa i sos sojowy, smaż razem 5 min.',                      kcal: 400, B: 38, T: 24, W:  8 },
  { id: 150, nazwa: 'Curry kokosowe z kurczakiem',     czas: 25, opis: 'aromatyczne, kremowe',   skladniki: 'filet z kurczaka, mleko kokosowe, pasta curry, limonka, kolendra', przygotowanie: 'Podsmaż kurczaka. Dodaj pastę curry i mleko kokosowe, duś 15 min. Skrop limonką.',                kcal: 420, B: 36, T: 28, W:  8 },

  // ── KOLACJE 151–165 ───────────────────────────────────────────────────────
  { id: 151, nazwa: 'Sałatka z awokado i kurczakiem',  czas: 15, opis: 'sycąca, keto',          skladniki: 'kurczak grillowany, awokado, rukola, pomidorki, oliwa, limonka', przygotowanie: 'Pokrój kurczaka i awokado. Wymieszaj z rukolą i pomidorkami. Skrop oliwą i limonką.',              kcal: 340, B: 28, T: 22, W:  6 },
  { id: 152, nazwa: 'Zupa krem z brokuła',             czas: 20, opis: 'lekka, zielona',         skladniki: 'brokuł, cebula, bulion warzywny, śmietana, gałka muszkatołowa', przygotowanie: 'Ugotuj brokuł z cebulą. Zblenduj z bulionem i śmietaną. Dopraw gałką.',                             kcal: 200, B:  8, T: 10, W: 10 },
  { id: 153, nazwa: 'Jajka zapiekane',                 czas: 15, opis: 'proste, keto',           skladniki: 'jajka, śmietanka, szpinak, sól, parmezan',                przygotowanie: 'Ułóż szpinak w naczyniu do zapiekania. Wbij jajka, polej śmietanką. Piecz 12 min w 180°C.',          kcal: 280, B: 20, T: 20, W:  2 },
  { id: 154, nazwa: 'Sałatka z tuńczykiem',            czas: 10, opis: 'szybka, sycąca',         skladniki: 'tuńczyk w sosie własnym, sałata, ogórek, kukurydza, oliwa', przygotowanie: 'Odsącz tuńczyka, wymieszaj z warzywami, skrop oliwą.',                                                kcal: 260, B: 26, T: 12, W:  8 },
  { id: 155, nazwa: 'Warzywa grillowane',              czas: 20, opis: 'lekkie, zdrowe',         skladniki: 'cukinia, bakłażan, papryka, cebula, oliwa, zioła',        przygotowanie: 'Pokrój warzywa w plastry, skrop oliwą. Grilluj 4 min z każdej strony.',                                kcal: 160, B:  4, T:  8, W: 14 },
  { id: 156, nazwa: 'Sałatka z mozzarellą',            czas: 10, opis: 'świeża, włoska',         skladniki: 'mozzarella, pomidory, rukola, oliwa, balsamico, bazylia',  przygotowanie: 'Ułóż mozzarellę z pomidorami na rukolą. Polej oliwą i balsamico.',                                    kcal: 280, B: 14, T: 20, W:  8 },
  { id: 157, nazwa: 'Krem z pomidorów',                czas: 20, opis: 'klasyczny, rozgrzewający', skladniki: 'pomidory pelati, cebula, czosnek, bulion, bazylia, oliwa', przygotowanie: 'Podsmaż cebulę z czosnkiem, dodaj pomidory i bulion. Gotuj 15 min, zblenduj.',                         kcal: 180, B:  6, T:  8, W: 14 },
  { id: 158, nazwa: 'Jajka z awokado',                 czas: 10, opis: 'tłuste, keto',           skladniki: 'jajka, awokado, sól, pieprz, sok z limonki, natka',       przygotowanie: 'Usmaż jajka sadzone. Pokrój awokado, dopraw limonką. Podaj razem.',                                    kcal: 320, B: 18, T: 26, W:  4 },
  { id: 159, nazwa: 'Sałatka z indykiem',              czas: 15, opis: 'lekka, szybka',          skladniki: 'indyk pieczony, sałata lodowa, ogórek, sos vinaigrette',   przygotowanie: 'Pokrój indyka, wymieszaj z sałatą i ogórkiem. Polej dressingiem.',                                    kcal: 260, B: 26, T: 12, W:  6 },
  { id: 160, nazwa: 'Zupa kokosowa',                   czas: 20, opis: 'azjatycka, wegańska',    skladniki: 'mleko kokosowe, pieczarki, szpinak, imbir, trawa cytrynowa, limonka', przygotowanie: 'Zagotuj mleko kokosowe z trawą cytrynową i imbirem. Dodaj pieczarki i szpinak.',             kcal: 260, B:  4, T: 20, W: 10 },
  { id: 161, nazwa: 'Sałatka jajeczna',                czas: 10, opis: 'klasyczna, kremowa',      skladniki: 'jajka ugotowane, majonez, musztarda, szczypiorek, sałata', przygotowanie: 'Posiekaj jajka, wymieszaj z majonezem i musztardą. Ułóż na sałacie.',                                  kcal: 280, B: 16, T: 22, W:  2 },
  { id: 162, nazwa: 'Warzywa z hummusem',              czas: 10, opis: 'lekka, wegańska',         skladniki: 'marchewka, seler naciowy, papryka, hummus gotowy',         przygotowanie: 'Pokrój warzywa w słupki. Podaj z hummusem jako dipem.',                                               kcal: 200, B:  6, T: 10, W: 14 },
  { id: 163, nazwa: 'Zupa krem z cukinii',             czas: 20, opis: 'lekka, delikatna',        skladniki: 'cukinia, cebula, czosnek, bulion, śmietana, ser topiony', przygotowanie: 'Podsmaż cebulę, dodaj cukinię i bulion. Gotuj 15 min, zblenduj ze śmietaną.',                          kcal: 180, B:  6, T:  8, W: 12 },
  { id: 164, nazwa: 'Sałatka z łososiem',             czas: 15, opis: 'premium, keto',           skladniki: 'łosoś wędzony, awokado, ogórek, kapary, koper, oliwa',    przygotowanie: 'Ułóż łososia z awokado i ogórkiem. Posyp kaparami i koperkiem, skrop oliwą.',                       kcal: 340, B: 28, T: 22, W:  6 },
  { id: 165, nazwa: 'Sałatka z tofu',                  czas: 10, opis: 'roślinne, lekkie',        skladniki: 'tofu jedwabiste, sałata, ogórek, sos sojowy, sezam',      przygotowanie: 'Pokrój tofu, wymieszaj z sałatą i ogórkiem. Polej sosem sojowym, posyp sezamem.',                   kcal: 240, B: 14, T: 14, W:  8 },

  // ── DESERY 166–180 ────────────────────────────────────────────────────────
  { id: 166, nazwa: 'Brownie kokosowe',                czas: 30, opis: 'wilgotne, low carb',     skladniki: 'wiórki kokosowe, kakao, jajka, erytrytol, masło kokosowe', przygotowanie: 'Wymieszaj składniki. Przełóż do formy, piecz w 175°C przez 22 min.',                                    kcal: 280, B:  8, T: 22, W:  8 },
  { id: 167, nazwa: 'Krem czekoladowy',                czas: 10, opis: 'szybki, intensywny',     skladniki: 'kakao, awokado, erytrytol, wanilia, mleko kokosowe',       przygotowanie: 'Zblenduj awokado z kakao, erytrytolem i mlekiem kokosowym na gładki krem.',                          kcal: 240, B:  6, T: 18, W: 10 },
  { id: 168, nazwa: 'Lody śmietankowe keto',           czas: 15, opis: 'kremowe, keto',          skladniki: 'śmietanka 36%, erytrytol, wanilia, żółtka',               przygotowanie: 'Ubij śmietankę z żółtkami i erytrytolem. Przełóż do pojemnika, mroź 4 godz.',                        kcal: 280, B:  4, T: 24, W:  4 },
  { id: 169, nazwa: 'Sernik waniliowy',                czas: 60, opis: 'klasyczny, bez cukru',   skladniki: 'twaróg, jajka, śmietana, erytrytol, wanilia, masło',      przygotowanie: 'Wymieszaj składniki na gładko. Wlej do formy, piecz w 160°C przez 45 min.',                           kcal: 300, B: 14, T: 20, W:  8 },
  { id: 170, nazwa: 'Kulki kokosowe',                  czas: 10, opis: 'szybkie, bez pieczenia', skladniki: 'wiórki kokosowe, masło kokosowe, erytrytol, wanilia',      przygotowanie: 'Wymieszaj składniki, uformuj małe kulki. Obtocz w wiórk ach kokosowych.',                            kcal: 200, B:  2, T: 16, W:  8 },
  { id: 171, nazwa: 'Mus malinowy',                    czas:  5, opis: 'lekki, owocowy',         skladniki: 'maliny, erytrytol, śmietanka, sok z cytryny',             przygotowanie: 'Zblenduj maliny, przelej przez sitko. Dodaj erytrytol i śmietankę, wymieszaj.',                      kcal: 120, B:  2, T:  6, W: 14 },
  { id: 172, nazwa: 'Deser chia waniliowy',            czas:  5, opis: 'nocny, wegański',        skladniki: 'nasiona chia, mleko migdałowe, wanilia, erytrytol, owoce', przygotowanie: 'Wymieszaj chia z mlekiem i wanilią. Odstaw na noc. Udekoruj owocami.',                                 kcal: 200, B:  6, T: 10, W: 16 },
  { id: 173, nazwa: 'Ciasto czekoladowe keto',         czas: 40, opis: 'wilgotne, intensywne',   skladniki: 'kakao, mąka migdałowa, jajka, erytrytol, masło, proszek do pieczenia', przygotowanie: 'Wymieszaj suche składniki z mokrymi. Piecz w 175°C przez 30 min.',                           kcal: 300, B: 10, T: 24, W:  6 },
  { id: 174, nazwa: 'Krem mascarpone',                 czas:  5, opis: 'kremowy, luksusowy',     skladniki: 'mascarpone, erytrytol, wanilia, skórka cytrynowa',        przygotowanie: 'Ubij mascarpone z erytrytolem, wanilią i skórką cytrynową na puszysty krem.',                         kcal: 340, B:  6, T: 32, W:  4 },
  { id: 175, nazwa: 'Pudding czekoladowy',             czas: 10, opis: 'szybki, low carb',       skladniki: 'kakao, nasiona chia, mleko kokosowe, erytrytol',           przygotowanie: 'Wymieszaj kakao z mlekiem kokosowym i erytrytolem. Dodaj chia, odstaw 10 min.',                     kcal: 220, B:  8, T: 14, W: 10 },
  { id: 176, nazwa: 'Lody truskawkowe',                czas: 10, opis: 'świeże, owocowe',        skladniki: 'truskawki mrożone, banan, jogurt roślinny, erytrytol',    przygotowanie: 'Zblenduj mrożone truskawki z bananem i jogurtem. Podaj od razu.',                                    kcal: 160, B:  2, T:  2, W: 28 },
  { id: 177, nazwa: 'Sernik na zimno kokosowy',        czas: 20, opis: 'kremowy, bez pieczenia', skladniki: 'twaróg, mleko kokosowe, żelatyna, erytrytol, wanilia',    przygotowanie: 'Wymieszaj twaróg z mlekiem kokosowym i erytrytolem. Dodaj żelatynę, schłódź 2 godz.',            kcal: 280, B: 10, T: 20, W: 10 },
  { id: 178, nazwa: 'Kulki proteinowe',                czas: 10, opis: 'szybkie, białkowe',      skladniki: 'białko w proszku, masło orzechowe, płatki owsiane, miód',  przygotowanie: 'Wymieszaj składniki, uformuj kulki, schłódź 20 min w lodówce.',                                    kcal: 200, B: 16, T:  8, W: 12 },
  { id: 179, nazwa: 'Mus kokosowy',                    czas:  5, opis: 'lekki, wegański',        skladniki: 'mleko kokosowe pełnotłuste, erytrytol, wanilia, limonka',  przygotowanie: 'Ubij schłodzone mleko kokosowe z erytrytolem i wanilią na pianę.',                                  kcal: 220, B:  2, T: 18, W:  8 },
  { id: 180, nazwa: 'Ciasto jogurtowe',                czas: 50, opis: 'lekkie, wilgotne',       skladniki: 'jogurt grecki, jajka, mąka migdałowa, erytrytol, skórka cytrynowa', przygotowanie: 'Wymieszaj wszystkie składniki. Piecz w 175°C przez 35 min.',                                    kcal: 260, B: 10, T: 16, W: 12 },

  // ── PRZEKĄSKI / DODATKI 181–200 ───────────────────────────────────────────
  { id: 181, nazwa: 'Chipsy z bakłażana',              czas: 30, opis: 'chrupiące, pieczone',    skladniki: 'bakłażan, oliwa, sól, oregano, parmezan',                 przygotowanie: 'Pokrój bakłażan cienko, skrop oliwą. Piecz w 200°C przez 20 min do chrupkości.',                    kcal: 140, B:  4, T:  8, W: 10 },
  { id: 182, nazwa: 'Pestki dyni prażone',             czas: 10, opis: 'chrupiące, odżywcze',    skladniki: 'pestki dyni, oliwa, sól, papryka wędzona',                przygotowanie: 'Wymieszaj pestki z oliwą i przyprawami. Praż na patelni 5–7 min mieszając.',                        kcal: 200, B: 10, T: 16, W:  4 },
  { id: 183, nazwa: 'Guacamole',                       czas: 10, opis: 'kremowe, keto',          skladniki: 'awokado, pomidor, cebula czerwona, limonka, kolendra, sól', przygotowanie: 'Rozgnieć awokado widelcem. Dodaj pokrojoną cebulę, pomidor i kolendię. Skrop limonką.',             kcal: 200, B:  2, T: 18, W:  6 },
  { id: 184, nazwa: 'Hummus z papryką',                czas: 15, opis: 'kremowy, wegański',      skladniki: 'ciecierzyca, tahini, czosnek, oliwa, papryka czerwona, cytryna', przygotowanie: 'Zblenduj ciecierzycę z tahini, czosnkiem i cytryną. Dodaj pieczoną paprykę.',                    kcal: 200, B:  8, T: 10, W: 14 },
  { id: 185, nazwa: 'Ser w plastrach',                 czas:  2, opis: 'szybkie, keto',          skladniki: 'ser żółty lub gouda, pieprz, papryka',                   przygotowanie: 'Pokrój ser w plastry, posyp pieprzem lub papryką. Gotowe.',                                         kcal: 180, B: 12, T: 14, W:  1 },
  { id: 186, nazwa: 'Jajka z majonezem',               czas: 10, opis: 'klasyczne, keto',        skladniki: 'jajka ugotowane, majonez, musztarda, szczypiorek, sól',   przygotowanie: 'Ugotuj jajka na twardo. Podaj z majonezem i musztardą.',                                             kcal: 260, B: 14, T: 22, W:  2 },
  { id: 187, nazwa: 'Warzywa kiszone',                 czas:  5, opis: 'fermentowane, probiotyczne', skladniki: 'ogórki kiszone lub kapusta kiszona',                  przygotowanie: 'Odsącz warzywa kiszone, pokrój w kawałki. Podaj jako dodatek lub przekąskę.',                      kcal:  40, B:  2, T:  0, W:  6 },
  { id: 188, nazwa: 'Ryż kalafiorowy z masłem',        czas: 10, opis: 'lekki, low carb',        skladniki: 'kalafior, masło, sól, pieprz, gałka muszkatołowa',        przygotowanie: 'Zetrzyj kalafior na tarce lub zblenduj. Podsmaż na maśle 5 min, dopraw.',                           kcal: 120, B:  4, T:  8, W:  6 },
  { id: 189, nazwa: 'Frytki z cukinii',                czas: 25, opis: 'pieczone, lekkie',        skladniki: 'cukinia, oliwa, sól, czosnek granulowany, parmezan',     przygotowanie: 'Pokrój cukinię w słupki, skrop oliwą. Piecz w 210°C przez 18 min.',                                 kcal: 140, B:  4, T:  8, W: 10 },
  { id: 190, nazwa: 'Pasta z awokado',                 czas:  5, opis: 'szybka, kremowa',         skladniki: 'awokado, sok z cytryny, czosnek, sól, pieprz, oliwa',    przygotowanie: 'Rozgnieć awokado, wymieszaj z sokiem z cytryny i czosnkiem. Dopraw.',                               kcal: 200, B:  2, T: 18, W:  6 },
  { id: 191, nazwa: 'Dip czosnkowy',                   czas:  5, opis: 'szybki, kremowy',         skladniki: 'jogurt grecki, czosnek, koper, sól, oliwa',              przygotowanie: 'Wymieszaj jogurt z przeciśniętym czosnkiem, koperkiem i oliwą.',                                     kcal: 120, B:  6, T:  6, W:  6 },
  { id: 192, nazwa: 'Sos pesto',                       czas:  5, opis: 'aromatyczny, włoski',     skladniki: 'bazylia, parmezan, orzechy piniowe, oliwa, czosnek',      przygotowanie: 'Zblenduj bazylię z parmezanem, orzechami i czosnkiem. Wlej oliwę i zblenduj na gładko.',          kcal: 180, B:  4, T: 16, W:  4 },
  { id: 193, nazwa: 'Pasta z tofu',                    czas: 10, opis: 'roślinne, kremowe',       skladniki: 'tofu jedwabiste, sok z cytryny, tahini, czosnek, sól',   przygotowanie: 'Zblenduj tofu z tahini, czosnkiem i sokiem z cytryny na gładką pastę.',                            kcal: 180, B: 12, T: 10, W:  8 },
  { id: 194, nazwa: 'Oliwki z przyprawami',            czas:  5, opis: 'szybkie, keto',           skladniki: 'oliwki zielone i czarne, oliwa, rozmaryn, skórka cytrynowa', przygotowanie: 'Wymieszaj oliwki z oliwą, rozmarynem i skórką cytrynową. Podaj od razu.',                       kcal: 160, B:  1, T: 16, W:  2 },
  { id: 195, nazwa: 'Pasta jajeczna z curry',          czas: 10, opis: 'aromatyczna, keto',       skladniki: 'jajka ugotowane, majonez, curry, szczypiorek, sól',       przygotowanie: 'Posiekaj jajka, wymieszaj z majonezem i curry. Dopraw szczypiorkiem.',                              kcal: 240, B: 14, T: 20, W:  2 },
  { id: 196, nazwa: 'Zupa miso',                       czas: 15, opis: 'azjatycka, rozgrzewająca', skladniki: 'pasta miso, tofu jedwabiste, wodorosty wakame, szczypiorek', przygotowanie: 'Rozrób pastę miso w ciepłej wodzie. Dodaj tofu i wodorosty, podgrzej bez gotowania.',            kcal: 120, B:  8, T:  4, W:  8 },
  { id: 197, nazwa: 'Chipsy serowe',                   czas: 15, opis: 'chrupiące, keto',         skladniki: 'ser parmezan lub cheddar, papryka, oregano',              przygotowanie: 'Uformuj małe kopczyki sera na blasze. Piecz w 200°C przez 8 min do chrupkości.',                    kcal: 200, B: 14, T: 16, W:  1 },
  { id: 198, nazwa: 'Orzechy w kakao',                 czas:  5, opis: 'szybkie, słodkie',        skladniki: 'orzechy mieszane, kakao, erytrytol, oliwa kokosowa',      przygotowanie: 'Wymieszaj orzechy z kakao, erytrytolem i olejem kokosowym. Gotowe.',                               kcal: 220, B:  6, T: 18, W:  8 },
  { id: 199, nazwa: 'Sos jogurtowy',                   czas:  5, opis: 'lekki, wszechstronny',    skladniki: 'jogurt naturalny, czosnek, ogórek, koper, sól, oliwa',   przygotowanie: 'Zetrzyj ogórek, wyciśnij wodę. Wymieszaj z jogurtem, czosnkiem i koperkiem.',                      kcal: 100, B:  6, T:  4, W:  8 },
  { id: 200, nazwa: 'Masło czosnkowe',                 czas:  5, opis: 'aromatyczne, keto',       skladniki: 'masło, czosnek, natka pietruszki, sól morska',           przygotowanie: 'Zmiękczaj masło, wymieszaj z przeciśniętym czosnkiem i natką. Uformuj roladkę, schłódź.',         kcal: 180, B:  1, T: 20, W:  1 },

  // ── ŚNIADANIA 201–240 ─────────────────────────────────────────────────────
  { id: 201, nazwa: 'Omlet z fetą i pomidorem',          czas: 12, opis: 'śródziemnomorski, świeży', skladniki: 'jajka, feta, pomidor, oliwa, oregano',                    przygotowanie: 'Wlej roztrzepane jajka na oliwę, dodaj pokruszoną fetę i pomidory, złóż omlet.',                  kcal: 300, B: 20, T: 20, W:  4 },
  { id: 202, nazwa: 'Jajka z guacamole',                 czas:  8, opis: 'tłuste, kremowe',          skladniki: 'jajka, awokado, limonka, cebula, kolendra',               przygotowanie: 'Usmaż jajka sadzone. Rozgnieć awokado z limonką i cebulą. Podaj razem.',                            kcal: 360, B: 18, T: 30, W:  4 },
  { id: 203, nazwa: 'Twarożek z papryką',                czas:  5, opis: 'świeży, chrupiący',        skladniki: 'twaróg, papryka czerwona, szczypiorek, sól, oliwa',       przygotowanie: 'Pokrój paprykę w drobną kostkę, wymieszaj z twarożkiem i szczypiorkiem.',                          kcal: 200, B: 16, T: 10, W:  6 },
  { id: 204, nazwa: 'Jogurt z masłem migdałowym',        czas:  5, opis: 'sycące, kremowe',          skladniki: 'jogurt grecki, masło migdałowe, migdały, cynamon',         przygotowanie: 'Przełóż jogurt do miseczki, dodaj masło migdałowe, posyp płatkami migdałów i cynamonem.',          kcal: 300, B: 14, T: 18, W: 14 },
  { id: 205, nazwa: 'Omlet z cukinią',                   czas: 12, opis: 'lekki, letni',             skladniki: 'jajka, cukinia, czosnek, oliwa, koper',                   przygotowanie: 'Podsmaż startą lub pokrojoną cukinię z czosnkiem. Wlej jajka i smaż do ścięcia.',                 kcal: 260, B: 20, T: 16, W:  6 },
  { id: 206, nazwa: 'Smoothie jagodowe',                 czas:  5, opis: 'lekkie, owocowe',          skladniki: 'jagody, banan, jogurt naturalny, mleko',                  przygotowanie: 'Zblenduj jagody z bananem, jogurtem i mlekiem na gładko.',                                         kcal: 180, B:  6, T:  2, W: 28 },
  { id: 207, nazwa: 'Jajka z boczkiem i rukolą',         czas: 10, opis: 'wytrawne, keto',           skladniki: 'jajka, boczek, rukola, oliwa, pieprz',                    przygotowanie: 'Podsmaż boczek na chrupko. Usmaż jajka. Podaj na rukolą skropionej oliwą.',                         kcal: 400, B: 22, T: 34, W:  2 },
  { id: 208, nazwa: 'Serek wiejski z chia',              czas:  5, opis: 'szybkie, odżywcze',        skladniki: 'serek wiejski, nasiona chia, mleko roślinne, wanilia',    przygotowanie: 'Wymieszaj serek z chia i odrobiną mleka roślinnego. Odstaw 5 min.',                                kcal: 200, B: 12, T:  8, W: 12 },
  { id: 209, nazwa: 'Omlet waniliowy',                   czas: 10, opis: 'słodki, delikatny',        skladniki: 'jajka, erytrytol, wanilia, masło, skórka cytrynowa',      przygotowanie: 'Roztrzep jajka z erytrytolem i wanilią. Smaż na maśle na małym ogniu.',                            kcal: 300, B: 20, T: 20, W:  6 },
  { id: 210, nazwa: 'Tofu z warzywami śniadaniowe',      czas: 10, opis: 'roślinne, kolorowe',       skladniki: 'tofu twarde, papryka, szpinak, kurkuma, sos sojowy',      przygotowanie: 'Pokrusz tofu, podsmaż z warzywami i kurkumą. Polej sosem sojowym.',                                kcal: 240, B: 14, T: 12, W: 10 },
  { id: 211, nazwa: 'Jajka z oliwą i solą morską',       czas:  6, opis: 'proste, keto',             skladniki: 'jajka, oliwa z oliwek, sól morska, pieprz, natka',       przygotowanie: 'Ugotuj jajka na miękko lub usmaż. Polej oliwą, posyp solą morską i natką.',                       kcal: 200, B: 14, T: 16, W:  1 },
  { id: 212, nazwa: 'Jogurt kokosowy z kakao',            czas:  5, opis: 'deserowy, wegański',       skladniki: 'jogurt kokosowy, kakao, erytrytol, wiórki kokosowe',      przygotowanie: 'Wymieszaj jogurt z kakao i erytrytolem. Posyp wiórkami kokosowymi.',                               kcal: 260, B:  4, T: 18, W: 14 },
  { id: 213, nazwa: 'Omlet z indykiem',                  czas: 12, opis: 'białkowy, wytrawny',       skladniki: 'jajka, indyk pieczony, szpinak, czosnek, masło',          przygotowanie: 'Podsmaż indyka ze szpinakiem. Wlej jajka, smaż pod przykryciem.',                                  kcal: 340, B: 36, T: 18, W:  2 },
  { id: 214, nazwa: 'Twarożek z orzechami',              czas:  5, opis: 'sycące, low carb',         skladniki: 'twaróg, orzechy włoskie, sól, pieprz, oliwa',             przygotowanie: 'Rozetrzeć twaróg z oliwą, posypać posiekanymi orzechami i pieprzem.',                              kcal: 280, B: 16, T: 18, W:  8 },
  { id: 215, nazwa: 'Smoothie zielone z białkiem',       czas:  5, opis: 'fit, wysokobiałkowe',      skladniki: 'szpinak, białko waniliowe, mleko migdałowe, banan, lód', przygotowanie: 'Zblenduj wszystkie składniki na gładko i podaj natychmiast.',                                      kcal: 240, B: 26, T:  4, W: 16 },
  { id: 216, nazwa: 'Omlet kakaowo-orzechowy',           czas: 10, opis: 'deserowy, keto',           skladniki: 'jajka, kakao, orzechy, erytrytol, masło orzechowe',       przygotowanie: 'Roztrzep jajka z kakao i erytrytolem. Smaż omlet, dodaj masło orzechowe i orzechy.',              kcal: 360, B: 20, T: 28, W:  6 },
  { id: 217, nazwa: 'Jajka z pesto i mozzarellą',        czas: 10, opis: 'kremowe, keto',            skladniki: 'jajka, pesto bazyliowe, mozzarella, pomidorki, bazylia', przygotowanie: 'Usmaż jajka. Ułóż na talerzu z mozzarellą, nałóż pesto i udekoruj bazylią.',                       kcal: 380, B: 26, T: 30, W:  2 },
  { id: 218, nazwa: 'Jogurt z kokosem i wanilią',        czas:  5, opis: 'słodkie, kremowe',         skladniki: 'jogurt grecki, wiórki kokosowe, wanilia, erytrytol',      przygotowanie: 'Wymieszaj jogurt z wanilią i erytrytolem. Posyp wiórkami kokosowymi.',                              kcal: 260, B:  8, T: 16, W: 16 },
  { id: 219, nazwa: 'Omlet z brokułem',                  czas: 12, opis: 'warzywny, zdrowy',         skladniki: 'jajka, brokuł, czosnek, oliwa, parmezan',                 przygotowanie: 'Podgotuj brokuł al dente. Wlej jajka na oliwę, dodaj brokuł, posyp parmezanem.',                 kcal: 280, B: 22, T: 18, W:  4 },
  { id: 220, nazwa: 'Krem kokosowy z kakao',              czas:  5, opis: 'gęsty, wegański',          skladniki: 'mleko kokosowe pełne, kakao, erytrytol, wanilia',         przygotowanie: 'Ubij zimne mleko kokosowe z kakao i erytrytolem na puszysty krem.',                               kcal: 280, B:  4, T: 22, W: 12 },
  { id: 221, nazwa: 'Jajka z łososiem i koperkiem',      czas: 10, opis: 'premium, keto',            skladniki: 'jajka, łosoś wędzony, koperek, śmietana, sól',           przygotowanie: 'Usmaż jajka sadzone lub przygotuj jajecznicę. Ułóż łososia, posyp koperkiem i śmietaną.',       kcal: 360, B: 30, T: 26, W:  1 },
  { id: 222, nazwa: 'Serek wiejski z pestkami',          czas:  5, opis: 'szybkie, chrupiące',       skladniki: 'serek wiejski, pestki dyni, nasiona słonecznika, sól',   przygotowanie: 'Przełóż serek do miseczki, posyp pestkami i nasionami.',                                          kcal: 200, B: 12, T: 10, W: 10 },
  { id: 223, nazwa: 'Omlet z papryką i cebulą',          czas: 12, opis: 'klasyczny, kolorowy',      skladniki: 'jajka, papryka czerwona, cebula, oliwa, zioła',          przygotowanie: 'Podsmaż paprykę z cebulą. Wlej jajka, smaż do ścięcia i złóż.',                                   kcal: 280, B: 20, T: 18, W:  6 },
  { id: 224, nazwa: 'Smoothie kokosowo-malinowe',        czas:  5, opis: 'lekkie, wegańskie',        skladniki: 'maliny, mleko kokosowe, banan, erytrytol',                przygotowanie: 'Zblenduj maliny z mlekiem kokosowym i bananem na jednolitą masę.',                                kcal: 200, B:  2, T: 14, W: 18 },
  { id: 225, nazwa: 'Jajka na miękko z masłem',          czas:  6, opis: 'proste, keto',             skladniki: 'jajka, masło, sól morska, pieprz',                        przygotowanie: 'Gotuj jajka 6 minut. Obierz, przekrój, podaj z płatkiem masła i solą morską.',                  kcal: 240, B: 14, T: 20, W:  1 },
  { id: 226, nazwa: 'Jogurt z kakao i orzechami',        czas:  5, opis: 'sycące, low carb',         skladniki: 'jogurt grecki, kakao, orzechy włoskie, erytrytol',        przygotowanie: 'Wymieszaj jogurt z kakao i erytrytolem. Posyp posiekanymi orzechami.',                            kcal: 300, B: 12, T: 18, W: 14 },
  { id: 227, nazwa: 'Omlet ze szparagami',               czas: 12, opis: 'sezonowy, elegancki',      skladniki: 'jajka, szparagi, masło, sól, pieprz, parmezan',           przygotowanie: 'Blanszuj szparagi 3 min. Wlej jajka na masło, dodaj szparagi, posyp parmezanem.',               kcal: 280, B: 22, T: 18, W:  4 },
  { id: 228, nazwa: 'Twarożek z pomidorem',              czas:  5, opis: 'świeży, lekki',            skladniki: 'twaróg, pomidor, bazylia, oliwa, sól morska',             przygotowanie: 'Pokrój pomidor w plasterki, ułóż na twarożku. Polej oliwą, posyp bazylią.',                      kcal: 200, B: 16, T: 10, W:  6 },
  { id: 229, nazwa: 'Smoothie z masłem orzechowym',      czas:  5, opis: 'kaloryczne, keto',         skladniki: 'mleko migdałowe, masło orzechowe, kakao, erytrytol, lód', przygotowanie: 'Zblenduj wszystkie składniki do uzyskania gładkiego, gęstego koktajlu.',                          kcal: 320, B: 10, T: 24, W: 12 },
  { id: 230, nazwa: 'Omlet z rukolą i serem',            czas: 12, opis: 'wytrawny, elegancki',      skladniki: 'jajka, rukola, ser pecorino lub parmezan, oliwa, pieprz', przygotowanie: 'Zrób omlet, nałóż na wierzch rukolę i płatki sera. Skrop oliwą.',                                kcal: 320, B: 22, T: 22, W:  4 },
  { id: 231, nazwa: 'Jajka sadzone z pieczarkami',       czas: 10, opis: 'klasyczne, keto',          skladniki: 'jajka, pieczarki, masło, czosnek, tymianek',              przygotowanie: 'Podsmaż pieczarki z czosnkiem i tymiankiem. Na tym samym tłuszczu usmaż jajka sadzone.',          kcal: 300, B: 20, T: 22, W:  4 },
  { id: 232, nazwa: 'Jogurt z borówkami i chia',         czas:  5, opis: 'szybkie, owocowe',         skladniki: 'jogurt naturalny, borówki, nasiona chia, miód',           przygotowanie: 'Wlej jogurt do miseczki, dodaj borówki i nasiona chia. Skrop miodem.',                           kcal: 240, B: 10, T:  8, W: 22 },
  { id: 233, nazwa: 'Omlet z cukinią i fetą',            czas: 12, opis: 'lekki, śródziemnomorski', skladniki: 'jajka, cukinia, feta, mięta, oliwa',                      przygotowanie: 'Podsmaż startą cukinię. Wlej jajka, dodaj pokruszoną fetę i miętę.',                            kcal: 300, B: 22, T: 20, W:  4 },
  { id: 234, nazwa: 'Smoothie waniliowe',                czas:  5, opis: 'proste, kremowe',          skladniki: 'mleko, jogurt, wanilia, banan, miód',                     przygotowanie: 'Zblenduj wszystkie składniki na gładki, kremowy koktajl.',                                        kcal: 200, B:  8, T:  4, W: 26 },
  { id: 235, nazwa: 'Jajka z awokado i solą morską',     czas:  8, opis: 'tłuste, keto',             skladniki: 'jajka, awokado, sól morska, pieprz, papryka wędzona',    przygotowanie: 'Usmaż jajka sadzone. Pokrój awokado, ułóż obok. Posyp solą morską i papryką.',                  kcal: 360, B: 16, T: 30, W:  3 },
  { id: 236, nazwa: 'Twarożek z ogórkiem kiszonym',      czas:  5, opis: 'wyrazisty, kwaśny',        skladniki: 'twaróg, ogórek kiszony, koper, czosnek, sól',             przygotowanie: 'Zetrzyj lub drobno pokrój ogórek, odciśnij. Wymieszaj z twarożkiem, koperkiem i czosnkiem.',    kcal: 200, B: 16, T: 10, W:  6 },
  { id: 237, nazwa: 'Omlet z boczkiem i serem',          czas: 12, opis: 'sycący, keto',             skladniki: 'jajka, boczek, ser cheddar, masło, szczypiorek',          przygotowanie: 'Podsmaż pokrojony boczek. Wlej jajka, posyp serem, złóż omlet.',                                 kcal: 420, B: 28, T: 34, W:  2 },
  { id: 238, nazwa: 'Smoothie szpinak z jabłkiem',       czas:  5, opis: 'świeże, wegańskie',        skladniki: 'szpinak, jabłko, banan, woda kokosowa, imbir',           przygotowanie: 'Zblenduj szpinak z jabłkiem, bananem i wodą kokosową. Dodaj imbir.',                              kcal: 160, B:  4, T:  2, W: 26 },
  { id: 239, nazwa: 'Jajka z masłem i szczypiorkiem',    czas:  7, opis: 'klasyczne, keto',          skladniki: 'jajka, masło, szczypiorek, sól morska, pieprz',          przygotowanie: 'Usmaż jajka na maśle. Posyp drobno posiekanym szczypiorkiem i solą morską.',                     kcal: 260, B: 16, T: 22, W:  1 },
  { id: 240, nazwa: 'Jogurt z masłem kokosowym',         czas:  5, opis: 'tłuste, keto',             skladniki: 'jogurt grecki, masło kokosowe, wiórki, wanilia',          przygotowanie: 'Wymieszaj jogurt z masłem kokosowym i wanilią. Posyp wiórkami.',                                  kcal: 280, B:  8, T: 22, W: 10 },

  // ── OBIADY 241–300 ────────────────────────────────────────────────────────
  { id: 241, nazwa: 'Kurczak w curry ze szpinakiem',     czas: 25, opis: 'kremowy, keto',            skladniki: 'filet z kurczaka, szpinak, mleko kokosowe, pasta curry, czosnek', przygotowanie: 'Usmaż kurczaka. Wlej mleko kokosowe z pastą curry, dodaj szpinak, duś 10 min.',              kcal: 420, B: 40, T: 24, W:  8 },
  { id: 242, nazwa: 'Wołowina z imbirem',                czas: 20, opis: 'azjatycka, intensywna',    skladniki: 'wołowina, świeży imbir, sos sojowy, czosnek, sezam',      przygotowanie: 'Pokrój wołowinę w paski, smaż na dużym ogniu z imbirem i czosnkiem. Polej sosem sojowym.',    kcal: 380, B: 36, T: 22, W:  6 },
  { id: 243, nazwa: 'Krewetki z limonką',                czas: 10, opis: 'świeże, szybkie',          skladniki: 'krewetki, limonka, czosnek, masło, natka pietruszki',     przygotowanie: 'Podsmaż czosnek na maśle, dodaj krewetki. Smaż 3 min, skrop limonką, posyp natką.',           kcal: 260, B: 26, T: 14, W:  4 },
  { id: 244, nazwa: 'Tofu w sosie teriyaki',             czas: 20, opis: 'roślinne, słodko-słone',   skladniki: 'tofu twarde, sos teriyaki, sezam, szczypiorek, olej',     przygotowanie: 'Podsmaż tofu na złoto. Polej sosem teriyaki, smaż 2 min, posyp sezamem.',                       kcal: 300, B: 16, T: 14, W: 18 },
  { id: 245, nazwa: 'Kurczak z pieczarkami',             czas: 25, opis: 'klasyczny, kremowy',       skladniki: 'filet z kurczaka, pieczarki, śmietanka, czosnek, tymianek', przygotowanie: 'Usmaż kurczaka. Podsmaż pieczarki z czosnkiem, dodaj śmietankę i tymianek. Duś razem.',           kcal: 360, B: 40, T: 18, W:  6 },
  { id: 246, nazwa: 'Łosoś z masłem czosnkowym',         czas: 20, opis: 'tłusty, keto',             skladniki: 'filet łososia, masło, czosnek, tymianek, cytryna',        przygotowanie: 'Smaż łososia skórą do dołu 4 min. Polej roztopionym masłem czosnkowym.',                       kcal: 420, B: 38, T: 28, W:  2 },
  { id: 247, nazwa: 'Indyk z brokułem',                  czas: 20, opis: 'lekki, białkowy',          skladniki: 'filet z indyka, brokuł, czosnek, sos sojowy, sezam',        przygotowanie: 'Pokrój indyka, smaż na woku. Dodaj blanszowany brokuł i sos sojowy.',                            kcal: 320, B: 40, T: 12, W:  8 },
  { id: 248, nazwa: 'Sałatka z kurczakiem i oliwą',      czas: 15, opis: 'szybka, lekka',            skladniki: 'kurczak gotowany, sałata, oliwki, oliwa, cytryna, pieprz', przygotowanie: 'Pokrój kurczaka, wymieszaj z sałatą i oliwkami. Skrop oliwą i cytryną.',                       kcal: 280, B: 28, T: 14, W:  6 },
  { id: 249, nazwa: 'Makaron konjac z mięsem',           czas: 15, opis: 'szybki, low carb',         skladniki: 'makaron konjac, mięso mielone, sos pomidorowy, czosnek',  przygotowanie: 'Podsmaż mięso z czosnkiem, dodaj sos pomidorowy. Opłucz makaron konjac, wymieszaj z sosem.',  kcal: 280, B: 26, T: 16, W:  4 },
  { id: 250, nazwa: 'Zupa pomidorowa keto',               czas: 25, opis: 'kremowa, sycąca',          skladniki: 'pomidory pelati, śmietanka, czosnek, bazylia, parmezan',  przygotowanie: 'Zblenduj pomidory z czosnkiem, gotuj 15 min. Dodaj śmietankę, posyp parmezanem.',             kcal: 220, B:  8, T: 14, W:  8 },
  { id: 251, nazwa: 'Gulasz z kurczaka',                  czas: 40, opis: 'domowy, rozgrzewający',    skladniki: 'kurczak, cebula, papryka, pomidory, papryka słodka, zioła', przygotowanie: 'Podsmaż kurczaka z cebulą. Dodaj paprykę, pomidory i przyprawy. Duś 30 min.',                 kcal: 400, B: 40, T: 18, W: 12 },
  { id: 252, nazwa: 'Ryba pieczona z czosnkiem',          czas: 25, opis: 'lekka, śródziemnomorska', skladniki: 'filet ryby, czosnek, oliwa, zioła prowansalskie, cytryna', przygotowanie: 'Natrzyj rybę czosnkiem i ziołami, skrop oliwą. Piecz 20 min w 180°C.',                          kcal: 300, B: 36, T: 12, W:  4 },
  { id: 253, nazwa: 'Wołowina z papryką i czosnkiem',     czas: 20, opis: 'szybka, intensywna',      skladniki: 'wołowina, papryka, czosnek, sos sojowy, sezam',           przygotowanie: 'Pokrój mięso, smaż na dużym ogniu z papryką i czosnkiem. Polej sosem sojowym.',                kcal: 380, B: 36, T: 22, W:  8 },
  { id: 254, nazwa: 'Curry warzywne kokosowe',            czas: 25, opis: 'roślinne, aromatyczne',   skladniki: 'warzywa mieszane, mleko kokosowe, pasta curry, czosnek, imbir', przygotowanie: 'Podsmaż czosnek z imbirem i pastą curry. Dodaj warzywa i mleko kokosowe, duś 15 min.',        kcal: 280, B:  8, T: 14, W: 22 },
  { id: 255, nazwa: 'Kurczak z cukinią i czosnkiem',      czas: 20, opis: 'lekki, szybki',           skladniki: 'filet z kurczaka, cukinia, czosnek, oliwa, bazylia',        przygotowanie: 'Usmaż kurczaka, dodaj pokrojoną cukinię i czosnek. Duś razem 8 min.',                           kcal: 340, B: 38, T: 16, W:  6 },
  { id: 256, nazwa: 'Tofu smażone na chrupko',            czas: 15, opis: 'chrupiące, wegańskie',    skladniki: 'tofu twarde, olej, sos sojowy, skrobia kukurydziana, czosnek', przygotowanie: 'Obtocz tofu w skrobi, smaż w oleju do chrupkości. Polej sosem sojowym z czosnkiem.',          kcal: 280, B: 16, T: 18, W:  8 },
  { id: 257, nazwa: 'Sałatka z jajkiem i kurczakiem',     czas: 15, opis: 'sycąca, kremowa',         skladniki: 'kurczak, jajka ugotowane, majonez, sałata, ogórek',       przygotowanie: 'Pokrój kurczaka i jajka. Wymieszaj z sałatą, ogórkiem i majonezem.',                           kcal: 360, B: 32, T: 22, W:  6 },
  { id: 258, nazwa: 'Zupa krem z selera',                  czas: 30, opis: 'kremowa, zimowa',         skladniki: 'seler korzeniowy, cebula, bulion, śmietana, gałka muszkatołowa', przygotowanie: 'Podsmaż cebulę, dodaj seler i bulion. Gotuj 20 min, zblenduj ze śmietaną.',               kcal: 200, B:  6, T: 10, W: 12 },
  { id: 259, nazwa: 'Indyk z sosem pomidorowym',           czas: 25, opis: 'klasyczny, rodzinny',    skladniki: 'filet z indyka, pomidory pelati, cebula, czosnek, bazylia',  przygotowanie: 'Usmaż indyka. Zrób sos z pomidorów z cebulą i czosnkiem. Duś mięso w sosie 15 min.',          kcal: 360, B: 40, T: 14, W: 12 },
  { id: 260, nazwa: 'Stir-fry z warzywami',               czas: 15, opis: 'szybkie, wegańskie',      skladniki: 'brokuł, marchew, papryka, sos sojowy, imbir, czosnek',   przygotowanie: 'Podsmaż czosnek z imbirem, dodaj warzywa w kolejności twardości. Polej sosem sojowym.',       kcal: 180, B:  6, T:  6, W: 20 },
  { id: 261, nazwa: 'Kurczak z brokułem i sezamem',       czas: 20, opis: 'azjatycki, aromatyczny',  skladniki: 'kurczak, brokuł, sos sojowy, sezam, czosnek, imbir',      przygotowanie: 'Smaż kurczaka z czosnkiem i imbirem. Dodaj brokuł, polej sosem sojowym, posyp sezamem.',     kcal: 340, B: 40, T: 14, W:  8 },
  { id: 262, nazwa: 'Łosoś z koperkiem i cytryną',        czas: 20, opis: 'lekki, śródziemnomorski', skladniki: 'filet łososia, koper, cytryna, oliwa, sól morska',        przygotowanie: 'Piecz łososia z koperkiem i cytryną w 180°C przez 18 min.',                                    kcal: 380, B: 38, T: 24, W:  2 },
  { id: 263, nazwa: 'Wołowina duszona z cebulą',          czas: 45, opis: 'klasyczna, sycąca',       skladniki: 'łopatka wołowa, cebula, bulion, tymianek, liść laurowy', przygotowanie: 'Obsmaż mięso, dodaj cebulę i bulion z ziołami. Duś 40 min na małym ogniu.',                    kcal: 460, B: 40, T: 28, W:  8 },
  { id: 264, nazwa: 'Tofu curry z mlekiem kokosowym',     czas: 25, opis: 'kremowe, wegańskie',      skladniki: 'tofu twarde, mleko kokosowe, curry, kurkuma, czosnek, imbir', przygotowanie: 'Podsmaż tofu na złoto. Przygotuj sos curry z mlekiem kokosowym, duś razem 10 min.',          kcal: 320, B: 14, T: 20, W: 12 },
  { id: 265, nazwa: 'Kurczak z papryką w sosie',          czas: 20, opis: 'szybki, kolorowy',        skladniki: 'kurczak, papryka czerwona, cebula, czosnek, sos pomidorowy', przygotowanie: 'Usmaż kurczaka z cebulą. Dodaj paprykę i sos pomidorowy, duś 8 min.',                          kcal: 340, B: 38, T: 14, W: 10 },
  { id: 266, nazwa: 'Ryba smażona z masłem',              czas: 15, opis: 'klasyczna, keto',         skladniki: 'filet ryby, masło, sól, pieprz, cytryna, natka',          przygotowanie: 'Smaż rybę na maśle 4 min z każdej strony. Skrop cytryną.',                                      kcal: 340, B: 34, T: 20, W:  2 },
  { id: 267, nazwa: 'Wołowina z cukinią',                  czas: 25, opis: 'lekka, low carb',         skladniki: 'wołowina, cukinia, czosnek, oliwa, zioła',                przygotowanie: 'Podsmaż wołowinę, dodaj pokrojoną cukinię i czosnek. Duś razem 10 min.',                       kcal: 380, B: 36, T: 22, W:  6 },
  { id: 268, nazwa: 'Curry z kurczakiem i kokosem',       czas: 25, opis: 'aromatyczne, keto',       skladniki: 'kurczak, mleko kokosowe, pasta curry, kolendra, limonka', przygotowanie: 'Podsmaż kurczaka. Wlej mleko kokosowe z pastą curry. Duś 15 min, posyp kolendrą.',              kcal: 420, B: 36, T: 28, W:  8 },
  { id: 269, nazwa: 'Zupa brokułowa z serem',             czas: 25, opis: 'kremowa, sycąca',         skladniki: 'brokuł, bulion, ser cheddar, śmietana, czosnek',          przygotowanie: 'Ugotuj brokuł w bulionie. Zblenduj ze śmietaną, dodaj starty ser, wymieszaj.',                 kcal: 280, B: 12, T: 20, W:  8 },
  { id: 270, nazwa: 'Kurczak grillowany z sałatą',        czas: 15, opis: 'szybki, lekki',           skladniki: 'filet z kurczaka, sałata, pomidorki, sos vinaigrette',       przygotowanie: 'Grilluj kurczaka 6 min z każdej strony. Pokrój i podaj na sałacie z dressingiem.',             kcal: 280, B: 30, T: 14, W:  6 },
  { id: 271, nazwa: 'Stir-fry tofu z papryką',            czas: 15, opis: 'szybkie, wegańskie',      skladniki: 'tofu twarde, papryka, cebula, sos sojowy, czosnek',       przygotowanie: 'Smaż tofu na woku do złota. Dodaj paprykę i cebulę, polej sosem sojowym.',                     kcal: 260, B: 14, T: 14, W: 10 },
  { id: 272, nazwa: 'Łosoś z masłem i cytryną',           czas: 20, opis: 'tłusty, keto',            skladniki: 'filet łososia, masło, cytryna, koper, sól morska',        przygotowanie: 'Smaż łososia na maśle 4 min z każdej strony. Skrop świeżą cytryną.',                          kcal: 420, B: 38, T: 28, W:  2 },
  { id: 273, nazwa: 'Wołowina z czosnkiem i imbirem',     czas: 20, opis: 'azjatycka, pikantna',     skladniki: 'wołowina, czosnek, imbir, sos sojowy, olej sezamowy',     przygotowanie: 'Podsmaż czosnek z imbirem na oleju sezamowym. Dodaj mięso, smaż intensywnie.',               kcal: 380, B: 36, T: 22, W:  6 },
  { id: 274, nazwa: 'Kurczak z cukinią i pomidorami',     czas: 25, opis: 'lekki, letni',            skladniki: 'kurczak, cukinia, pomidory, czosnek, bazylia, oliwa',     przygotowanie: 'Usmaż kurczaka, dodaj warzywa i czosnek. Duś 10 min, posyp bazylią.',                          kcal: 340, B: 38, T: 14, W: 10 },
  { id: 275, nazwa: 'Tofu z warzywami stir-fry',          czas: 15, opis: 'szybkie, wegańskie',      skladniki: 'tofu, brokuł, marchew, sos sojowy, imbir, sezam',         przygotowanie: 'Podsmaż tofu, dodaj warzywa pokrojone w słupki. Polej sosem sojowym z imbirem.',              kcal: 260, B: 14, T: 14, W: 10 },
  { id: 276, nazwa: 'Zupa krem z pomidorów',              czas: 25, opis: 'klasyczna, dash',          skladniki: 'pomidory pelati, cebula, czosnek, bulion, bazylia, oliwa', przygotowanie: 'Podsmaż cebulę i czosnek, dodaj pomidory i bulion. Gotuj 15 min, zblenduj.',                   kcal: 180, B:  6, T:  8, W: 14 },
  { id: 277, nazwa: 'Kurczak z pesto i mozzarellą',       czas: 25, opis: 'kremowy, keto',           skladniki: 'filet z kurczaka, pesto bazyliowe, mozzarella, pomidorki',  przygotowanie: 'Natrzyj kurczaka pesto. Piecz 20 min. Na 5 min przed końcem dodaj mozzarellę.',               kcal: 440, B: 42, T: 28, W:  4 },
  { id: 278, nazwa: 'Ryba z masłem i koperkiem',          czas: 20, opis: 'lekka, śródziemnomorska', skladniki: 'filet ryby, masło, koper, cytryna, sól morska',           przygotowanie: 'Piecz rybę z masłem i koperkiem w 190°C przez 16 min. Skrop cytryną.',                        kcal: 300, B: 34, T: 16, W:  2 },
  { id: 279, nazwa: 'Wołowina z warzywami stir-fry',      czas: 20, opis: 'szybka, sycąca',          skladniki: 'wołowina, brokuł, papryka, sos sojowy, czosnek, sezam',  przygotowanie: 'Smaż mięso na dużym ogniu. Dodaj warzywa i sos sojowy, smaż razem 3 min.',                   kcal: 380, B: 36, T: 22, W:  8 },
  { id: 280, nazwa: 'Curry warzywne z imbirem',           czas: 25, opis: 'aromatyczne, wegańskie',  skladniki: 'warzywa, imbir, mleko kokosowe, curry, czosnek, limonka', przygotowanie: 'Podsmaż imbir z czosnkiem. Dodaj warzywa, mleko kokosowe i curry. Duś 15 min.',               kcal: 260, B:  8, T: 12, W: 22 },
  { id: 281, nazwa: 'Kurczak z brokułem i sezamem',       czas: 20, opis: 'azjatycki, szybki',       skladniki: 'kurczak, brokuł, sezam, sos sojowy, imbir',               przygotowanie: 'Smaż kurczaka z imbirem. Dodaj brokuł, polej sosem sojowym, posyp sezamem.',                  kcal: 340, B: 40, T: 14, W:  8 },
  { id: 282, nazwa: 'Tofu z czosnkiem i sosem sojowym',   czas: 15, opis: 'szybkie, wegańskie',      skladniki: 'tofu twarde, czosnek, sos sojowy, olej sezamowy, szczypiorek', przygotowanie: 'Smaż tofu na złoto. Dodaj czosnek i sos sojowy. Polej olejem sezamowym.',                   kcal: 260, B: 14, T: 16, W:  6 },
  { id: 283, nazwa: 'Łosoś pieczony z warzywami',         czas: 25, opis: 'zdrowy, śródziemnomorski', skladniki: 'łosoś, cukinia, pomidorki, oliwa, cytryna, oregano',      przygotowanie: 'Ułóż łososia z warzywami na blasze. Skrop oliwą i cytryną. Piecz 22 min.',                   kcal: 400, B: 38, T: 24, W:  8 },
  { id: 284, nazwa: 'Wołowina z cebulą i papryką',        czas: 25, opis: 'klasyczna, sycąca',       skladniki: 'wołowina, cebula, papryka, sos pomidorowy, tymianek',     przygotowanie: 'Podsmaż mięso z cebulą. Dodaj paprykę i sos pomidorowy. Duś 15 min.',                         kcal: 380, B: 36, T: 22, W:  8 },
  { id: 285, nazwa: 'Kurczak z curry i warzywami',        czas: 25, opis: 'aromatyczny, low carb',   skladniki: 'kurczak, warzywa mieszane, pasta curry, mleko kokosowe',  przygotowanie: 'Usmaż kurczaka z pastą curry. Dodaj warzywa i mleko kokosowe. Duś 15 min.',                  kcal: 380, B: 40, T: 18, W: 10 },
  { id: 286, nazwa: 'Zupa krem z cukinii i czosnku',      czas: 25, opis: 'lekka, tania',            skladniki: 'cukinia, czosnek, bulion, śmietana, koper',               przygotowanie: 'Podsmaż czosnek, dodaj cukinię i bulion. Gotuj 15 min, zblenduj ze śmietaną.',                kcal: 180, B:  6, T:  8, W: 12 },
  { id: 287, nazwa: 'Indyk z warzywami stir-fry',         czas: 15, opis: 'szybki, lekki',           skladniki: 'indyk, papryka, cukinia, sos sojowy, czosnek',            przygotowanie: 'Smaż indyka na woku z czosnkiem. Dodaj warzywa i sos sojowy.',                                 kcal: 300, B: 36, T: 12, W:  8 },
  { id: 288, nazwa: 'Tofu w sosie kokosowym',             czas: 25, opis: 'kremowe, wegańskie',      skladniki: 'tofu, mleko kokosowe, kurkuma, czosnek, kolendra',        przygotowanie: 'Podsmaż tofu. Przygotuj sos kokosowy z kurkumą. Duś tofu w sosie 10 min.',                   kcal: 320, B: 14, T: 22, W: 10 },
  { id: 289, nazwa: 'Ryba smażona z cytryną',             czas: 15, opis: 'szybka, lekka',           skladniki: 'filet ryby, cytryna, masło, sól morska, pieprz, koper',  przygotowanie: 'Smaż rybę na maśle 3 min z każdej strony. Skrop sokiem z cytryny.',                          kcal: 300, B: 34, T: 16, W:  2 },
  { id: 290, nazwa: 'Wołowina z imbirem i soją',          czas: 20, opis: 'azjatycka, intensywna',   skladniki: 'wołowina, imbir, sos sojowy, czosnek, olej sezamowy, sezam', przygotowanie: 'Pokrój mięso w cienkie paski. Marynuj w soi z imbirem. Smaż intensywnie 5 min.',              kcal: 360, B: 36, T: 20, W:  6 },
  { id: 291, nazwa: 'Kurczak z papryką w curry',          czas: 20, opis: 'aromatyczny, szybki',     skladniki: 'kurczak, papryka, pasta curry, czosnek, jogurt naturalny', przygotowanie: 'Zamarynuj kurczaka w curry i jogurcie. Usmaż z papryką i czosnkiem.',                          kcal: 360, B: 38, T: 16, W:  8 },
  { id: 292, nazwa: 'Tofu stir-fry z brokułem',           czas: 15, opis: 'szybkie, wegańskie',      skladniki: 'tofu, brokuł, czosnek, sos sojowy, imbir, olej sezamowy', przygotowanie: 'Smaż tofu do złota, dodaj brokuł i czosnek. Polej sosem sojowym i olejem sezamowym.',          kcal: 280, B: 16, T: 16, W:  8 },
  { id: 293, nazwa: 'Łosoś pieczony z cytryną',           czas: 25, opis: 'lekki, klasyczny',        skladniki: 'filet łososia, cytryna, koper, oliwa, sól morska',        przygotowanie: 'Ułóż łososia w naczyniu, skrop oliwą i cytryną. Piecz 20 min w 180°C.',                       kcal: 380, B: 38, T: 22, W:  2 },
  { id: 294, nazwa: 'Wołowina duszona z warzywami',       czas: 45, opis: 'klasyczna, bogata',       skladniki: 'wołowina, marchew, seler, cebula, bulion, zioła',         przygotowanie: 'Obsmaż mięso, dodaj warzywa i bulion. Duś 40 min. Dopraw do smaku.',                          kcal: 460, B: 40, T: 28, W:  8 },
  { id: 295, nazwa: 'Kurczak curry z kokosem',            czas: 25, opis: 'kremowy, keto',           skladniki: 'kurczak, mleko kokosowe, pasta curry red, limonka, kolendra', przygotowanie: 'Usmaż kurczaka. Dodaj mleko kokosowe z pastą curry. Duś 15 min, skrop limonką.',              kcal: 420, B: 36, T: 28, W:  8 },
  { id: 296, nazwa: 'Zupa krem z kalafiora i czosnku',    czas: 25, opis: 'lekka, kremowa',          skladniki: 'kalafior, czosnek, bulion, śmietana, pieprz cayenne',     przygotowanie: 'Upiecz kalafior z czosnkiem. Zblenduj z bulionem i śmietaną. Dopraw cayenne.',                kcal: 220, B:  8, T: 12, W: 10 },
  { id: 297, nazwa: 'Indyk z papryką stir-fry',           czas: 15, opis: 'szybki, kolorowy',        skladniki: 'indyk, papryka czerwona, żółta, sos sojowy, czosnek',     przygotowanie: 'Pokrój indyka i paprykę. Smaż na woku z czosnkiem i sosem sojowym.',                         kcal: 300, B: 36, T: 12, W:  8 },
  { id: 298, nazwa: 'Tofu w sosie pomidorowym',           czas: 25, opis: 'roślinne, sycące',        skladniki: 'tofu twarde, pomidory pelati, czosnek, bazylia, oliwa',   przygotowanie: 'Podsmaż tofu na złoto. Przygotuj sos pomidorowy, duś tofu w sosie 15 min.',                  kcal: 280, B: 14, T: 14, W: 12 },
  { id: 299, nazwa: 'Ryba z masłem i warzywami',          czas: 20, opis: 'lekka, kremowa',          skladniki: 'filet ryby, masło, cukinia, pomidorki, czosnek, koper',   przygotowanie: 'Smaż rybę na maśle. Dodaj warzywa i czosnek, duś razem 5 min.',                               kcal: 320, B: 34, T: 18, W:  4 },
  { id: 300, nazwa: 'Wołowina z brokułem stir-fry',       czas: 20, opis: 'szybka, sycąca',          skladniki: 'wołowina, brokuł, sos sojowy, czosnek, imbir, sezam',    przygotowanie: 'Smaż wołowinę na dużym ogniu. Dodaj brokuł, czosnek i imbir. Polej sosem sojowym.',           kcal: 380, B: 38, T: 20, W:  8 },

  // ── ŚNIADANIA 301–320 ─────────────────────────────────────────────────────
  { id: 301, nazwa: 'Jajka z fetą i szpinakiem',          czas: 10, opis: 'kremowe, śródziemnomorskie', skladniki: 'jajka, feta, szpinak, oliwa, czosnek',                    przygotowanie: 'Podsmaż szpinak z czosnkiem. Dodaj pokruszoną fetę, wbij jajka i smaż do ścięcia.',             kcal: 300, B: 22, T: 22, W:  2 },
  { id: 302, nazwa: 'Omlet z wędzonym łososiem',          czas: 12, opis: 'elegancki, keto',            skladniki: 'jajka, łosoś wędzony, krem fraîche, szczypiorek, pieprz', przygotowanie: 'Zrób omlet. Nałóż na środek łososia i łyżkę kremu fraîche. Posyp szczypiorkiem i złóż.',        kcal: 380, B: 32, T: 28, W:  2 },
  { id: 303, nazwa: 'Mus z ricotty z owocami',             czas:  5, opis: 'lekki, deserowy',           skladniki: 'ricotta, miód, wanilia, truskawki lub borówki',           przygotowanie: 'Ubij ricottę z miodem i wanilią. Podaj z owocami.',                                              kcal: 240, B: 12, T: 14, W: 14 },
  { id: 304, nazwa: 'Jogurt z granolą orzechową',          czas:  5, opis: 'sycące, chrupiące',          skladniki: 'jogurt grecki, orzechy, wiórki kokosowe, cynamon, miód',  przygotowanie: 'Przełóż jogurt, posyp granolą orzechową i skrop miodem.',                                        kcal: 320, B: 14, T: 18, W: 16 },
  { id: 305, nazwa: 'Twarożek z kaparami i łososiem',      czas:  5, opis: 'premium, keto',             skladniki: 'twaróg, łosoś wędzony, kapary, koper, sok z cytryny',    przygotowanie: 'Wymieszaj twaróg, ułóż łososia, posyp kaparami i koperkiem. Skrop cytryną.',                   kcal: 260, B: 24, T: 14, W:  2 },
  { id: 306, nazwa: 'Koktajl czekoladowo-proteinowy',      czas:  5, opis: 'szybki, białkowy',          skladniki: 'białko czekoladowe, mleko migdałowe, kakao, banan, lód',  przygotowanie: 'Zblenduj wszystkie składniki na gładki, gęsty koktajl.',                                         kcal: 280, B: 32, T:  6, W: 18 },
  { id: 307, nazwa: 'Jajka ze szpinakiem i czosnkiem',     czas:  8, opis: 'lekkie, keto',              skladniki: 'jajka, świeży szpinak, czosnek, oliwa, sól morska',       przygotowanie: 'Podsmaż szpinak z czosnkiem 2 min. Wbij jajka, smaż pod przykryciem do ścięcia białek.',         kcal: 260, B: 20, T: 18, W:  2 },
  { id: 308, nazwa: 'Omlet z szynką i serem',              czas: 10, opis: 'szybki, sycący',            skladniki: 'jajka, szynka gotowana, ser żółty, masło, pieprz',        przygotowanie: 'Wlej jajka na roztopione masło. Ułóż szynkę i ser, smaż do ścięcia, złóż.',                    kcal: 380, B: 30, T: 28, W:  2 },
  { id: 309, nazwa: 'Serek wiejski z figą',                czas:  5, opis: 'słodkie, sezonowe',         skladniki: 'serek wiejski, figa świeża lub suszona, miód, orzechy',  przygotowanie: 'Ułóż serek w miseczce, dodaj pokrojoną figę, posyp orzechami i skrop miodem.',                 kcal: 220, B: 12, T:  8, W: 18 },
  { id: 310, nazwa: 'Owsianka orzechowa bez płatków',      czas: 10, opis: 'keto, sycąca',              skladniki: 'mąka migdałowa, orzechy, mleko, kakao, erytrytol',        przygotowanie: 'Wymieszaj mąkę migdałową z orzechami i mlekiem. Gotuj 5 min, dosłódź erytrytolem.',             kcal: 360, B: 12, T: 28, W:  8 },
  { id: 311, nazwa: 'Jajka z krewetkami',                  czas: 10, opis: 'eleganckie, keto',          skladniki: 'jajka, krewetki, masło, czosnek, natka pietruszki',       przygotowanie: 'Podsmaż krewetki z czosnkiem. Usmaż jajka sadzone, podaj z krewetkami.',                        kcal: 320, B: 30, T: 22, W:  2 },
  { id: 312, nazwa: 'Jogurt z owocami leśnymi',            czas:  5, opis: 'lekkie, owocowe',           skladniki: 'jogurt naturalny, jagody, maliny, truskawki, miód',       przygotowanie: 'Wlej jogurt do miseczki, ułóż owoce leśne, skrop miodem.',                                       kcal: 200, B:  8, T:  4, W: 26 },
  { id: 313, nazwa: 'Omlet z kremowym serem',              czas: 10, opis: 'kremowy, keto',             skladniki: 'jajka, serek kremowy, szczypiorek, masło, sól',           przygotowanie: 'Zrób omlet, nałóż serek kremowy i szczypiorek. Złóż i serwuj.',                                  kcal: 360, B: 22, T: 30, W:  2 },
  { id: 314, nazwa: 'Twarożek z rzodkiewką i koperkiem',   czas:  5, opis: 'świeży, wiosenny',          skladniki: 'twaróg, rzodkiewki, koper, szczypiorek, sól, oliwa',     przygotowanie: 'Pokrój rzodkiewki w półplasterki. Wymieszaj z twarożkiem, koperkiem i szczypiorkiem.',           kcal: 190, B: 16, T:  8, W:  6 },
  { id: 315, nazwa: 'Smoothie mango z imbirem',             czas:  5, opis: 'egzotyczne, orzeźwiające', skladniki: 'mango, imbir, sok z limonki, mleko kokosowe, lód',        przygotowanie: 'Zblenduj mango z imbirem, mlekiem kokosowym i lodem.',                                           kcal: 200, B:  2, T:  8, W: 28 },
  { id: 316, nazwa: 'Jajka z fetą i oliwkami',             czas:  8, opis: 'śródziemnomorskie',         skladniki: 'jajka, feta, oliwki, pomidor, oliwa, oregano',           przygotowanie: 'Usmaż jajka na oliwie. Podaj z fetą, oliwkami i pomidorem. Posyp oregano.',                    kcal: 300, B: 18, T: 22, W:  4 },
  { id: 317, nazwa: 'Omlet z marchewką i imbirem',         czas: 12, opis: 'słodkawy, warzywny',        skladniki: 'jajka, marchewka, imbir, oliwa, sól, koper',             przygotowanie: 'Zetrzyj marchewkę, podsmaż z imbirem. Wlej jajka, smaż do ścięcia.',                           kcal: 260, B: 18, T: 16, W:  8 },
  { id: 318, nazwa: 'Jogurt z orzechami brazylijskimi',    czas:  5, opis: 'keto, mineralne',           skladniki: 'jogurt grecki, orzechy brazylijskie, wiórki kokosowe, cynamon', przygotowanie: 'Przełóż jogurt, dodaj orzechy i wiórki, posyp cynamonem.',                                   kcal: 300, B: 12, T: 22, W: 10 },
  { id: 319, nazwa: 'Jajka z serem kozim',                 czas: 10, opis: 'kremowe, keto',             skladniki: 'jajka, ser kozi, tymianek, masło, pieprz',               przygotowanie: 'Usmaż jajka na maśle. Pokrusz ser kozi, posyp tymiankiem i pieprzem.',                          kcal: 340, B: 22, T: 26, W:  2 },
  { id: 320, nazwa: 'Krem z nerkowców',                    czas: 10, opis: 'wegański, kremowy',         skladniki: 'nerkowce namoczone, wanilia, erytrytol, mleko roślinne', przygotowanie: 'Zblenduj nerkowce z mlekiem roślinnym, wanilią i erytrytolem na gładki krem.',                   kcal: 280, B:  8, T: 18, W: 14 },

  // ── OBIADY 321–360 ────────────────────────────────────────────────────────
  { id: 321, nazwa: 'Kurczak po śródziemnomorsku',         czas: 25, opis: 'aromatyczny, zielony',      skladniki: 'kurczak, oliwki, kapar, pomidory, oliwa, rozmaryn',      przygotowanie: 'Usmaż kurczaka. Dodaj oliwki, kapary i pomidory. Duś 15 min z rozmarynem.',                    kcal: 380, B: 40, T: 18, W:  6 },
  { id: 322, nazwa: 'Wołowina z wasabi',                   czas: 15, opis: 'pikantna, azjatycka',       skladniki: 'wołowina, wasabi, sos sojowy, sezam, szczypiorek',       przygotowanie: 'Usmaż wołowinę rare. Wymieszaj sos sojowy z wasabi. Polej mięso, posyp sezamem.',              kcal: 360, B: 36, T: 22, W:  4 },
  { id: 323, nazwa: 'Krewetki aglio e olio',               czas: 15, opis: 'włoskie, szybkie',          skladniki: 'krewetki, czosnek, oliwa, chili, natka pietruszki',      przygotowanie: 'Podsmaż czosnek z chili na oliwie. Dodaj krewetki, smaż 3 min. Posyp natką.',                 kcal: 280, B: 28, T: 16, W:  4 },
  { id: 324, nazwa: 'Tofu w sosie miso',                   czas: 20, opis: 'umami, wegańskie',          skladniki: 'tofu twarde, pasta miso, mirin, imbir, szczypiorek',     przygotowanie: 'Wymieszaj miso z mirin i imbirem. Polej tofu, piecz 15 min w 200°C. Posyp szczypiorkiem.',     kcal: 280, B: 16, T: 14, W: 12 },
  { id: 325, nazwa: 'Kurczak z oliwkami i kaparami',       czas: 25, opis: 'śródziemnomorski, intensywny', skladniki: 'kurczak, oliwki, kapary, pomidory, czosnek, oliwa',    przygotowanie: 'Obsmaż kurczaka. Dodaj oliwki, kapary, pomidory i czosnek. Duś razem 15 min.',               kcal: 380, B: 40, T: 18, W:  8 },
  { id: 326, nazwa: 'Łosoś w glazurze miso',               czas: 20, opis: 'umami, keto',               skladniki: 'filet łososia, pasta miso, mirin, erytrytol, sezam',     przygotowanie: 'Zamarynuj łososia w glazurze miso. Grilluj lub piecz 12 min. Posyp sezamem.',                kcal: 400, B: 38, T: 24, W:  6 },
  { id: 327, nazwa: 'Indyk z szałwią i masłem',            czas: 20, opis: 'aromatyczny, klasyczny',    skladniki: 'filet z indyka, szałwia, masło, czosnek, sól morska',      przygotowanie: 'Smaż indyka na maśle z listkami szałwii i czosnkiem do złotego koloru.',                   kcal: 340, B: 40, T: 18, W:  2 },
  { id: 328, nazwa: 'Sałatka niçoise',                     czas: 15, opis: 'klasyczna, śródziemnomorska', skladniki: 'tuńczyk, jajka, fasolka szparagowa, oliwki, sałata, sos vinaigrette', przygotowanie: 'Ugotuj jajka i fasolkę. Ułóż wszystko na sałacie, polej dressingiem.',               kcal: 320, B: 28, T: 16, W: 10 },
  { id: 329, nazwa: 'Zupa ramen keto',                     czas: 25, opis: 'umami, sycąca',             skladniki: 'bulion kostny, jajko, kurczak, pieczarki, makaron konjac, sos sojowy', przygotowanie: 'Podgrzej bulion z sosem sojowym. Dodaj makaron konjac, kurczaka, pieczarki. Ułóż jajko.',  kcal: 320, B: 28, T: 16, W:  8 },
  { id: 330, nazwa: 'Curry czerwone z krewetkami',         czas: 20, opis: 'pikantne, kremowe',          skladniki: 'krewetki, czerwona pasta curry, mleko kokosowe, limonka, kolendra', przygotowanie: 'Podgrzej pastę curry, wlej mleko kokosowe. Dodaj krewetki, gotuj 5 min. Skrop limonką.',    kcal: 340, B: 28, T: 22, W:  8 },
  { id: 331, nazwa: 'Szaszłyki z kurczaka',                czas: 25, opis: 'grillowane, low carb',       skladniki: 'kurczak, papryka, cukinia, cebula, oliwa, zioła',         przygotowanie: 'Nadziewaj na patyczki kurczaka na przemian z warzywami. Grilluj 5 min z każdej strony.',      kcal: 320, B: 36, T: 14, W:  8 },
  { id: 332, nazwa: 'Wołowina w glazurze teriyaki',        czas: 20, opis: 'słodko-słona, azjatycka',   skladniki: 'wołowina, sos teriyaki, sezam, szczypiorek, imbir',       przygotowanie: 'Smaż mięso na dużym ogniu. Polej sosem teriyaki, gotuj do zgęstnienia.',                    kcal: 380, B: 36, T: 20, W: 10 },
  { id: 333, nazwa: 'Ryba w sosie kokosowym',              czas: 25, opis: 'kremowa, tropikalna',        skladniki: 'filet ryby, mleko kokosowe, imbir, limonka, kolendra',    przygotowanie: 'Duś rybę w mleku kokosowym z imbirem 15 min. Skrop limonką, posyp kolendrą.',               kcal: 320, B: 34, T: 16, W:  6 },
  { id: 334, nazwa: 'Tofu po tajsku',                      czas: 20, opis: 'pikantne, wegańskie',        skladniki: 'tofu, pasta tajska, mleko kokosowe, bazylia tajska, limonka', przygotowanie: 'Podsmaż tofu. Przygotuj sos z pasty tajskiej i mleka kokosowego. Duś razem 10 min.',          kcal: 300, B: 14, T: 18, W: 12 },
  { id: 335, nazwa: 'Kurczak z ziołami prowansalskimi',    czas: 30, opis: 'aromatyczny, klasyczny',     skladniki: 'kurczak, tymianek, rozmaryn, oregano, czosnek, oliwa',    przygotowanie: 'Natrzyj kurczaka ziołami. Piecz w 190°C przez 25 min.',                                        kcal: 360, B: 42, T: 16, W:  2 },
  { id: 336, nazwa: 'Łosoś z glazurą sojową',              czas: 15, opis: 'słodko-słony, keto',         skladniki: 'filet łososia, sos sojowy, erytrytol, czosnek, sezam',   przygotowanie: 'Zamarynuj łososia w sosie sojowym z erytrytolem. Smaż na patelni 4 min z każdej strony.',    kcal: 380, B: 38, T: 22, W:  4 },
  { id: 337, nazwa: 'Filet z indyka z żurawiną',             czas: 30, opis: 'słodko-kwaśna, świąteczna', skladniki: 'indyk, żurawina suszona, rozmaryn, bulion, masło',        przygotowanie: 'Usmaż indyka. Zrób sos z żurawiny, bulionu i masła. Podaj razem.',                           kcal: 360, B: 40, T: 14, W: 10 },
  { id: 338, nazwa: 'Sałatka waldorf keto',                czas: 15, opis: 'kremowa, klasyczna',         skladniki: 'kurczak, jabłko, seler naciowy, orzechy, majonez, sałata', przygotowanie: 'Pokrój kurczaka, jabłko i seler. Wymieszaj z majonezem i orzechami. Podaj na sałacie.',        kcal: 360, B: 28, T: 24, W: 10 },
  { id: 339, nazwa: 'Zupa minestrone',                     czas: 30, opis: 'włoska, warzywna',           skladniki: 'cukinia, pomidory, fasolka szparagowa, seler, bulion, bazylia', przygotowanie: 'Pokrój warzywa, gotuj w bulionie 20 min z bazylią.',                                         kcal: 180, B:  6, T:  6, W: 18 },
  { id: 340, nazwa: 'Kurczak z anchois i kaparami',        czas: 20, opis: 'śródziemnomorski, intensywny', skladniki: 'kurczak, anchois, kapary, czosnek, oliwa, cytryna',       przygotowanie: 'Usmaż kurczaka. Przygotuj sos z anchois, kaparów i czosnku. Polej mięso.',                 kcal: 360, B: 40, T: 18, W:  4 },
  { id: 341, nazwa: 'Wołowina w sosie grzybowym',          czas: 30, opis: 'klasyczna, low carb',        skladniki: 'wołowina, pieczarki, śmietana, cebula, tymianek, masło',  przygotowanie: 'Usmaż wołowinę. Podsmaż pieczarki z cebulą, dodaj śmietanę. Polej mięso sosem.',             kcal: 440, B: 38, T: 28, W:  8 },
  { id: 342, nazwa: 'Krewetki po azjatycku',               czas: 15, opis: 'szybkie, pikantne',          skladniki: 'krewetki, sos sojowy, chili, czosnek, imbir, sezam',      przygotowanie: 'Podsmaż czosnek z imbirem i chili. Dodaj krewetki, polej sosem sojowym. Posyp sezamem.',    kcal: 260, B: 26, T: 12, W:  6 },
  { id: 343, nazwa: 'Tofu słodko-kwaśne',                  czas: 20, opis: 'wegańskie, azjatyckie',      skladniki: 'tofu, papryka, cebula, sos sojowy, ocet ryżowy, erytrytol', przygotowanie: 'Podsmaż tofu. Zrób sos słodko-kwaśny z sosu sojowego, octu i erytrytolu. Wymieszaj.',          kcal: 280, B: 14, T: 12, W: 18 },
  { id: 344, nazwa: 'Kurczak z suszonymi pomidorami',      czas: 25, opis: 'intensywny, włoski',         skladniki: 'kurczak, suszone pomidory, czosnek, bazylia, oliwa, śmietanka', przygotowanie: 'Usmaż kurczaka. Dodaj suszone pomidory, czosnek i śmietankę. Duś 10 min.',                  kcal: 420, B: 40, T: 24, W:  8 },
  { id: 345, nazwa: 'Łosoś z masłem cytrynowym',           czas: 20, opis: 'delikatny, keto',            skladniki: 'filet łososia, masło, sok i skórka cytrynowa, koper',     przygotowanie: 'Usmaż łososia. Zrób sos z roztopionego masła, soku i skórki cytrynowej. Polej rybę.',        kcal: 400, B: 38, T: 26, W:  2 },
  { id: 346, nazwa: 'Indyk z orzechami',                   czas: 20, opis: 'chrupiący, aromatyczny',     skladniki: 'indyk, orzechy włoskie, musztarda, masło, rozmaryn',      przygotowanie: 'Natrzyj indyka musztardą. Obtoczy w posiekanych orzechach. Usmaż na maśle z rozmarynem.',   kcal: 380, B: 40, T: 20, W:  6 },
  { id: 347, nazwa: 'Sałatka z owocami morza',             czas: 15, opis: 'śródziemnomorska, lekka',    skladniki: 'krewetki, małże, sałata, pomidorki, oliwa, cytryna, pietruszka', przygotowanie: 'Ugotuj owoce morza. Wymieszaj z sałatą i pomidorkami. Skrop oliwą i cytryną.',              kcal: 280, B: 28, T: 12, W:  6 },
  { id: 348, nazwa: 'Zupa azjatycka z tofu',               czas: 25, opis: 'umami, wegańska',            skladniki: 'tofu jedwabiste, bulion warzywny, wodorosty, grzyby shiitake, sos sojowy', przygotowanie: 'Gotuj bulion z grzybami shiitake. Dodaj tofu i wodorosty. Dopraw sosem sojowym.',       kcal: 200, B: 12, T:  8, W: 12 },
  { id: 349, nazwa: 'Curry zielone z kurczakiem',          czas: 25, opis: 'pikantne, kremowe',           skladniki: 'kurczak, zielona pasta curry, mleko kokosowe, bazylia tajska, limonka', przygotowanie: 'Podsmaż zieloną pastę curry. Wlej mleko kokosowe, dodaj kurczaka. Duś 15 min.',          kcal: 420, B: 36, T: 26, W:  8 },
  { id: 350, nazwa: 'Wołowina po mongolsku',               czas: 15, opis: 'słodko-słona, szybka',       skladniki: 'wołowina, cebula dymka, sos sojowy, erytrytol, czosnek, imbir', przygotowanie: 'Smaż cienko krojoną wołowinę z czosnkiem i imbirem. Polej sosem sojowym z erytrytolem.',     kcal: 360, B: 36, T: 18, W:  8 },
  { id: 351, nazwa: 'Kurczak z ricottą i szpinakiem',      czas: 25, opis: 'kremowy, low carb',          skladniki: 'kurczak, ricotta, szpinak, czosnek, parmezan, oliwa',     przygotowanie: 'Nafaszeruj kurczaka ricottą ze szpinakiem. Piecz 20 min w 190°C.',                           kcal: 400, B: 42, T: 22, W:  4 },
  { id: 352, nazwa: 'Łosoś z kaparami i cytryną',          czas: 20, opis: 'keto, śródziemnomorski',     skladniki: 'łosoś, kapary, cytryna, masło, koper, sól morska',        przygotowanie: 'Piecz łososia. Zrób sos z masła, kaparów i cytryny. Polej rybę.',                           kcal: 400, B: 38, T: 26, W:  2 },
  { id: 353, nazwa: 'Tofu słodko-kwaśne z warzywami',     czas: 20, opis: 'kolorowe, wegańskie',        skladniki: 'tofu, papryka, ananas, sos sojowy, ocet ryżowy, skrobia',  przygotowanie: 'Podsmaż tofu z papryką. Dodaj sos słodko-kwaśny i ananas. Gotuj do zgęstnienia sosu.',     kcal: 300, B: 14, T: 12, W: 22 },
  { id: 354, nazwa: 'Kurczak z pistacjami',                czas: 20, opis: 'chrupiący, elegancki',       skladniki: 'kurczak, pistacje, musztarda, miód, tymianek',            przygotowanie: 'Posmaruj kurczaka musztardą. Obtocz w posiekanych pistacjach. Piecz 18 min.',                kcal: 400, B: 40, T: 20, W: 10 },
  { id: 355, nazwa: 'Ryba w sosie kaparowym',              czas: 20, opis: 'śródziemnomorska, elegancka', skladniki: 'filet ryby, kapary, oliwa, cytryna, pietruszka, czosnek', przygotowanie: 'Piecz rybę. Przygotuj sos z kaparów, oliwy, cytryny i czosnku. Polej rybę.',                 kcal: 280, B: 34, T: 12, W:  4 },
  { id: 356, nazwa: 'Wołowina w sosie grzybowym keto',     czas: 20, opis: 'klasyczna, keto',            skladniki: 'wołowina, pieczarki portobello, śmietanka 30%, tymianek', przygotowanie: 'Usmaż wołowinę. Podsmaż grzyby, dodaj śmietankę i tymianek. Polej mięso.',                  kcal: 440, B: 38, T: 30, W:  6 },
  { id: 357, nazwa: 'Indyk ze szpinakiem i fetą',          czas: 20, opis: 'low carb, śródziemnomorski', skladniki: 'indyk, szpinak, feta, oliwa, czosnek, oregano',           przygotowanie: 'Usmaż indyka. Podsmaż szpinak z czosnkiem. Dodaj fetę. Podaj razem.',                      kcal: 360, B: 42, T: 18, W:  4 },
  { id: 358, nazwa: 'Tofu z kurkumą i imbirem',            czas: 15, opis: 'przeciwzapalne, wegańskie',  skladniki: 'tofu twarde, kurkuma, imbir, czosnek, oliwa, sól morska', przygotowanie: 'Pokrój tofu. Podsmaż z kurkumą, imbirem i czosnkiem do złotego koloru.',                   kcal: 240, B: 14, T: 14, W:  6 },
  { id: 359, nazwa: 'Kurczak z migdałami i cynamonem',     czas: 20, opis: 'orientalny, aromatyczny',    skladniki: 'kurczak, migdały, cynamon, rodzynki, bulion, masło',      przygotowanie: 'Usmaż kurczaka. Dodaj migdały, cynamon i rodzynki, wlej bulion. Duś 10 min.',              kcal: 400, B: 40, T: 20, W: 12 },
  { id: 360, nazwa: 'Łosoś z sosem tahini i cytryną',      czas: 20, opis: 'kremowy, keto',              skladniki: 'łosoś, tahini, cytryna, czosnek, koper, sezam',           przygotowanie: 'Piecz łososia 18 min. Zrób sos z tahini, cytryny i czosnku. Polej rybę, posyp sezamem.',   kcal: 420, B: 38, T: 28, W:  4 },

  // ── KOLACJE 361–375 ───────────────────────────────────────────────────────
  { id: 361, nazwa: 'Sałatka z rukolą i orzechami',        czas: 10, opis: 'lekka, low carb',            skladniki: 'rukola, orzechy włoskie, parmezan, oliwa, balsamico',     przygotowanie: 'Ułóż rukolę, posyp orzechami i parmezanem. Skrop oliwą i balsamico.',                       kcal: 240, B:  8, T: 18, W:  6 },
  { id: 362, nazwa: 'Zupa miso z grzybami',                czas: 15, opis: 'umami, wegańska',             skladniki: 'pasta miso, grzyby shiitake, tofu, wodorosty, szczypiorek', przygotowanie: 'Zagotuj wodę z grzybami. Rozetrzeć miso, dodaj tofu i wodorosty. Posyp szczypiorkiem.',      kcal: 160, B: 10, T:  6, W: 10 },
  { id: 363, nazwa: 'Jajka zapiekane z pomidorami',        czas: 15, opis: 'proste, keto',               skladniki: 'jajka, pomidory, czosnek, oliwa, bazylia, parmezan',      przygotowanie: 'Ułóż pomidory w naczyniu, wbij jajka. Posyp parmezanem, piecz 12 min.',                   kcal: 260, B: 18, T: 18, W:  6 },
  { id: 364, nazwa: 'Sałatka z fetą i oliwkami',           czas: 10, opis: 'śródziemnomorska, szybka',   skladniki: 'feta, oliwki, ogórek, pomidor, cebula czerwona, oliwa',   przygotowanie: 'Pokrój warzywa. Wymieszaj z oliwkami i fetą. Skrop oliwą.',                                  kcal: 260, B: 10, T: 20, W:  8 },
  { id: 365, nazwa: 'Zupa z soczewicy czerwonej',          czas: 25, opis: 'sycąca, dash',               skladniki: 'soczewica czerwona, pomidory, cebula, kumin, kurkuma, bulion', przygotowanie: 'Gotuj soczewicę z pomidorami, cebulą i przyprawami 20 min. Zblenduj częściowo.',              kcal: 220, B: 12, T:  4, W: 28 },
  { id: 366, nazwa: 'Awokado faszerowane tuńczykiem',      czas: 10, opis: 'keto, sycące',               skladniki: 'awokado, tuńczyk, majonez, sok z cytryny, szczypiorek',  przygotowanie: 'Wydrąż awokado. Wymieszaj tuńczyka z majonezem i cytryną. Nafaszeruj awokado.',              kcal: 360, B: 24, T: 28, W:  4 },
  { id: 367, nazwa: 'Sałatka z orzechami i gorgonzolą',   czas: 10, opis: 'intensywna, low carb',       skladniki: 'sałata, gorgonzola, orzechy włoskie, gruszka, oliwa, miód', przygotowanie: 'Ułóż sałatę, pokrusz gorgonzolę. Dodaj orzechy i gruszkę. Skrop oliwą z miodem.',            kcal: 320, B: 10, T: 24, W: 12 },
  { id: 368, nazwa: 'Zupa z pieczarek',                    czas: 20, opis: 'kremowa, wegańska',           skladniki: 'pieczarki, cebula, czosnek, bulion warzywny, mleko kokosowe', przygotowanie: 'Podsmaż pieczarki z cebulą i czosnkiem. Zblenduj z bulionem i mlekiem kokosowym.',           kcal: 180, B:  6, T: 10, W: 10 },
  { id: 369, nazwa: 'Jajka z warzywami grillowanymi',      czas: 15, opis: 'lekkie, keto',               skladniki: 'jajka, cukinia, papryka, cebula, oliwa, zioła',           przygotowanie: 'Grilluj warzywa 8 min. Usmaż jajka sadzone. Podaj razem.',                                    kcal: 280, B: 16, T: 20, W:  8 },
  { id: 370, nazwa: 'Sałatka caprese z tuńczykiem',        czas: 10, opis: 'włoska, lekka',              skladniki: 'mozzarella, pomidory, tuńczyk, bazylia, oliwa, balsamico', przygotowanie: 'Ułóż mozzarellę z pomidorami i tuńczykiem. Posyp bazylią, skrop oliwą.',                     kcal: 320, B: 28, T: 18, W:  6 },
  { id: 371, nazwa: 'Zupa z cukinii i mięty',              czas: 20, opis: 'lekka, świeża',              skladniki: 'cukinia, mięta, jogurt naturalny, czosnek, bulion, cytryna', przygotowanie: 'Ugotuj cukinię z czosnkiem. Zblenduj z miętą i jogurtem. Podaj z cytryną.',                  kcal: 160, B:  6, T:  4, W: 14 },
  { id: 372, nazwa: 'Jajka po florencku',                  czas: 15, opis: 'klasyczne, low carb',         skladniki: 'jajka, szpinak, śmietana, gałka muszkatołowa, parmezan',  przygotowanie: 'Podsmaż szpinak ze śmietaną. Ułóż w naczyniu, wbij jajka. Posyp parmezanem, piecz 10 min.', kcal: 300, B: 22, T: 22, W:  4 },
  { id: 373, nazwa: 'Sałatka z łososiem i awokado',        czas: 15, opis: 'premium, keto',              skladniki: 'łosoś wędzony, awokado, rukola, kapary, oliwa, cytryna',  przygotowanie: 'Ułóż rukolę, dodaj łososia i awokado. Posyp kaparami, skrop oliwą i cytryną.',              kcal: 360, B: 28, T: 26, W:  4 },
  { id: 374, nazwa: 'Zupa pieczarkowa keto',               czas: 20, opis: 'kremowa, keto',              skladniki: 'pieczarki, śmietanka 30%, bulion, czosnek, tymianek, masło', przygotowanie: 'Podsmaż pieczarki z czosnkiem i masłem. Dodaj bulion i śmietankę. Gotuj 10 min.',             kcal: 240, B:  8, T: 18, W:  8 },
  { id: 375, nazwa: 'Faszerowana papryka',                 czas: 30, opis: 'kolorowa, low carb',          skladniki: 'papryka, mięso mielone, cebula, pomidory, czosnek, ser',  przygotowanie: 'Wydrąż paprykę. Nafaszeruj mięsem mielonym z cebulą i pomidorami. Posyp serem. Piecz 25 min.', kcal: 360, B: 28, T: 18, W: 14 },

  // ── DESERY 376–385 ────────────────────────────────────────────────────────
  { id: 376, nazwa: 'Trufle kakaowe keto',                 czas: 10, opis: 'intensywne, czekoladowe',    skladniki: 'kakao, masło kokosowe, erytrytol, wanilia, szczypta soli', przygotowanie: 'Wymieszaj wszystkie składniki, uformuj kulki. Obtocz w kakao. Schłódź 30 min.',                kcal: 180, B:  2, T: 16, W:  4 },
  { id: 377, nazwa: 'Ciasto orzechowe bez mąki',           czas: 40, opis: 'wilgotne, keto',             skladniki: 'orzechy mielone, jajka, erytrytol, masło, proszek do pieczenia', przygotowanie: 'Wymieszaj składniki. Piecz w 175°C przez 30 min.',                                         kcal: 320, B: 10, T: 26, W:  6 },
  { id: 378, nazwa: 'Panna cotta kokosowa',                czas: 15, opis: 'kremowa, wegańska',           skladniki: 'mleko kokosowe, żelatyna roślinna, erytrytol, wanilia',   przygotowanie: 'Podgrzej mleko z erytrytolem. Dodaj żelatynę, wlej do foremek, schłódź 2 godz.',              kcal: 220, B:  2, T: 18, W:  8 },
  { id: 379, nazwa: 'Krem cytrynowy',                      czas: 10, opis: 'świeży, low carb',           skladniki: 'śmietanka, sok i skórka cytrynowa, erytrytol, żółtka',   przygotowanie: 'Gotuj żółtka z cytryną i erytrytolem do zgęstnienia. Wmieszaj ubitą śmietankę.',             kcal: 240, B:  4, T: 20, W:  8 },
  { id: 380, nazwa: 'Kulki czekoladowo-daktylowe',         czas: 10, opis: 'naturalne, wegańskie',        skladniki: 'daktyle, kakao, orzechy, wiórki kokosowe, sól',           przygotowanie: 'Zmiksuj daktyle z kakao i orzechami. Uformuj kulki, obtocz w wiórk ach.',                   kcal: 200, B:  4, T:  8, W: 28 },
  { id: 381, nazwa: 'Sernik z malinami',                   czas: 60, opis: 'klasyczny, low carb',         skladniki: 'twaróg, jajka, erytrytol, śmietana, maliny, żelatyna',   przygotowanie: 'Wymieszaj składniki. Wlej do formy. Piecz w 160°C przez 45 min. Udekoruj malinami.',        kcal: 280, B: 14, T: 18, W:  8 },
  { id: 382, nazwa: 'Mus z białej czekolady keto',         czas: 10, opis: 'kremowy, keto',              skladniki: 'śmietanka, kakao masło, erytrytol, wanilia, białka jaj',  przygotowanie: 'Ubij śmietankę z erytrytolem. Dodaj roztopione kakao masło i wanilię. Dodaj ubite białka.',  kcal: 280, B:  6, T: 24, W:  4 },
  { id: 383, nazwa: 'Lody pistacjowe keto',                czas: 15, opis: 'kremowe, luksusowe',          skladniki: 'śmietanka, pistacje mielone, erytrytol, wanilia, żółtka', przygotowanie: 'Ubij śmietankę z żółtkami i erytrytolem. Dodaj mielone pistacje. Mroź 4 godz.',             kcal: 300, B:  6, T: 26, W:  6 },
  { id: 384, nazwa: 'Ciasto marchewkowe low carb',         czas: 50, opis: 'wilgotne, korzenne',          skladniki: 'marchewka, mąka migdałowa, jajka, erytrytol, cynamon, orzechy', przygotowanie: 'Zetrzyj marchewkę. Wymieszaj składniki, piecz w 175°C przez 35 min.',                     kcal: 280, B:  8, T: 20, W: 14 },
  { id: 385, nazwa: 'Krem orzechowy domowy',               czas:  5, opis: 'szybki, keto',               skladniki: 'orzechy laskowe lub migdały, sól, olej kokosowy',          przygotowanie: 'Zblenduj orzechy z olejem kokosowym i solą na gładki krem.',                                 kcal: 340, B:  8, T: 30, W:  8 },

  // ── PRZEKĄSKI / DODATKI 386–400 ───────────────────────────────────────────
  { id: 386, nazwa: 'Orzechy z rozmarynem',                czas: 10, opis: 'chrupiące, keto',            skladniki: 'orzechy mieszane, rozmaryn, oliwa, sól morska, pieprz',   przygotowanie: 'Wymieszaj orzechy z oliwą i rozmarynem. Praż w 180°C przez 8 min.',                         kcal: 220, B:  6, T: 20, W:  4 },
  { id: 387, nazwa: 'Jajka deviled',                       czas: 15, opis: 'klasyczne, keto',            skladniki: 'jajka, majonez, musztarda, papryka, szczypiorek',         przygotowanie: 'Ugotuj jajka. Wyjmij żółtka, wymieszaj z majonezem i musztardą. Nafaszeruj białka.',        kcal: 240, B: 14, T: 20, W:  2 },
  { id: 388, nazwa: 'Chipsy z jarmużu',                   czas: 20, opis: 'chrupiące, wegańskie',        skladniki: 'jarmuż, oliwa, sól morska, czosnek granulowany',          przygotowanie: 'Wyrwij liście jarmużu, skrop oliwą. Piecz w 180°C przez 12 min do chrupkości.',              kcal: 100, B:  4, T:  6, W:  6 },
  { id: 389, nazwa: 'Baton orzechowy keto',                czas: 10, opis: 'energetyczny, keto',         skladniki: 'orzechy, masło orzechowe, kakao, erytrytol, sól',         przygotowanie: 'Wymieszaj składniki, uformuj baton. Schłódź 1 godz. w lodówce.',                             kcal: 280, B:  8, T: 22, W:  8 },
  { id: 390, nazwa: 'Dip z awokado i fety',               czas: 10, opis: 'kremowy, keto',              skladniki: 'awokado, feta, czosnek, sok z cytryny, oliwa, koper',     przygotowanie: 'Zblenduj awokado z fetą, czosnkiem i cytryną na gładki dip.',                                kcal: 220, B:  6, T: 18, W:  6 },
  { id: 391, nazwa: 'Chipsy parmezanowe',                  czas: 15, opis: 'chrupiące, keto',            skladniki: 'parmezan starty, oregano, pieprz',                         przygotowanie: 'Uformuj małe kopczyki parmezanu na papierze do pieczenia. Piecz w 200°C przez 6 min.',      kcal: 180, B: 14, T: 14, W:  1 },
  { id: 392, nazwa: 'Pasta z nerkowców',                   czas: 10, opis: 'kremowa, wegańska',           skladniki: 'nerkowce, sok z cytryny, czosnek, sól, woda',             przygotowanie: 'Namoczone nerkowce zblenduj z czosnkiem, cytryną i wodą na gładką pastę.',                   kcal: 200, B:  6, T: 14, W: 10 },
  { id: 393, nazwa: 'Oliwki marynowane',                   czas:  5, opis: 'szybkie, keto',              skladniki: 'oliwki, oliwa, czosnek, rozmaryn, skórka cytrynowa, chili', przygotowanie: 'Wymieszaj oliwki z pozostałymi składnikami. Podaj od razu lub marynuj kilka godzin.',       kcal: 160, B:  1, T: 16, W:  2 },
  { id: 394, nazwa: 'Awokado z sosem sojowym',             czas:  5, opis: 'szybkie, keto',              skladniki: 'awokado, sos sojowy, sezam, szczypiorek, wasabi opcjonalnie', przygotowanie: 'Pokrój awokado na plastry. Polej sosem sojowym, posyp sezamem i szczypiorkiem.',              kcal: 220, B:  2, T: 20, W:  4 },
  { id: 395, nazwa: 'Mix orzechów z solą morską',          czas:  5, opis: 'szybkie, keto',              skladniki: 'orzechy włoskie, migdały, nerkowce, pistacje, sól morska', przygotowanie: 'Wymieszaj orzechy, posyp solą morską. Podaj jako przekąskę.',                                  kcal: 220, B:  6, T: 20, W:  4 },
  { id: 396, nazwa: 'Krem tahini z cytryną',               czas:  5, opis: 'kremowy, wegański',           skladniki: 'tahini, sok z cytryny, czosnek, woda, sól',               przygotowanie: 'Wymieszaj tahini z sokiem z cytryny, czosnkiem i wodą na gładki sos.',                      kcal: 180, B:  6, T: 16, W:  4 },
  { id: 397, nazwa: 'Twarożek z ogórkiem i miętą',         czas:  5, opis: 'świeży, szybki',             skladniki: 'twaróg, ogórek, mięta, sok z limonki, sól',               przygotowanie: 'Zetrzyj ogórek, odciśnij wodę. Wymieszaj z twarożkiem, miętą i sokiem z limonki.',          kcal: 180, B: 14, T:  8, W:  6 },
  { id: 398, nazwa: 'Grzyby marynowane',                   czas: 20, opis: 'kwaskowate, wegańskie',       skladniki: 'pieczarki, ocet jabłkowy, czosnek, zioła, oliwa, cukier', przygotowanie: 'Blanszuj pieczarki 3 min. Zamarynuj w zalewie z octu, czosnku i ziół. Odczekaj 2 godz.',       kcal: 100, B:  2, T:  6, W:  6 },
  { id: 399, nazwa: 'Pasta jajeczna z kaparami',           czas: 10, opis: 'intensywna, keto',           skladniki: 'jajka ugotowane, kapary, anchois, majonez, musztarda',    przygotowanie: 'Posiekaj jajka, kapary i anchois. Wymieszaj z majonezem i musztardą.',                       kcal: 260, B: 14, T: 22, W:  2 },
  { id: 400, nazwa: 'Masło z orzechów macadamia',          czas: 10, opis: 'luksusowe, keto',            skladniki: 'orzechy macadamia, sól morska, olej kokosowy, wanilia',   przygotowanie: 'Zblenduj orzechy macadamia z olejem kokosowym, solą i wanilią na gładki krem.',               kcal: 360, B:  4, T: 36, W:  4 },

  // ── ŚNIADANIA 401–420 ─────────────────────────────────────────────────────
  { id: 401, nazwa: 'Pancakes z mąki kokosowej',           czas: 15, opis: 'puszyste, low carb',          skladniki: 'mąka kokosowa, jajka, mleko kokosowe, proszek do pieczenia, erytrytol', przygotowanie: 'Wymieszaj składniki na gładkie ciasto. Smaż małe placuszki na maśle.',                   kcal: 300, B: 14, T: 18, W: 12 },
  { id: 402, nazwa: 'Granola domowa keto',                 czas: 20, opis: 'chrupiąca, orzechowa',        skladniki: 'orzechy mieszane, nasiona, wiórki kokosowe, oliwa kokosowa, erytrytol, cynamon', przygotowanie: 'Wymieszaj, rozłóż na blasze. Piecz w 160°C przez 15 min.',              kcal: 340, B: 10, T: 28, W:  8 },
  { id: 403, nazwa: 'Shakshuka',                           czas: 20, opis: 'pikantna, bliskowschodnia',   skladniki: 'jajka, pomidory pelati, papryka, cebula, kumin, papryka, czosnek',         przygotowanie: 'Podsmaż warzywa z przyprawami. Wbij jajka w sos, gotuj pod przykryciem 8 min.',            kcal: 280, B: 18, T: 16, W: 12 },
  { id: 404, nazwa: 'Jajka z awokado i łososiem',          czas: 10, opis: 'premium, keto',              skladniki: 'jajka, awokado, łosoś wędzony, kapary, sok z cytryny',                   przygotowanie: 'Usmaż jajka sadzone. Ułóż z awokado i łososiem. Posyp kaparami, skrop cytryną.',           kcal: 420, B: 30, T: 32, W:  2 },
  { id: 405, nazwa: 'Omlet z serem kozim i rukolą',        czas: 12, opis: 'elegancki, keto',            skladniki: 'jajka, ser kozi, rukola, oliwa, pieprz, skórka cytrynowa',               przygotowanie: 'Zrób omlet. Ułóż rukolę i pokruszony ser kozi. Skrop oliwą, posyp skórką cytrynową.',      kcal: 340, B: 22, T: 26, W:  2 },
  { id: 406, nazwa: 'Pudding chia z mango',                czas:  5, opis: 'wegański, tropikalny',        skladniki: 'nasiona chia, mleko kokosowe, mango, erytrytol, wanilia',               przygotowanie: 'Wymieszaj chia z mlekiem i erytrytolem. Odstaw noc. Rano dodaj pokrojone mango.',           kcal: 240, B:  6, T: 12, W: 20 },
  { id: 407, nazwa: 'Jajka po turecku (çılbır)',           czas: 15, opis: 'orientalne, kremowe',         skladniki: 'jajka, jogurt grecki, masło, papryka, czosnek, ocet',                   przygotowanie: 'Zrób jajka w koszulce. Podaj na jogurcie z czosnkiem. Polej masłem z papryką.',             kcal: 360, B: 22, T: 26, W:  8 },
  { id: 408, nazwa: 'Tost z awokado na keto chlebie',      czas: 10, opis: 'kremowy, keto',              skladniki: 'chleb keto, awokado, sok z cytryny, sól morska, papryka wędzona',       przygotowanie: 'Upiecz chleb keto. Rozgnieć awokado z cytryną i solą. Nałóż na chleb.',                     kcal: 360, B: 10, T: 28, W:  8 },
  { id: 409, nazwa: 'Omlet ze szparagami i ricottą',       czas: 12, opis: 'kremowy, delikatny',          skladniki: 'jajka, szparagi, ricotta, masło, skórka cytrynowa',                     przygotowanie: 'Blanszuj szparagi. Wlej jajka na masło. Nałóż ricottę i szparagi, złóż omlet.',             kcal: 320, B: 22, T: 22, W:  4 },
  { id: 410, nazwa: 'Smoothie bowl z pitaya',              czas: 10, opis: 'kolorowe, wegańskie',         skladniki: 'pitaya, banan, mleko kokosowe, granola, owoce, kokos',                  przygotowanie: 'Zblenduj pitaya z bananem i mlekiem. Wlej do miseczki, udekoruj dodatkami.',                kcal: 280, B:  4, T: 10, W: 36 },
  { id: 411, nazwa: 'Jajka benedyktyńskie low carb',       czas: 15, opis: 'eleganckie, kremowe',         skladniki: 'jajka, łosoś wędzony, sos hollandaise, szpinak, sól',                  przygotowanie: 'Zrób jajka w koszulce. Ułóż na szpinaku z łososiem. Polej sosem hollandaise.',              kcal: 440, B: 28, T: 36, W:  2 },
  { id: 412, nazwa: 'Granola z nasionami bez płatków',     czas: 20, opis: 'keto, chrupiąca',            skladniki: 'nasiona dyni, słonecznik, sezam, len, erytrytol, cynamon, olej',        przygotowanie: 'Wymieszaj nasiona z olejem i erytrytolem. Piecz w 160°C przez 15 min.',                     kcal: 280, B: 10, T: 22, W:  6 },
  { id: 413, nazwa: 'Omlet z parmezanem i tymiankiem',     czas: 10, opis: 'klasyczny, keto',            skladniki: 'jajka, parmezan, tymianek, masło, pieprz',                              przygotowanie: 'Roztrzep jajka. Smaż omlet na maśle. Posyp parmezanem i tymiankiem, złóż.',                 kcal: 320, B: 24, T: 24, W:  2 },
  { id: 414, nazwa: 'Jogurt z tahini i miodem',            czas:  5, opis: 'kremowy, orientalny',         skladniki: 'jogurt grecki, tahini, miód, sezam, cynamon',                          przygotowanie: 'Wymieszaj jogurt z tahini. Polej miodem, posyp sezamem i cynamonem.',                        kcal: 300, B: 14, T: 16, W: 18 },
  { id: 415, nazwa: 'Jajka sadzone z czosnkiem i oliwą',   czas:  8, opis: 'proste, śródziemnomorskie', skladniki: 'jajka, oliwa, czosnek, sól morska, pietruszka',                         przygotowanie: 'Podsmaż czosnek na oliwie. Wbij jajka, smaż do ścięcia. Posyp pietruszką.',                 kcal: 240, B: 14, T: 20, W:  2 },
  { id: 416, nazwa: 'Smoothie z awokado i szpinakiem',     czas:  5, opis: 'kremowe, keto',              skladniki: 'awokado, szpinak, mleko kokosowe, imbir, sok z cytryny, erytrytol',    przygotowanie: 'Zblenduj wszystkie składniki na gładki, kremowy koktajl.',                                    kcal: 300, B:  4, T: 24, W:  8 },
  { id: 417, nazwa: 'Omlet z suszonymi pomidorami',         czas: 12, opis: 'intensywny, włoski',         skladniki: 'jajka, suszone pomidory, bazylia, parmezan, oliwa',                    przygotowanie: 'Wlej jajka na oliwę. Dodaj pokrojone suszone pomidory i bazylię. Posyp parmezanem.',         kcal: 320, B: 22, T: 22, W:  6 },
  { id: 418, nazwa: 'Twarożek z łososiem w awokado',       czas:  5, opis: 'premium, keto',              skladniki: 'awokado, twaróg, łosoś wędzony, koper, cytryna',                       przygotowanie: 'Wydrąż awokado. Wymieszaj twaróg z łososiem i koperkiem. Nafaszeruj awokado.',               kcal: 360, B: 22, T: 28, W:  4 },
  { id: 419, nazwa: 'Jajka z pesto i rukolą',              czas: 10, opis: 'aromatyczne, keto',          skladniki: 'jajka, pesto bazyliowe, rukola, parmezan, oliwa',                      przygotowanie: 'Usmaż jajka. Podaj na rukolą, nałóż pesto. Posyp parmezanem.',                               kcal: 340, B: 22, T: 26, W:  2 },
  { id: 420, nazwa: 'Omlet z ricottą i jagodami',           czas: 12, opis: 'słodki, delikatny',         skladniki: 'jajka, ricotta, jagody, erytrytol, wanilia, masło',                    przygotowanie: 'Roztrzep jajka z erytrytolem. Zrób omlet, nałóż ricottę i jagody.',                         kcal: 300, B: 18, T: 20, W: 10 },

  // ── OBIADY 421–460 ────────────────────────────────────────────────────────
  { id: 421, nazwa: 'Kurczak z sosem tahini',              czas: 25, opis: 'kremowy, śródziemnomorski',  skladniki: 'kurczak, tahini, czosnek, cytryna, kumin, natka',                      przygotowanie: 'Upiecz kurczaka. Zrób sos z tahini, czosnku i cytryny. Polej mięso.',                       kcal: 420, B: 42, T: 22, W:  6 },
  { id: 422, nazwa: 'Wołowina z bakłażanem',               czas: 30, opis: 'bogata, low carb',           skladniki: 'wołowina, bakłażan, cebula, pomidory, czosnek, oregano',               przygotowanie: 'Podsmaż mięso z cebulą. Dodaj bakłażan i pomidory. Duś 20 min.',                            kcal: 400, B: 36, T: 22, W: 10 },
  { id: 423, nazwa: 'Łosoś z chimichurri',                 czas: 20, opis: 'zielony, intensywny',        skladniki: 'łosoś, natka, oregano, czosnek, oliwa, ocet, chili',                  przygotowanie: 'Przygotuj chimichurri miksując zioła z oliwą. Upiecz łososia, polej sosem.',                kcal: 400, B: 38, T: 26, W:  2 },
  { id: 424, nazwa: 'Tofu z orzechami nerkowca',           czas: 15, opis: 'chrupiące, wegańskie',       skladniki: 'tofu, nerkowce, sos sojowy, imbir, czosnek, olej',                     przygotowanie: 'Podsmaż tofu na złoto. Dodaj nerkowce, imbir i czosnek. Polej sosem sojowym.',              kcal: 340, B: 18, T: 22, W: 12 },
  { id: 425, nazwa: 'Kurczak po marokańsku',               czas: 30, opis: 'korzenny, aromatyczny',      skladniki: 'kurczak, ras el hanout, ciecierzyca, suszone morele, cytryna, kolendra', przygotowanie: 'Obsmaż kurczaka z przyprawami. Dodaj ciecierzycę, morele i bulion. Duś 20 min.',            kcal: 420, B: 38, T: 16, W: 18 },
  { id: 426, nazwa: 'Dorada pieczona z ziołami',           czas: 25, opis: 'lekka, śródziemnomorska',   skladniki: 'dorada, tymianek, rozmaryn, czosnek, oliwa, cytryna',                  przygotowanie: 'Natrzyj rybę ziołami i czosnkiem. Piecz w 190°C przez 20 min.',                             kcal: 300, B: 38, T: 14, W:  2 },
  { id: 427, nazwa: 'Indyk z pieczarkami portobello',      czas: 20, opis: 'bogaty, umami',              skladniki: 'indyk, pieczarki portobello, czosnek, tymianek, śmietanka',            przygotowanie: 'Usmaż indyka. Podsmaż portobello z czosnkiem, dodaj śmietankę. Polej mięso.',               kcal: 360, B: 40, T: 18, W:  6 },
  { id: 428, nazwa: 'Sałatka z kurczakiem i orzechami',   czas: 15, opis: 'sycąca, chrupiąca',          skladniki: 'kurczak grillowany, orzechy, jabłko, sałata, oliwa, cytryna',          przygotowanie: 'Pokrój kurczaka i jabłko. Wymieszaj z sałatą i orzechami. Skrop oliwą.',                   kcal: 340, B: 30, T: 18, W: 10 },
  { id: 429, nazwa: 'Zupa gulaszowa keto',                  czas: 30, opis: 'sycąca, rozgrzewająca',    skladniki: 'wołowina, papryka, pomidory, cebula, papryka słodka i ostra, bulion',   przygotowanie: 'Podsmaż mięso z cebulą. Dodaj paprykę, pomidory i bulion. Duś 20 min.',                    kcal: 360, B: 36, T: 18, W:  8 },
  { id: 430, nazwa: 'Curry z bakłażanem',                  czas: 25, opis: 'kremowe, wegańskie',         skladniki: 'bakłażan, mleko kokosowe, curry, pomidory, czosnek, imbir',            przygotowanie: 'Podsmaż bakłażan. Dodaj pastę curry, mleko kokosowe i pomidory. Duś 15 min.',               kcal: 280, B:  6, T: 16, W: 18 },
  { id: 431, nazwa: 'Kurczak teriyaki z brokułem',         czas: 20, opis: 'słodko-słony, azjatycki',   skladniki: 'kurczak, brokuł, sos teriyaki, sezam, imbir',                          przygotowanie: 'Usmaż kurczaka, polej sosem teriyaki. Dodaj brokuł, gotuj razem 5 min. Posyp sezamem.',     kcal: 360, B: 40, T: 14, W: 12 },
  { id: 432, nazwa: 'Wołowina z salsa verde',              czas: 20, opis: 'zielona, intensywna',        skladniki: 'wołowina, natka, kapary, anchois, czosnek, oliwa, ocet',               przygotowanie: 'Usmaż wołowinę. Zblenduj natką, kaparami i anchois. Polej mięso zielonym sosem.',           kcal: 420, B: 38, T: 26, W:  4 },
  { id: 433, nazwa: 'Ryba z tymiankiem i cytryną',         czas: 20, opis: 'lekka, klasyczna',           skladniki: 'filet ryby, tymianek, cytryna, oliwa, czosnek, sól morska',           przygotowanie: 'Natrzyj rybę ziołami. Piecz z cytryną i oliwą w 185°C przez 16 min.',                      kcal: 280, B: 34, T: 12, W:  4 },
  { id: 434, nazwa: 'Tofu z sosem orzechowym',             czas: 20, opis: 'kremowe, wegańskie',         skladniki: 'tofu, masło orzechowe, sos sojowy, imbir, czosnek, limonka',           przygotowanie: 'Usmaż tofu. Przygotuj sos z masła orzechowego z soją i limonką. Polej tofu.',               kcal: 340, B: 18, T: 22, W: 12 },
  { id: 435, nazwa: 'Kurczak ze szparagami',               czas: 20, opis: 'sezonowy, low carb',         skladniki: 'kurczak, szparagi, czosnek, masło, skórka cytrynowa, parmezan',        przygotowanie: 'Usmaż kurczaka. Podsmaż szparagi z czosnkiem. Podaj razem, posyp parmezanem.',              kcal: 360, B: 42, T: 16, W:  6 },
  { id: 436, nazwa: 'Łosoś z kremem wasabi',               czas: 15, opis: 'pikantny, keto',             skladniki: 'łosoś, wasabi, śmietanka, sezam, sos sojowy',                          przygotowanie: 'Usmaż łososia. Zrób sos śmietankowy z wasabi i sosem sojowym. Polej rybę.',                kcal: 400, B: 38, T: 26, W:  4 },
  { id: 437, nazwa: 'Indyk z papryką i fetą',              czas: 20, opis: 'kolorowy, low carb',         skladniki: 'indyk, papryka czerwona, feta, oliwa, czosnek, oregano',               przygotowanie: 'Usmaż indyka z papryką i czosnkiem. Posyp pokruszoną fetą i oregano.',                     kcal: 360, B: 42, T: 18, W:  6 },
  { id: 438, nazwa: 'Sałatka z krewetkami i mango',        czas: 15, opis: 'tropikalna, lekka',          skladniki: 'krewetki, mango, awokado, kolendra, limonka, oliwa',                   przygotowanie: 'Ugotuj krewetki. Pokrój mango i awokado. Wymieszaj, skrop limonką.',                        kcal: 300, B: 24, T: 14, W: 18 },
  { id: 439, nazwa: 'Zupa pomidorowa z bazylią',           czas: 20, opis: 'klasyczna, dash',             skladniki: 'pomidory pelati, bazylia, cebula, czosnek, oliwa, bulion',             przygotowanie: 'Podsmaż cebulę z czosnkiem. Dodaj pomidory i bulion. Gotuj 15 min, zblenduj z bazylią.',   kcal: 160, B:  4, T:  6, W: 14 },
  { id: 440, nazwa: 'Kurczak w sosie grzybowym',           czas: 25, opis: 'kremowy, klasyczny',         skladniki: 'kurczak, pieczarki, śmietanka, szalotka, tymianek, masło',            przygotowanie: 'Usmaż kurczaka. Podsmaż pieczarki z szalotką, wlej śmietankę. Duś razem 10 min.',          kcal: 400, B: 42, T: 22, W:  6 },
  { id: 441, nazwa: 'Wołowina z pesto',                    czas: 20, opis: 'aromatyczna, keto',           skladniki: 'wołowina, pesto bazyliowe, pomidorki, parmezan, rukola',               przygotowanie: 'Usmaż wołowinę do wybranego stopnia wypieczenia. Polej pesto, podaj z pomidorkami.',        kcal: 460, B: 40, T: 30, W:  4 },
  { id: 442, nazwa: 'Krewetki z masłem czosnkowym',        czas: 10, opis: 'szybkie, keto',              skladniki: 'krewetki, masło, czosnek, wino białe, natka, cytryna',                 przygotowanie: 'Podsmaż czosnek w maśle. Dodaj krewetki i wino, gotuj 3 min. Posyp natką.',                kcal: 280, B: 28, T: 18, W:  2 },
  { id: 443, nazwa: 'Tofu w sosie z tamaryndowca',         czas: 20, opis: 'kwaśno-słodkie, wegańskie',  skladniki: 'tofu, pasta tamaryndowa, sos sojowy, imbir, erytrytol, kolendra',     przygotowanie: 'Podsmaż tofu. Zrób sos z tamaryndowca, soji i erytrytolu. Polej tofu.',                    kcal: 280, B: 14, T: 14, W: 14 },
  { id: 444, nazwa: 'Kurczak z fetą i oliwkami',           czas: 25, opis: 'śródziemnomorski, intensywny', skladniki: 'kurczak, feta, oliwki, pomidory, czosnek, oregano, oliwa',          przygotowanie: 'Ułóż kurczaka z oliwkami i pomidorami. Posyp fetą i oregano. Piecz 20 min.',               kcal: 400, B: 42, T: 22, W:  6 },
  { id: 445, nazwa: 'Łosoś z awokado i limonką',           czas: 20, opis: 'kremowy, keto',              skladniki: 'łosoś, awokado, limonka, kolendra, czosnek, sól morska',              przygotowanie: 'Usmaż łososia. Rozgnieć awokado z limonką i kolendrą. Podaj razem.',                       kcal: 440, B: 36, T: 32, W:  4 },
  { id: 446, nazwa: 'Indyk w sosie curry',                 czas: 20, opis: 'aromatyczny, szybki',         skladniki: 'indyk, pasta curry, mleko kokosowe, cebula, czosnek, imbir',           przygotowanie: 'Usmaż indyka z cebulą. Dodaj pastę curry i mleko kokosowe. Duś 10 min.',                   kcal: 380, B: 42, T: 18, W:  8 },
  { id: 447, nazwa: 'Sałatka z tuńczykiem i jajkiem',      czas: 10, opis: 'klasyczna, szybka',          skladniki: 'tuńczyk, jajka ugotowane, sałata, pomidory, oliwki, oliwa',           przygotowanie: 'Ułóż sałatę, ułóż tuńczyka, jajka i pomidory. Skrop oliwą.',                               kcal: 300, B: 28, T: 14, W:  8 },
  { id: 448, nazwa: 'Zupa krem z papryki',                 czas: 25, opis: 'słodka, kremowa',             skladniki: 'papryka czerwona, cebula, czosnek, bulion, śmietanka, bazylia',        przygotowanie: 'Upiecz paprykę. Podsmaż cebulę z czosnkiem. Zblenduj razem ze śmietanką.',                 kcal: 200, B:  6, T: 10, W: 16 },
  { id: 449, nazwa: 'Curry z ciecierzycą',                 czas: 25, opis: 'sycące, wegańskie',           skladniki: 'ciecierzyca, mleko kokosowe, pomidory, curry, cebula, czosnek, szpinak', przygotowanie: 'Podsmaż cebulę z czosnkiem i curry. Dodaj ciecierzycę, pomidory i mleko kokosowe. Duś 15 min.', kcal: 320, B: 12, T: 14, W: 28 },
  { id: 450, nazwa: 'Wołowina z imbirem po japońsku',      czas: 15, opis: 'słodko-słona, szybka',       skladniki: 'wołowina, imbir, sos sojowy, mirin, erytrytol, sezam',                przygotowanie: 'Pokrój wołowinę cienko. Marynuj w soji z mirin i imbirem. Smaż intensywnie.',               kcal: 360, B: 36, T: 18, W:  8 },
  { id: 451, nazwa: 'Kurczak z ananasem i papryką',        czas: 20, opis: 'słodko-kwaśny, tropikalny',  skladniki: 'kurczak, ananas, papryka, sos sojowy, imbir, czosnek',                przygotowanie: 'Usmaż kurczaka z papryką. Dodaj ananas i sos sojowy. Smaż razem 5 min.',                   kcal: 360, B: 36, T: 12, W: 18 },
  { id: 452, nazwa: 'Łosoś z sosem pomidorowym',           czas: 20, opis: 'włoski, śródziemnomorski',   skladniki: 'łosoś, pomidory pelati, kapary, oliwki, czosnek, bazylia',            przygotowanie: 'Przygotuj sos pomidorowy. Ułóż łososia w sosie, duś 12 min.',                               kcal: 380, B: 38, T: 20, W:  8 },
  { id: 453, nazwa: 'Tofu ze szparagami stir-fry',         czas: 15, opis: 'sezonowe, wegańskie',         skladniki: 'tofu, szparagi, sos sojowy, czosnek, imbir, sezam',                   przygotowanie: 'Podsmaż tofu na złoto. Dodaj szparagi i czosnek. Polej sosem sojowym, posyp sezamem.',     kcal: 260, B: 16, T: 14, W:  8 },
  { id: 454, nazwa: 'Kurczak z jarmużem',                  czas: 20, opis: 'zdrowy, low carb',            skladniki: 'kurczak, jarmuż, czosnek, oliwa, cytryna, parmezan',                  przygotowanie: 'Usmaż kurczaka. Podsmaż jarmuż z czosnkiem i oliwą. Podaj razem.',                         kcal: 340, B: 40, T: 16, W:  6 },
  { id: 455, nazwa: 'Ryba z kaparami i pomidorami',        czas: 20, opis: 'śródziemnomorska, lekka',    skladniki: 'filet ryby, kapary, pomidory, oliwki, czosnek, oliwa',                przygotowanie: 'Podsmaż czosnek. Dodaj pomidory, kapary i oliwki. Ułóż rybę, duś 10 min.',                kcal: 280, B: 34, T: 10, W:  8 },
  { id: 456, nazwa: 'Wołowina chipotle keto',              czas: 20, opis: 'pikantna, meksykańska',       skladniki: 'wołowina, papryczki chipotle, pomidory, czosnek, kumin, oliwa',       przygotowanie: 'Podsmaż wołowinę z czosnkiem i chipotle. Dodaj pomidory i kumin. Duś 10 min.',              kcal: 400, B: 38, T: 24, W:  6 },
  { id: 457, nazwa: 'Indyk z jarzynami',                   czas: 25, opis: 'lekki, low carb',             skladniki: 'indyk, marchew, seler naciowy, cebula, bulion, tymianek',              przygotowanie: 'Pokrój wszystko w kawałki, gotuj razem w bulionie 20 min.',                                  kcal: 300, B: 36, T: 10, W:  8 },
  { id: 458, nazwa: 'Sałatka z krewetkami i awokado',      czas: 15, opis: 'keto, kremowa',              skladniki: 'krewetki, awokado, sałata, ogórek, sos cezar',                        przygotowanie: 'Ugotuj krewetki. Wymieszaj z pokrojonym awokado i sałatą. Polej dressingiem.',              kcal: 340, B: 26, T: 24, W:  6 },
  { id: 459, nazwa: 'Zupa z soczewicy i kokosa',           czas: 25, opis: 'kremowa, wegańska',           skladniki: 'soczewica czerwona, mleko kokosowe, curry, imbir, szpinak, limonka', przygotowanie: 'Gotuj soczewicę z curry i imbirem. Dodaj mleko kokosowe i szpinak. Skrop limonką.',           kcal: 280, B: 12, T: 12, W: 26 },
  { id: 460, nazwa: 'Kurczak z sosem mango',               czas: 20, opis: 'tropikalny, szybki',          skladniki: 'kurczak, mango, chili, czosnek, limonka, kolendra',                   przygotowanie: 'Usmaż kurczaka. Zblenduj mango z chili, czosnkiem i limonką. Polej mięso.',                kcal: 360, B: 38, T: 12, W: 16 },

  // ── KOLACJE 461–470 ───────────────────────────────────────────────────────
  { id: 461, nazwa: 'Sałatka z pieczarkami i szpinakiem',  czas: 10, opis: 'lekka, low carb',            skladniki: 'pieczarki, szpinak, cebula czerwona, oliwa, ocet balsamiczny, parmezan', przygotowanie: 'Podsmaż pieczarki. Wymieszaj ze szpinakiem i cebulą. Skrop oliwą.',                       kcal: 200, B:  8, T: 14, W:  6 },
  { id: 462, nazwa: 'Zupa krem z batata',                  czas: 25, opis: 'słodka, kremowa',             skladniki: 'batat, cebula, czosnek, bulion, mleko kokosowe, imbir',               przygotowanie: 'Ugotuj batat z cebulą i czosnkiem. Zblenduj z mlekiem kokosowym i imbirem.',               kcal: 220, B:  4, T:  8, W: 28 },
  { id: 463, nazwa: 'Jajka w koszulce z rukolą',           czas: 10, opis: 'eleganckie, keto',            skladniki: 'jajka, rukola, oliwa, parmezan, ocet, sól morska',                    przygotowanie: 'Zagotuj wodę z octem. Wbij jajka, gotuj 3 min. Podaj na rukolą z parmezanem.',             kcal: 260, B: 18, T: 18, W:  2 },
  { id: 464, nazwa: 'Sałatka z łososiem i szpinakiem',     czas: 10, opis: 'premium, keto',              skladniki: 'łosoś wędzony, szpinak, awokado, kapary, oliwa, cytryna',             przygotowanie: 'Ułóż szpinak z łososiem i awokado. Posyp kaparami, skrop oliwą.',                          kcal: 360, B: 28, T: 26, W:  4 },
  { id: 465, nazwa: 'Zupa tajska z kokosem',               czas: 20, opis: 'kremowa, wegańska',           skladniki: 'mleko kokosowe, grzyby, galangal, trawa cytrynowa, tofu, limonka',   przygotowanie: 'Gotuj mleko kokosowe z trawą cytrynową. Dodaj grzyby i tofu. Skrop limonką.',               kcal: 240, B: 10, T: 18, W:  8 },
  { id: 466, nazwa: 'Jajka ze szparagami i parmezanem',    czas: 15, opis: 'sezonowe, keto',             skladniki: 'jajka, szparagi, parmezan, masło, sól morska, pieprz',               przygotowanie: 'Blanszuj szparagi. Usmaż jajka na maśle. Podaj razem z startym parmezanem.',               kcal: 300, B: 22, T: 22, W:  4 },
  { id: 467, nazwa: 'Sałatka z tuńczykiem i awokado',      czas: 10, opis: 'sycąca, keto',               skladniki: 'tuńczyk, awokado, sałata, ogórek, sok z cytryny, oliwa',              przygotowanie: 'Wymieszaj tuńczyka z awokado. Ułóż na sałacie z ogórkiem. Skrop oliwą.',                   kcal: 360, B: 28, T: 26, W:  4 },
  { id: 468, nazwa: 'Zupa krem z zielonego groszku',       czas: 20, opis: 'lekka, świeża',              skladniki: 'groszek zielony, szpinak, cebula, bulion, mięta, jogurt',             przygotowanie: 'Podsmaż cebulę, dodaj groszek i bulion. Zblenduj z miętą. Podaj z jogurtem.',              kcal: 180, B:  8, T:  4, W: 20 },
  { id: 469, nazwa: 'Jajka z pieczarkami i fetą',          czas: 15, opis: 'wytrawne, keto',             skladniki: 'jajka, pieczarki, feta, szpinak, czosnek, oliwa',                     przygotowanie: 'Podsmaż pieczarki z czosnkiem. Dodaj szpinak i fetę. Wbij jajka, smaż do ścięcia.',       kcal: 300, B: 22, T: 22, W:  4 },
  { id: 470, nazwa: 'Sałatka z kurczakiem i granatem',     czas: 15, opis: 'elegancka, low carb',        skladniki: 'kurczak, granat, rukola, orzechy, feta, oliwa, miód',                 przygotowanie: 'Pokrój kurczaka. Wymieszaj z rukolą, granatem i orzechami. Posyp fetą, skrop dressingiem.', kcal: 340, B: 30, T: 18, W: 14 },

  // ── DESERY 471–480 ────────────────────────────────────────────────────────
  { id: 471, nazwa: 'Brownie keto',                        czas: 35, opis: 'czekoladowe, wilgotne',       skladniki: 'mąka migdałowa, kakao, jajka, masło, erytrytol, sól',                 przygotowanie: 'Wymieszaj składniki. Wlej do foremki, piecz w 175°C przez 25 min.',                         kcal: 300, B:  8, T: 24, W:  8 },
  { id: 472, nazwa: 'Krem z awokado i kakao',              czas: 10, opis: 'kremowy, keto',              skladniki: 'awokado, kakao, erytrytol, wanilia, mleko kokosowe, sól',             przygotowanie: 'Zblenduj wszystkie składniki na gładki, kremowy mus.',                                       kcal: 280, B:  4, T: 22, W: 10 },
  { id: 473, nazwa: 'Ciasteczka migdałowe',                czas: 25, opis: 'keto, chrupiące',            skladniki: 'mąka migdałowa, jajko, erytrytol, wanilia, sól, olej kokosowy',      przygotowanie: 'Wymieszaj składniki, uformuj kulki. Piecz w 175°C przez 12 min.',                           kcal: 200, B:  6, T: 16, W:  6 },
  { id: 474, nazwa: 'Tiramisu keto',                       czas: 20, opis: 'klasyczne, keto',            skladniki: 'mascarpone, jajka, erytrytol, kawa, kakao, biszkopty keto',           przygotowanie: 'Ubij żółtka z erytrytolem. Dodaj mascarpone. Maczaj biszkopty w kawie. Warstwuj.',         kcal: 320, B: 10, T: 26, W:  8 },
  { id: 475, nazwa: 'Pudding chia z malinami',             czas:  5, opis: 'świeży, wegański',            skladniki: 'nasiona chia, mleko roślinne, maliny, erytrytol, wanilia',            przygotowanie: 'Wymieszaj chia z mlekiem i erytrytolem. Chłódź noc. Podaj z malinami.',                    kcal: 200, B:  6, T:  8, W: 18 },
  { id: 476, nazwa: 'Kogel mogel',                         czas:  5, opis: 'klasyczny, szybki',          skladniki: 'żółtka, erytrytol, wanilia, kakao opcjonalnie',                       przygotowanie: 'Ubij żółtka z erytrytolem i wanilią na puszysty krem.',                                     kcal: 180, B:  8, T: 12, W:  6 },
  { id: 477, nazwa: 'Bezy waniliowe',                      czas: 20, opis: 'lekkie, keto',               skladniki: 'białka jaj, erytrytol w proszku, wanilia, szczypta soli',            przygotowanie: 'Ubij białka ze szczyptą soli. Dodaj erytrytol i wanilię. Piecz w 100°C przez 90 min.',     kcal: 80,  B:  6, T:  0, W:  4 },
  { id: 478, nazwa: 'Mus malinowy',                        czas: 10, opis: 'lekki, low carb',            skladniki: 'maliny, śmietanka, erytrytol, żelatyna, wanilia',                    przygotowanie: 'Przetrzeć maliny przez sito. Ubić śmietankę. Wymieszaj z malinami i żelatyną.',             kcal: 220, B:  4, T: 18, W:  8 },
  { id: 479, nazwa: 'Czekoladki z masłem orzechowym',      czas: 10, opis: 'słodkie, keto',              skladniki: 'czekolada gorzka min 85%, masło orzechowe, erytrytol, sól morska',    przygotowanie: 'Roztop czekoladę, nałóż do foremek. Wstaw masło orzechowe. Zalej czekoladą. Chłódź.',     kcal: 260, B:  6, T: 20, W:  8 },
  { id: 480, nazwa: 'Galaretka jagodowa bez cukru',        czas: 10, opis: 'lekka, świeża',              skladniki: 'jagody, żelatyna, erytrytol, sok z cytryny, woda',                   przygotowanie: 'Gotuj jagody z erytrytolem. Dodaj żelatynę rozpuszczoną w wodzie. Wlej do foremek.',       kcal: 80,  B:  2, T:  0, W: 10 },

  // ── PRZEKĄSKI / DODATKI 481–500 ───────────────────────────────────────────
  { id: 481, nazwa: 'Hummus z kaparami',                   czas: 10, opis: 'kremowy, wegański',           skladniki: 'ciecierzyca, tahini, kapary, czosnek, cytryna, oliwa',               przygotowanie: 'Zblenduj ciecierzycę z tahini, czosnkiem i cytryną. Udekoruj kaparami i oliwą.',           kcal: 200, B:  8, T: 10, W: 16 },
  { id: 482, nazwa: 'Roladki z szynką i serem',            czas:  5, opis: 'szybkie, keto',              skladniki: 'szynka gotowana, ser żółty, musztarda, ogórek kiszony',              przygotowanie: 'Posmaruj szynkę musztardą. Ułóż ser i ogórek, zwińby w roladkę.',                          kcal: 220, B: 16, T: 16, W:  2 },
  { id: 483, nazwa: 'Brie z orzechami i miodem',           czas:  5, opis: 'eleganckie, keto',           skladniki: 'ser brie, orzechy włoskie, miód, tymianek',                          przygotowanie: 'Pokrój brie, ułóż z orzechami. Skrop miodem, posyp tymiankiem.',                            kcal: 300, B: 14, T: 24, W:  6 },
  { id: 484, nazwa: 'Warzywa z dipem tzatziki',            czas: 10, opis: 'świeże, lekkie',             skladniki: 'ogórek, marchew, papryka, tzatziki domowe',                          przygotowanie: 'Pokrój warzywa w słupki. Przygotuj tzatziki z jogurtu, ogórka i koperku. Podaj razem.',    kcal: 180, B:  8, T:  8, W: 12 },
  { id: 485, nazwa: 'Pistacje solone',                     czas:  5, opis: 'szybkie, keto',              skladniki: 'pistacje, sól morska',                                               przygotowanie: 'Praż pistacje z solą morską w 180°C przez 8 min. Ostudź przed podaniem.',                   kcal: 200, B:  6, T: 16, W:  6 },
  { id: 486, nazwa: 'Dip serowy z jalapeño',               czas: 10, opis: 'pikantny, keto',             skladniki: 'serek kremowy, ser cheddar, jalapeño, czosnek, śmietana',            przygotowanie: 'Wymieszaj serek kremowy z serem cheddar i posiekanym jalapeño. Dopraw czosnkiem.',         kcal: 260, B: 10, T: 22, W:  4 },
  { id: 487, nazwa: 'Krakery z siemienia lnianego',        czas: 20, opis: 'chrupiące, low carb',        skladniki: 'siemię lniane, woda, sól, zioła, czosnek granulowany',               przygotowanie: 'Wymieszaj siemię z wodą, rozłóż cienko na papierze. Piecz w 160°C przez 20 min.',          kcal: 160, B:  6, T: 12, W:  4 },
  { id: 488, nazwa: 'Szynka prosciutto z melonem',         czas:  5, opis: 'eleganckie, lekkie',         skladniki: 'prosciutto, melon, rukola, oliwa, pieprz',                           przygotowanie: 'Owiń kawałki melona prosciutto. Ułóż na rukolą, skrop oliwą.',                              kcal: 180, B: 12, T:  8, W: 12 },
  { id: 489, nazwa: 'Orzechy pekan z rozmarynem',          czas: 15, opis: 'aromatyczne, keto',          skladniki: 'orzechy pekan, rozmaryn, oliwa, sól morska, pieprz cayenne',         przygotowanie: 'Wymieszaj orzechy z oliwą i rozmarynem. Piecz w 175°C przez 10 min.',                      kcal: 240, B:  4, T: 22, W:  6 },
  { id: 490, nazwa: 'Chipsy z cukinii',                    czas: 25, opis: 'chrupiące, low carb',        skladniki: 'cukinia, oliwa, sól morska, parmezan, oregano',                      przygotowanie: 'Pokrój cukinię cienko. Polej oliwą, posyp parmezanem. Piecz w 200°C przez 20 min.',        kcal: 120, B:  4, T:  8, W:  6 },
  { id: 491, nazwa: 'Przekąska z jajka i awokado',         czas:  5, opis: 'szybka, keto',              skladniki: 'jajko ugotowane, awokado, sól morska, papryka',                      przygotowanie: 'Pokrój jajko i awokado. Posyp solą morską i papryką. Podaj od razu.',                      kcal: 200, B:  8, T: 16, W:  2 },
  { id: 492, nazwa: 'Grzybki faszerowane serem',           czas: 20, opis: 'keto, eleganckie',           skladniki: 'pieczarki duże, serek kremowy, parmezan, czosnek, natka',            przygotowanie: 'Wydrąż pieczarki. Nafaszeruj serkiem z czosnkiem. Posyp parmezanem, piecz 15 min.',        kcal: 200, B: 10, T: 16, W:  4 },
  { id: 493, nazwa: 'Mix sałatkowy z fetą',                czas:  5, opis: 'świeże, szybkie',            skladniki: 'mix sałat, feta, oliwki, oliwa, ocet balsamiczny',                   przygotowanie: 'Wymieszaj mix sałat z oliwkami. Posyp pokruszoną fetą. Skrop oliwą.',                      kcal: 200, B:  8, T: 16, W:  4 },
  { id: 494, nazwa: 'Pasta z anchois i masła',             czas:  5, opis: 'intensywna, keto',           skladniki: 'anchois, masło, czosnek, natka pietruszki, cytryna',                 przygotowanie: 'Zmiksuj anchois z miękkim masłem, czosnkiem i natką na gładką pastę.',                    kcal: 200, B:  8, T: 18, W:  1 },
  { id: 495, nazwa: 'Pasta z białej fasoli i rozmarynu',   czas:  5, opis: 'kremowa, wegańska',          skladniki: 'fasola biała z puszki, rozmaryn, czosnek, oliwa, cytryna, sól',     przygotowanie: 'Zblenduj fasolę z czosnkiem, rozmarynem, oliwą i cytryną na gładki krem.',                 kcal: 220, B: 10, T:  8, W: 22 },
  { id: 496, nazwa: 'Chipsy z tortilli keto',              czas: 15, opis: 'chrupiące, pikantne',        skladniki: 'tortille keto, oliwa, sól morska, kumin, chili',                     przygotowanie: 'Podziel tortille na trójkąty. Posmaruj oliwą z przyprawami. Piecz w 190°C przez 10 min.', kcal: 180, B:  6, T: 12, W:  8 },
  { id: 497, nazwa: 'Żurek z jajkiem',                     czas: 15, opis: 'polski, rozgrzewający',     skladniki: 'zakwas żurkowy, jajka, kiełbasa, czosnek, majeranek, śmietana',     przygotowanie: 'Gotuj zakwas z czosnkiem i majerankiem. Dodaj śmietanę. Podaj z jajkiem i kiełbasą.',     kcal: 300, B: 18, T: 18, W: 10 },
  { id: 498, nazwa: 'Bakłażan z tahini',                   czas: 25, opis: 'śródziemnomorski, kremowy', skladniki: 'bakłażan, tahini, czosnek, cytryna, pietruszka, oliwa',              przygotowanie: 'Upiecz bakłażan w 220°C przez 20 min. Zblenduj miąższ z tahini i czosnkiem.',              kcal: 200, B:  6, T: 14, W: 10 },
  { id: 499, nazwa: 'Pasta z wędzonej makreli',            czas:  5, opis: 'intensywna, keto',           skladniki: 'makrela wędzona, serek kremowy, chrzan, cytryna, koper',             przygotowanie: 'Rozgnieć makrelę z serkiem, chrzanem i koperkiem. Dopraw sokiem z cytryny.',               kcal: 280, B: 20, T: 22, W:  2 },
  { id: 500, nazwa: 'Tatar z łososia',                     czas: 10, opis: 'premium, keto',              skladniki: 'łosoś surowy, kapary, szalotka, koper, sok z cytryny, oliwa',        przygotowanie: 'Drobno pokrój łososia. Wymieszaj z kaparami, szalotką i koperkiem. Skrop cytryną.',        kcal: 260, B: 26, T: 16, W:  2 },

  // ── LODY BEZ CUKRU / LOW CARB 501–515 ──────────────────────────────────────
  { id: 501, nazwa: 'Lody mascarpone i wanilia (bez cukru)', czas: 20, opis: 'kremowe, bez cukru',      skladniki: 'mascarpone 250 g, śmietanka 30% 300 ml, żółtka 3, alluloza lub erytrytol 70–90 g, wanilia', przygotowanie: 'Podgrzej śmietankę z wanilią. Żółtka utrzyj ze słodzikiem, połącz z gorącą śmietanką i podgrzewaj do lekkiego zgęstnienia. Dodaj mascarpone. Schłodź i zamrażaj, mieszając, lub w maszynce.', kcal: 320, B:  5, T: 32, W:  4 },
  { id: 502, nazwa: 'Lody pistacjowe (bez cukru)',         czas: 20, opis: 'kremowe, bez cukru',         skladniki: 'pasta pistacjowa 120 g, śmietanka 400 ml, żółtka 3, alluloza 80 g',  przygotowanie: 'Przygotuj bazę jajeczną z żółtek, śmietanki i allulozy. Dodaj pastę pistacjową. Schłodź i zamrażaj.', kcal: 340, B:  7, T: 32, W:  6 },
  { id: 503, nazwa: 'Lody tiramisu (bez cukru)',           czas: 15, opis: 'kremowe, bez cukru',         skladniki: 'mascarpone 250 g, espresso, śmietanka, kakao, słodzik',              przygotowanie: 'Połącz mascarpone ze śmietanką i słodzikiem. Dodaj espresso i odrobinę kakao. Zamrażaj do kremowej konsystencji.', kcal: 300, B:  6, T: 28, W:  5 },
  { id: 504, nazwa: 'Lody truskawkowe (bez cukru)',        czas: 15, opis: 'owocowe, bez cukru',         skladniki: 'truskawki 300 g, śmietanka 250 ml, mascarpone 150 g, słodzik',       przygotowanie: 'Zmiksuj truskawki. Połącz z resztą składników. Schłodź i zamrażaj.', kcal: 260, B:  4, T: 24, W:  7 },
  { id: 505, nazwa: 'Lody palone masło (bez cukru)',       czas: 20, opis: 'kremowe, bez cukru',         skladniki: 'masło 80 g, śmietanka 350 ml, wanilia, słodzik',                     przygotowanie: 'Zrumień masło do orzechowego aromatu. Dodaj do bazy ze śmietanki, wanilii i słodziku. Schłodź i zamrażaj.', kcal: 330, B:  3, T: 34, W:  3 },
  { id: 506, nazwa: 'Lody kawowe (bez cukru)',             czas: 20, opis: 'kremowe, bez cukru',         skladniki: 'espresso 2 porcje, śmietanka 400 ml, żółtka 3, alluloza',            przygotowanie: 'Przygotuj klasyczną bazę lodową z żółtek, śmietanki i allulozy. Dodaj espresso. Schłodź i zamrażaj.', kcal: 300, B:  5, T: 30, W:  4 },
  { id: 507, nazwa: 'Lody brownie (bez cukru)',            czas: 25, opis: 'czekoladowe, bez cukru',     skladniki: 'lody czekoladowe bez cukru, kawałki brownie migdałowego',            przygotowanie: 'Dodaj kawałki brownie migdałowego pod koniec mrożenia lodów czekoladowych.', kcal: 320, B:  6, T: 28, W:  8 },
  { id: 508, nazwa: 'Lody kokosowe (bez cukru)',           czas: 15, opis: 'kremowe, bez cukru',         skladniki: 'mleko kokosowe, śmietanka kokosowa, wanilia, słodzik',               przygotowanie: 'Połącz składniki i zamrażaj, mieszając.', kcal: 290, B:  3, T: 30, W:  5 },
  { id: 509, nazwa: 'Lody śmietankowe (bez cukru)',        czas: 20, opis: 'kremowe, bez cukru',         skladniki: 'śmietanka, żółtka, wanilia, słodzik',                                przygotowanie: 'Przygotuj klasyczną bazę angielską z żółtek, śmietanki i słodziku. Schłodź i zamroź.', kcal: 300, B:  4, T: 30, W:  4 },
  { id: 510, nazwa: 'Lody czekoladowe (bez cukru)',        czas: 15, opis: 'czekoladowe, bez cukru',     skladniki: 'kakao, gorzka czekolada bez cukru, śmietanka, słodzik',              przygotowanie: 'Rozpuść czekoladę w śmietance, połącz z bazą i słodzikiem. Schłodź i zamrażaj.', kcal: 300, B:  5, T: 28, W:  6 },
  { id: 511, nazwa: 'Lody sernikowe (bez cukru)',          czas: 15, opis: 'kremowe, bez cukru',         skladniki: 'twaróg sernikowy, mascarpone, wanilia, słodzik',                     przygotowanie: 'Zmiksuj twaróg z mascarpone, wanilią i słodzikiem. Zamroź.', kcal: 280, B:  8, T: 26, W:  5 },
  { id: 512, nazwa: 'Lody jagodowe (bez cukru)',           czas: 15, opis: 'owocowe, bez cukru',         skladniki: 'jagody, śmietanka, mascarpone, słodzik',                             przygotowanie: 'Połącz składniki i zamrażaj.', kcal: 270, B:  4, T: 24, W:  8 },
  { id: 513, nazwa: 'Lody malinowe (bez cukru)',           czas: 15, opis: 'owocowe, bez cukru',         skladniki: 'maliny, mascarpone, śmietanka, słodzik',                             przygotowanie: 'Zmiksuj maliny z resztą składników i schłodź. Zamrażaj.', kcal: 270, B:  4, T: 24, W:  8 },
  { id: 514, nazwa: 'Lody słony karmel (bez cukru)',       czas: 20, opis: 'kremowe, bez cukru',         skladniki: 'alluloza, śmietanka, masło, sól',                                    przygotowanie: 'Przygotuj karmel z allulozy i masła, dodaj do bazy ze śmietanki i szczypty soli. Zamrażaj.', kcal: 310, B:  2, T: 32, W:  4 },
  { id: 515, nazwa: 'Lody orzech laskowy (bez cukru)',     czas: 20, opis: 'kremowe, bez cukru',         skladniki: 'pasta z orzechów laskowych, śmietanka, żółtka, słodzik',             przygotowanie: 'Połącz pastę z orzechów laskowych z klasyczną bazą z żółtek i śmietanki. Schłodź i zamrażaj.', kcal: 340, B:  6, T: 32, W:  6 },

  // ── LODY KLASYCZNE 516–530 ─────────────────────────────────────────────────
  { id: 516, nazwa: 'Lody waniliowe',                      czas: 25, opis: 'klasyczne, kremowe',         skladniki: 'mleko, śmietanka, żółtka, cukier, wanilia',                          przygotowanie: 'Przygotuj crème anglaise z mleka, śmietanki, żółtek i cukru. Schłodź i zamroź.', kcal: 250, B:  4, T: 16, W: 23 },
  { id: 517, nazwa: 'Lody śmietankowe',                    czas: 20, opis: 'klasyczne, kremowe',         skladniki: 'śmietanka 36%, mleko, cukier',                                       przygotowanie: 'Połącz składniki, schłodź masę i zamrażaj.', kcal: 270, B:  3, T: 18, W: 24 },
  { id: 518, nazwa: 'Lody truskawkowe',                    czas: 15, opis: 'klasyczne, owocowe',         skladniki: 'truskawki, śmietanka, cukier',                                       przygotowanie: 'Zmiksuj truskawki z cukrem, połącz ze śmietanką i zamroź.', kcal: 230, B:  3, T: 14, W: 24 },
  { id: 519, nazwa: 'Lody mango',                          czas: 15, opis: 'klasyczne, owocowe',         skladniki: 'mango, śmietanka, cukier',                                           przygotowanie: 'Zmiksuj mango z cukrem i śmietanką. Schłodź i zamrażaj.', kcal: 240, B:  3, T: 13, W: 28 },
  { id: 520, nazwa: 'Lody pistacjowe',                     czas: 25, opis: 'klasyczne, kremowe',         skladniki: 'pasta pistacjowa, mleko, śmietanka, żółtka, cukier',                 przygotowanie: 'Dodaj pastę pistacjową do klasycznej bazy z mleka, śmietanki, żółtek i cukru. Zamroź.', kcal: 290, B:  6, T: 18, W: 26 },
  { id: 521, nazwa: 'Lody tiramisu',                       czas: 20, opis: 'klasyczne, kremowe',         skladniki: 'mascarpone, espresso, biszkopty, cukier, śmietanka',                 przygotowanie: 'Połącz mascarpone ze śmietanką i cukrem, dodaj espresso. Wmieszaj pokruszone biszkopty i zamroź.', kcal: 300, B:  6, T: 20, W: 24 },
  { id: 522, nazwa: 'Lody brownie',                        czas: 25, opis: 'klasyczne, czekoladowe',     skladniki: 'lody czekoladowe, brownie',                                          przygotowanie: 'Dodaj kawałki brownie pod koniec mrożenia lodów czekoladowych.', kcal: 320, B:  5, T: 18, W: 34 },
  { id: 523, nazwa: 'Lody kokosowe',                       czas: 15, opis: 'klasyczne, kremowe',         skladniki: 'mleko kokosowe, śmietanka, cukier',                                  przygotowanie: 'Połącz składniki i zamroź.', kcal: 280, B:  3, T: 20, W: 22 },
  { id: 524, nazwa: 'Lody espresso',                       czas: 15, opis: 'klasyczne, kawowe',          skladniki: 'espresso, śmietanka, cukier',                                        przygotowanie: 'Dodaj espresso do bazy ze śmietanki i cukru. Zamrażaj.', kcal: 240, B:  4, T: 16, W: 22 },
  { id: 525, nazwa: 'Lody słony karmel',                   czas: 20, opis: 'klasyczne, kremowe',         skladniki: 'cukier, śmietanka, sól',                                             przygotowanie: 'Przygotuj karmel z cukru, połącz ze śmietanką i szczyptą soli. Dodaj do lodów i zamroź.', kcal: 300, B:  3, T: 18, W: 30 },
  { id: 526, nazwa: 'Lody czekoladowe',                    czas: 15, opis: 'klasyczne, czekoladowe',     skladniki: 'kakao, gorzka czekolada, śmietanka, cukier',                         przygotowanie: 'Rozpuść czekoladę, połącz z bazą z kakao, śmietanki i cukru. Zamroź.', kcal: 290, B:  4, T: 18, W: 28 },
  { id: 527, nazwa: 'Lody miętowe',                        czas: 20, opis: 'klasyczne, orzeźwiające',    skladniki: 'świeża mięta, śmietanka, czekolada, cukier',                         przygotowanie: 'Zaparz miętę w gorącej śmietance, odcedź, dodaj cukier i kawałki czekolady. Schłodź i zamroź.', kcal: 280, B:  4, T: 18, W: 26 },
  { id: 528, nazwa: 'Lody cookie dough',                   czas: 20, opis: 'klasyczne, słodkie',         skladniki: 'waniliowa baza lodowa, kawałki ciasta cookie dough',                 przygotowanie: 'Dodaj kawałki cookie dough pod koniec mrożenia waniliowej bazy.', kcal: 330, B:  5, T: 18, W: 36 },
  { id: 529, nazwa: 'Lody jagodowe',                       czas: 15, opis: 'klasyczne, owocowe',         skladniki: 'jagody, cukier, śmietanka',                                          przygotowanie: 'Zmiksuj jagody z cukrem, połącz ze śmietanką i zamroź.', kcal: 230, B:  3, T: 14, W: 24 },
  { id: 530, nazwa: 'Lody banoffee',                       czas: 15, opis: 'klasyczne, słodkie',         skladniki: 'banan, karmel, śmietanka',                                           przygotowanie: 'Połącz banany z karmelem i śmietanką. Schłodź i zamrażaj.', kcal: 320, B:  4, T: 16, W: 38 },

  // ── LODY WEGAŃSKIE 531–540 ─────────────────────────────────────────────────
  { id: 531, nazwa: 'Lody kokosowo-waniliowe (wegańskie)', czas: 15, opis: 'wegańskie, bez nabiału',    skladniki: 'mleko kokosowe, wanilia, syrop klonowy',                             przygotowanie: 'Zmiksuj składniki i zamroź.', kcal: 250, B:  2, T: 20, W: 16 },
  { id: 532, nazwa: 'Lody mango kokos (wegańskie)',        czas: 10, opis: 'wegańskie, owocowe',         skladniki: 'mango, mleko kokosowe',                                              przygotowanie: 'Zmiksuj na gładko i zamroź.', kcal: 220, B:  2, T: 14, W: 22 },
  { id: 533, nazwa: 'Lody banan i masło orzechowe (wegańskie)', czas: 10, opis: 'wegańskie, kremowe',    skladniki: 'mrożone banany, masło orzechowe',                                    przygotowanie: 'Zmiksuj mrożone banany z masłem orzechowym na krem.', kcal: 240, B:  5, T: 12, W: 28 },
  { id: 534, nazwa: 'Lody daktylowe (wegańskie)',          czas: 10, opis: 'wegańskie, czekoladowe',     skladniki: 'daktyle, kakao, mleko migdałowe',                                    przygotowanie: 'Zmiksuj daktyle z kakao i mlekiem migdałowym. Zamroź.', kcal: 200, B:  3, T:  6, W: 34 },
  { id: 535, nazwa: 'Lody pistacjowe (wegańskie)',         czas: 15, opis: 'wegańskie, kremowe',         skladniki: 'pistacje, mleko kokosowe',                                           przygotowanie: 'Zmiksuj pistacje z mlekiem kokosowym i schłodź. Zamrażaj.', kcal: 260, B:  5, T: 18, W: 20 },
  { id: 536, nazwa: 'Lody malinowe (wegańskie)',           czas: 10, opis: 'wegańskie, owocowe',         skladniki: 'maliny, śmietanka kokosowa',                                         przygotowanie: 'Zmiksuj maliny ze śmietanką kokosową i zamroź.', kcal: 230, B:  2, T: 16, W: 18 },
  { id: 537, nazwa: 'Lody czekoladowe (wegańskie)',        czas: 15, opis: 'wegańskie, czekoladowe',     skladniki: 'kakao, mleko owsiane, gorzka czekolada',                             przygotowanie: 'Rozpuść czekoladę, połącz z kakao i mlekiem owsianym. Schłodź i zamroź.', kcal: 240, B:  3, T: 14, W: 24 },
  { id: 538, nazwa: 'Lody matcha (wegańskie)',             czas: 10, opis: 'wegańskie, kremowe',         skladniki: 'matcha, mleko kokosowe',                                             przygotowanie: 'Zmiksuj matchę z mlekiem kokosowym i zamroź.', kcal: 230, B:  2, T: 18, W: 16 },
  { id: 539, nazwa: 'Lody limonka i awokado (wegańskie)',  czas: 10, opis: 'wegańskie, orzeźwiające',    skladniki: 'awokado, limonka, mleko kokosowe',                                   przygotowanie: 'Zmiksuj awokado z sokiem z limonki i mlekiem kokosowym na krem.', kcal: 250, B:  2, T: 20, W: 14 },
  { id: 540, nazwa: 'Lody espresso (wegańskie)',           czas: 10, opis: 'wegańskie, kawowe',          skladniki: 'espresso, mleko migdałowe, śmietanka kokosowa',                      przygotowanie: 'Połącz espresso z mlekiem migdałowym i śmietanką kokosową. Zamroź.', kcal: 220, B:  2, T: 16, W: 16 },

  // ── SORBETY (BEZ TŁUSZCZU) 541–560 ─────────────────────────────────────────
  { id: 541, nazwa: 'Sorbet truskawkowy',                  czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'truskawki, woda, cukier lub erytrytol, sok z cytryny',               przygotowanie: 'Zmiksuj truskawki z wodą, słodzikiem i sokiem z cytryny. Przetrzyj przez sito i zamrażaj, mieszając co 30 min.', kcal: 110, B:  1, T:  0, W: 27 },
  { id: 542, nazwa: 'Sorbet malinowy',                     czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'maliny, sok z cytryny, cukier lub alluloza',                         przygotowanie: 'Zmiksuj maliny ze słodzikiem i cytryną. Przetrzyj przez sito i zamrażaj, mieszając.', kcal: 110, B:  1, T:  0, W: 26 },
  { id: 543, nazwa: 'Sorbet mango',                        czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'mango, limonka, syrop cukrowy',                                      przygotowanie: 'Zmiksuj mango z limonką i syropem na gładko. Zamrażaj, mieszając co 30 min.', kcal: 140, B:  1, T:  0, W: 34 },
  { id: 544, nazwa: 'Sorbet cytrynowy',                    czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'cytryny, woda, cukier lub alluloza',                                 przygotowanie: 'Rozpuść słodzik w wodzie, dodaj sok z cytryn. Zamrażaj, mieszając widelcem.', kcal: 120, B:  0, T:  0, W: 30 },
  { id: 545, nazwa: 'Sorbet limonkowo-miętowy',            czas: 15, opis: 'sorbet, orzeźwiający',       skladniki: 'limonki, mięta, cukier lub erytrytol',                               przygotowanie: 'Zmiksuj limonki z miętą i słodzikiem. Odcedź i zamrażaj, mieszając.', kcal: 110, B:  0, T:  0, W: 28 },
  { id: 546, nazwa: 'Sorbet arbuzowy',                     czas: 15, opis: 'sorbet, lekkostrawny',       skladniki: 'arbuz, limonka, mięta',                                              przygotowanie: 'Zmiksuj arbuz z limonką i miętą. Przelej do formy i zamrażaj, mieszając.', kcal:  90, B:  1, T:  0, W: 22 },
  { id: 547, nazwa: 'Sorbet jagodowy',                     czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'jagody, cytryna, cukier lub alluloza',                               przygotowanie: 'Zmiksuj jagody z cytryną i słodzikiem. Przetrzyj i zamrażaj, mieszając.', kcal: 110, B:  1, T:  0, W: 27 },
  { id: 548, nazwa: 'Sorbet porzeczkowy',                  czas: 15, opis: 'sorbet, owocowy',            skladniki: 'czarna porzeczka, cukier, woda',                                     przygotowanie: 'Zagotuj porzeczki z cukrem i wodą, przetrzyj przez sito. Schłodź i zamrażaj, mieszając.', kcal: 120, B:  1, T:  0, W: 29 },
  { id: 549, nazwa: 'Sorbet brzoskwiniowy',                czas: 15, opis: 'sorbet, letni',             skladniki: 'brzoskwinie, sok z cytryny, cukier',                                 przygotowanie: 'Zmiksuj brzoskwinie z cytryną i cukrem na gładko. Zamrażaj, mieszając co 30 min.', kcal: 120, B:  1, T:  0, W: 29 },
  { id: 550, nazwa: 'Sorbet ananasowy',                    czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'ananas, limonka, cukier',                                            przygotowanie: 'Zmiksuj ananas z limonką i cukrem. Zamrażaj, mieszając widelcem.', kcal: 130, B:  1, T:  0, W: 32 },
  { id: 551, nazwa: 'Sorbet wiśniowy',                     czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'wiśnie, cukier lub erytrytol, sok z cytryny',                        przygotowanie: 'Zmiksuj wiśnie ze słodzikiem i cytryną. Przetrzyj i zamrażaj, mieszając.', kcal: 120, B:  1, T:  0, W: 29 },
  { id: 552, nazwa: 'Sorbet grejpfrutowy',                 czas: 15, opis: 'sorbet, orzeźwiający',       skladniki: 'grejpfrut, limonka, cukier',                                         przygotowanie: 'Wyciśnij sok z grejpfruta i limonki, połącz z cukrem. Zamrażaj, mieszając.', kcal: 110, B:  1, T:  0, W: 27 },
  { id: 553, nazwa: 'Sorbet cola i limonka',               czas: 15, opis: 'sorbet, rekreacyjny',        skladniki: 'cola zero lub klasyczna, limonka',                                   przygotowanie: 'Połącz colę z sokiem z limonki. Zamrażaj, energicznie mieszając co 20 min.', kcal:  90, B:  0, T:  0, W: 23 },
  { id: 554, nazwa: 'Sorbet kokosowo-limonkowy',           czas: 15, opis: 'sorbet, wegański',           skladniki: 'mleko kokosowe, limonka, słodzik lub cukier',                        przygotowanie: 'Połącz mleko kokosowe z limonką i słodzikiem. Zamrażaj, mieszając.', kcal: 200, B:  2, T: 16, W: 14 },
  { id: 555, nazwa: 'Sorbet espresso',                     czas: 15, opis: 'sorbet, kawowy',             skladniki: 'espresso, woda, cukier lub alluloza',                                przygotowanie: 'Rozpuść słodzik w gorącym espresso, dolej wodę. Schłodź i zamrażaj, mieszając.', kcal:  80, B:  0, T:  0, W: 19 },
  { id: 556, nazwa: 'Sorbet świdośliwa',                   czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'świdośliwa, cytryna, erytrytol lub cukier',                          przygotowanie: 'Zmiksuj świdośliwę z cytryną i słodzikiem. Przetrzyj i zamrażaj, mieszając.', kcal: 120, B:  1, T:  0, W: 29 },
  { id: 557, nazwa: 'Sorbet rabarbarowo-truskawkowy',      czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'rabarbar, truskawki, cukier lub alluloza',                           przygotowanie: 'Poddusz rabarbar z truskawkami i słodzikiem, zmiksuj. Schłodź i zamrażaj, mieszając.', kcal: 100, B:  1, T:  0, W: 24 },
  { id: 558, nazwa: 'Sorbet borówkowy',                    czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'borówki, cytryna, cukier lub alluloza',                              przygotowanie: 'Zmiksuj borówki z cytryną i słodzikiem. Przetrzyj i zamrażaj, mieszając.', kcal: 120, B:  1, T:  0, W: 29 },
  { id: 559, nazwa: 'Sorbet pomarańczowy',                 czas: 15, opis: 'sorbet, owocowy',            skladniki: 'pomarańcze, cukier, skórka pomarańczowa',                            przygotowanie: 'Wyciśnij sok z pomarańczy, połącz z cukrem i startą skórką. Zamrażaj, mieszając.', kcal: 130, B:  1, T:  0, W: 32 },
  { id: 560, nazwa: 'Sorbet jabłko i cynamon',             czas: 15, opis: 'sorbet, bez tłuszczu',       skladniki: 'jabłka, cynamon, cukier lub erytrytol',                              przygotowanie: 'Poddusz jabłka z cynamonem i słodzikiem, zmiksuj. Schłodź i zamrażaj, mieszając.', kcal: 120, B:  0, T:  0, W: 30 },
]

const BASE_DIET_PLANS: Record<Exclude<DietName, 'szybkie_20' | 'bezglutenowa'>, Record<MealSlot, number[]>> = {
  low_carb: {
    sniadanie:        [1, 2, 6, 101, 105, 116, 119, 201, 205, 214, 219, 223, 226, 227, 230, 301, 307, 310, 313, 317, 319, 401, 405, 408, 409, 413, 417, 418, 419, 420],
    drugie_sniadanie: [3, 7, 53, 104, 114, 117, 203, 208, 214, 222, 228, 236, 305, 309, 314, 318, 397, 402, 412, 414, 484, 491],
    obiad:            [11, 17, 61, 121, 129, 136, 143, 148, 245, 249, 255, 258, 267, 269, 274, 285, 296, 331, 335, 341, 351, 354, 357, 359, 375, 422, 427, 429, 431, 435, 437, 440, 454, 456, 457, 470],
    podwieczorek:     [40, 81, 34, 166, 175, 177, 197, 182, 190, 181, 188, 189, 376, 379, 381, 384, 385, 386, 389, 391, 473, 476, 478, 479, 483, 486, 487, 489, 490, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 541, 542, 545, 547, 551, 553, 554, 555, 556, 557, 558],
    kolacja:          [74, 73, 45, 151, 153, 158, 161, 164, 257, 269, 267, 258, 361, 363, 366, 367, 369, 372, 373, 374, 375, 461, 463, 466, 467, 469, 470],
  },
  weganska: {
    sniadanie:        [4, 55, 49, 110, 115, 120, 210, 212, 220, 224, 238, 315, 320, 406, 410],
    drugie_sniadanie: [57, 28, 224, 475, 480, 481, 406, 50, 82, 175, 183, 190, 194, 198, 229, 402, 412],
    obiad:            [14, 38, 63, 124, 135, 137, 141, 145, 244, 254, 256, 260, 264, 271, 275, 280, 282, 288, 292, 298, 324, 334, 343, 348, 353, 358, 424, 430, 434, 443, 449, 453, 459],
    podwieczorek:     [83, 78, 80, 167, 172, 176, 179, 184, 193, 162, 165, 378, 380, 385, 388, 392, 393, 396, 398, 475, 480, 481, 484, 389, 495, 498, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 542, 543, 544, 545, 546, 547, 549, 550, 552, 554, 555, 556, 558, 559],
    kolacja:          [75, 155, 160, 162, 165, 260, 271, 275, 280, 282, 362, 365, 368, 41, 44, 68, 130, 146, 157, 276],
  },
  srodziemnomorska: {
    sniadanie:        [51, 54, 58, 107, 103, 119, 201, 218, 228, 233, 301, 314, 316, 403, 407, 415, 417, 419],
    drugie_sniadanie: [3, 7, 87, 104, 117, 118, 203, 222, 228, 236, 305, 309, 314, 414, 484, 488],
    obiad:            [70, 67, 62, 126, 133, 142, 147, 252, 262, 278, 283, 293, 321, 323, 325, 328, 335, 340, 344, 347, 352, 355, 421, 423, 426, 432, 433, 444, 452, 455],
    podwieczorek:     [32, 82, 34, 183, 190, 192, 194, 184, 191, 199, 386, 390, 391, 393, 396, 481, 485, 488, 492, 493, 498],
    kolacja:          [21, 74, 75, 155, 156, 159, 164, 252, 262, 278, 276, 364, 370, 373, 463, 464, 467, 469, 498],
  },
  dash: {
    sniadanie:        [8, 54, 99, 106, 112, 118, 204, 206, 215, 218, 232, 234, 238, 303, 312, 315, 403, 406, 410, 414],
    drugie_sniadanie: [3, 58, 53, 104, 103, 191, 203, 208, 222, 228, 303, 309, 314, 397, 406, 414, 484],
    obiad:            [15, 44, 66, 130, 133, 146, 147, 247, 258, 260, 276, 286, 287, 328, 339, 347, 348, 426, 428, 433, 439, 447, 448, 449, 455, 457, 459, 460],
    podwieczorek:     [32, 92, 81, 182, 187, 199, 162, 191, 206, 232, 388, 392, 396, 398, 475, 480, 481, 484, 390, 493, 495],
    kolacja:          [75, 72, 71, 152, 155, 157, 163, 258, 276, 286, 287, 362, 365, 368, 371, 462, 465, 468, 470],
  },
  wegetarianska: {
    sniadanie:        [1, 54, 3, 101, 105, 109, 119, 201, 205, 209, 212, 219, 223, 233, 301, 307, 310, 313, 314, 316, 317, 319, 320, 401, 403, 406, 407, 409, 410, 413, 414, 417, 420],
    drugie_sniadanie: [57, 58, 28, 103, 110, 116, 120, 208, 218, 220, 224, 226, 232, 303, 304, 309, 312, 318, 397, 406, 412, 475, 481, 484, 495],
    obiad:            [14, 67, 17, 124, 130, 135, 139, 244, 254, 258, 264, 269, 271, 275, 280, 286, 292, 296, 298, 324, 334, 339, 343, 348, 353, 358, 403, 424, 430, 434, 439, 443, 449, 453, 459, 465],
    podwieczorek:     [83, 40, 32, 172, 170, 184, 175, 193, 162, 165, 179, 376, 378, 380, 384, 388, 392, 396, 398, 473, 475, 476, 477, 478, 480, 481, 484, 487, 490, 493, 495, 498, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530],
    kolacja:          [21, 73, 72, 152, 156, 162, 163, 258, 260, 276, 282, 286, 362, 364, 365, 367, 368, 371, 372, 461, 462, 463, 465, 466, 468, 469],
  },
  niskotluszczowa: {
    sniadanie:        [8, 99, 49, 106, 108, 112, 118, 206, 208, 215, 218, 234, 238, 306, 307, 312, 315, 317, 403, 406, 410, 414, 35],
    drugie_sniadanie: [54, 3, 58, 104, 187, 191, 203, 208, 222, 228, 232, 236, 303, 309, 314, 397, 406, 412, 475, 480, 484],
    obiad:            [15, 11, 16, 127, 128, 133, 146, 130, 247, 248, 258, 260, 270, 276, 287, 348, 323, 297, 328, 331, 339, 347, 426, 428, 431, 433, 439, 447, 448, 453, 454, 457, 460],
    podwieczorek:     [32, 33, 81, 171, 176, 187, 182, 191, 199, 206, 232, 388, 392, 396, 398, 475, 480, 481, 484, 487, 390, 490, 493, 495, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 555, 556, 557, 558, 559, 560],
    kolacja:          [71, 72, 75, 152, 154, 155, 159, 248, 258, 260, 270, 276, 287, 362, 364, 365, 368, 370, 371, 461, 462, 463, 465, 467, 468, 470],
  },
}

export const SLOTS: MealSlot[] = ['sniadanie', 'drugie_sniadanie', 'obiad', 'podwieczorek', 'kolacja']

const DISH_BY_ID: Map<number, PlanerDish> = new Map(DISHES.map(d => [d.id, d]))

// ── Klasyfikacja dań po dominującym białku / formie ────────────────────────
// Cel: w planerze dla każdego posiłku pokazujemy 3 alternatywy z RÓŻNYCH
// kategorii (np. kurczak / ryba / tofu), nie 3 zupy ani 3 dania z kurczaka.
export type DishType =
  | 'ryba' | 'kurczak' | 'indyk' | 'wolowina' | 'wieprzowina'
  | 'tofu' | 'straczki' | 'jajka' | 'nabial'
  | 'zupa' | 'salatka' | 'platki' | 'deser' | 'warzywa' | 'inne'

const TYPE_PATTERNS: [DishType, RegExp][] = [
  // ── BIAŁKO (najwyższy priorytet) ────────────────────────────────────────
  ['ryba',        /łoso|tuńczyk|dorsz|makrel|śledź|sardynk|halibut|pstrąg|krewetk|ośmiorni|kalmar|owoc[oó]w morza|anchois|\bryba\b|\bryby\b/i],
  ['kurczak',     /kurczak|filet z kurczaka/i],
  ['indyk',       /\bindyk|indyka|indyczy/i],
  ['wolowina',    /wołowin|\bstek\b|antrykot|polędwic|tatar wołow|burger wołow/i],
  ['wieprzowina', /schab|boczek|szynk|wieprz|kiełbas|karkówk|salami|kabanos|baranin|jagnięcin|prosciutto/i],
  ['tofu',        /\btofu\b|tempeh|seitan/i],
  ['straczki',    /ciecierzyc|soczewic|fasol|edamame|hummus|groch[oó]wk/i],
  ['jajka',       /^omlet|\bomlet\b|jajec|^jajka|^jajko|^jajo|frittat|szakszuk|jajka /i],
  ['nabial',      /twaróg|twarożek|jogurt|kefir|maślank|serek wiejsk|mascarpone|ricott|halloumi|mozzarell|^feta|^ser\b|^ser\s/i],
  // ── FORMA (gdy brak dominującego białka) ────────────────────────────────
  ['zupa',        /^zupa|krem z |^krem\b|^rosół|chłodnik|gazpacho|^bulion/i],
  ['salatka',     /^sałatk|^sałat|^wrap|^mix sałat/i],
  ['platki',      /owsiank|musli|granola|smoothie|shake|koktajl|pudding chia/i],
  ['deser',       /^sernik|^ciasto|^mus\b|^pianka|^lody|^sorbet|^brownie|^tarta|^naleśnik|^gofr|^pancakes|^placki|panna cotta|^krem\s/i],
  ['warzywa',     /warzyw|frytki|grzyb|brokuł|kalafior|cukini|bakłażan|szpinak|jarmuż|szparag/i],
]

function classifyDish(d: PlanerDish): DishType {
  for (const [type, pattern] of TYPE_PATTERNS) {
    if (pattern.test(d.nazwa)) return type
  }
  // fallback: poszukaj białka w składnikach
  const ing = d.skladniki.toLowerCase()
  if (/łoso|tuńczyk|dorsz|makrel|krewetk|\bryba|\bryby/.test(ing)) return 'ryba'
  if (/kurczak/.test(ing))                                          return 'kurczak'
  if (/indyk/.test(ing))                                            return 'indyk'
  if (/wołowin/.test(ing))                                          return 'wolowina'
  if (/tofu|tempeh/.test(ing))                                      return 'tofu'
  if (/jajk|jajec/.test(ing))                                       return 'jajka'
  if (/twaróg|jogurt|serek wiejsk/.test(ing))                       return 'nabial'
  return 'inne'
}

const DISH_TYPE_MAP: Map<number, DishType> = new Map(
  DISHES.map(d => [d.id, classifyDish(d)])
)

/**
 * Znormalizowana nazwa dania — do wykrywania "tych samych" potraw, które
 * istnieją w danych pod różnymi id (np. "Lody truskawkowe" i
 * "Lody truskawkowe (bez cukru)"). Porównujemy bez dopisków w nawiasach.
 */
function dishNameKey(id: number): string {
  const d = DISH_BY_ID.get(id)
  if (!d) return `#${id}`
  return d.nazwa
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Forma / kategoria potrawy ──────────────────────────────────────────────
// Uzupełnia klasyfikację po białku (DishType). Wykrywa powtórzenia "tej samej
// potrawy" nawet gdy białko jest różne, np. 2 sałatki (z tuńczykiem + z serem),
// 2 makarony, 2 zupy, 2 risotta. Dzięki temu trójka alternatyw w jednym posiłku
// nie pokazuje kilku wariantów tej samej formy dania.
const FORM_PATTERNS: [string, RegExp][] = [
  ['zupa',     /\bzupa\b|^krem z |^krem\b|\brosół|\brosol|chłodnik|chlodnik|\bbarszcz|\bżurek|\bzurek|gazpacho|\bbulion/i],
  ['risotto',  /\brisotto\b/i],
  ['salatka',  /\bsałat|\bsalat/i],
  ['makaron',  /\bmakaron|spaghetti|\bpenne\b|tagliatelle|fettuccine|lasagn|carbonara|\bgnocchi/i],
  ['pierogi',  /\bpierog|\bkopytk|\bkluski|\błazank|\blazank|\bleniwe/i],
  ['omlet',    /\bomlet/i],
  ['owsianka', /owsiank/i],
  ['smoothie', /smoothie|koktajl|\bshake\b/i],
  ['nalesnik', /naleśnik|nalesnik|pancake|\bplacki|racuch|\bgofr/i],
  ['curry',    /\bcurry\b/i],
  ['kotlet',   /\bkotlet/i],
  ['kanapka',  /kanapk|\btost\b|bagietk/i],
  ['wrap',     /\bwrap\b|tortill/i],
  // Formy śniadaniowe — łapią powtórki typu "2 twarożki" / "2 jogurty",
  // które klasyfikacja po białku rozdziela (np. twarożek z łososiem → ryba).
  ['twarozek', /twaróg|twaroż|twarozek|serek wiejsk|\bcottage/i],
  ['jogurt',   /\bjogurt|\bkefir|maślank|maslank|\bskyr\b/i],
  ['granola',  /granol|\bmusli\b|müsli|\bmüsli/i],
  ['pasta',    /\bpasta\b(?!\s*(z\s*)?makaron)/i],
]

function dishFormKey(id: number): string | null {
  const d = DISH_BY_ID.get(id)
  if (!d) return null
  for (const [form, re] of FORM_PATTERNS) if (re.test(d.nazwa)) return form
  return null
}

const THEME_PATTERNS: [string, RegExp][] = [
  ['ziemniak', /ziemniak|batat|frytki|placki ziemniacz/i],
  ['jajka', /jajk|jajec|omlet|frittat|szakszuk|shakshuk/i],
  ['kurczak', /kurczak|filet z kurczaka/i],
  ['indyk', /\bindyk|indyka|indyczy/i],
  ['wolowina', /wołowin|wolowin|\bstek\b|polędwic|poledwic|burger wołow|burger wolow/i],
  ['ryba', /łoso|losos|tuńczyk|tunczyk|dorsz|makrel|śledź|sledz|krewetk|\bryba\b|\bryby\b/i],
  ['tofu', /\btofu\b|tempeh|seitan/i],
  ['straczki', /ciecierzyc|soczewic|fasol|edamame|hummus|groch[oó]wk/i],
  ['kokos', /kokos|mleko kokos|wi[oó]rki kokos|śmietanka kokos|smietanka kokos/i],
  ['awokado', /awokado|guacamole/i],
  ['sernik', /sernik/i],
  ['lody', /\blody\b|sorbet/i],
  ['czekolada', /czekolad|kakao|brownie/i],
]

function dishThemeKeys(id: number): string[] {
  const d = DISH_BY_ID.get(id)
  if (!d) return []
  const text = `${d.nazwa} ${d.opis} ${d.skladniki}`
  return THEME_PATTERNS.filter(([, re]) => re.test(text)).map(([theme]) => theme)
}

/**
 * Wybiera 3 dania z puli tak, by — gdy to możliwe — pochodziły
 * z różnych kategorii (białko/forma). Zawsze deterministyczne dla danego seed.
 * Gwarancja: 3 pozycje nigdy nie są tą samą potrawą (różne znormalizowane
 * nazwy), o ile pula w ogóle zawiera 3 różne potrawy.
 */
export function pickDiverseTriple(
  pool: number[],
  seed: number,
  exclude?: Set<number>,
): [number, number, number] {
  if (pool.length === 0) return [0, 0, 0]

  // Preferuj dania jeszcze nieużyte w innych posiłkach dnia; jeśli wykluczenie
  // opróżniłoby pulę całkowicie — zignoruj je (lepiej powtórzyć niż pokazać 0).
  let working = exclude ? pool.filter(id => !exclude.has(id)) : pool
  if (working.length === 0) working = pool

  // Deterministyczna, zależna od seeda kolejność kandydatów — dzięki temu
  // każdego dnia inny zestaw dań, ale zawsze ten sam dla danego seeda.
  const seededRank = (id: number): number => {
    let h = (Math.imul(id, 2654435761) ^ Math.imul(seed, 40503)) >>> 0
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0
    return (h ^ (h >>> 13)) >>> 0
  }
  const ordered = [...working].sort((a, b) => seededRank(a) - seededRank(b) || a - b)

  const result: number[] = []
  const usedNames = new Set<string>()
  const usedTypes = new Set<DishType>()
  const usedForms = new Set<string>()
  const usedThemes = new Set<string>()
  // Nazwy dań użytych już w innych posiłkach dnia też blokujemy,
  // żeby ta sama potrawa nie wracała pod innym id.
  exclude?.forEach(id => {
    usedNames.add(dishNameKey(id))
    const type = DISH_TYPE_MAP.get(id) ?? 'inne'
    if (type !== 'inne') usedTypes.add(type)
    const form = dishFormKey(id)
    if (form) usedForms.add(form)
    dishThemeKeys(id).forEach(theme => usedThemes.add(theme))
  })

  // Dodaje danie tylko, gdy jest INNEJ kategorii niż już wybrane. Twarde,
  // nierelaksowane wymogi w obrębie trójki:
  //  • różna nazwa,
  //  • różny typ/białko (łosoś, kurczak, jajka…) — z wyjątkiem kosza 'inne',
  //  • różna forma (zupa, sałatka, risotto, makaron…).
  // 'inne' i brak rozpoznanej formy nie blokują — to nierozpoznane dania,
  // których nie możemy pewnie uznać za tę samą kategorię.
  const consider = (id: number): boolean => {
    if (result.includes(id)) return false
    const name = dishNameKey(id)
    if (usedNames.has(name)) return false
    const type = DISH_TYPE_MAP.get(id) ?? 'inne'
    if (type !== 'inne' && usedTypes.has(type)) return false
    const form = dishFormKey(id)
    if (form && usedForms.has(form)) return false
    const themes = dishThemeKeys(id)
    if (themes.some(theme => usedThemes.has(theme))) return false
    result.push(id)
    usedNames.add(name)
    if (type !== 'inne') usedTypes.add(type)
    if (form) usedForms.add(form)
    themes.forEach(theme => usedThemes.add(theme))
    return true
  }

  // Jedno przejście — każde danie musi być innej kategorii (typ + forma).
  // Jeśli pula ma np. same sałatki albo samego łososia, lepiej pokazać mniej
  // alternatyw niż powtórzyć kategorię.
  for (const id of ordered) {
    if (result.length >= 3) break
    consider(id)
  }

  // Ostateczność: wykluczenia z innych posiłków opróżniły pulę — poluzuj je
  // (dania użyte w innych posiłkach), ale w obrębie trójki nadal wymagaj
  // różnych nazw, typów ORAZ form.
  if (result.length < 3) {
    const namesInResult = new Set(result.map(dishNameKey))
    for (const id of pool) {
      if (result.length >= 3) break
      if (result.includes(id)) continue
      const name = dishNameKey(id)
      if (namesInResult.has(name)) continue
      const type = DISH_TYPE_MAP.get(id) ?? 'inne'
      if (type !== 'inne' && usedTypes.has(type)) continue
      const form = dishFormKey(id)
      if (form && usedForms.has(form)) continue
      const themes = dishThemeKeys(id)
      if (themes.some(theme => usedThemes.has(theme))) continue
      result.push(id)
      namesInResult.add(name)
      if (type !== 'inne') usedTypes.add(type)
      if (form) usedForms.add(form)
      themes.forEach(theme => usedThemes.add(theme))
    }
  }

  // Absolutna ostateczność (pula ma <3 różnych kategorii): powtórz, by tuple
  // miał 3. getDailyThree deduplikuje wynik, więc UI pokaże tylko realne dania.
  while (result.length < 3) result.push(result[0])

  return [result[0], result[1], result[2]]
}

/**
 * Buduje cały dzienny plan (po 3 alternatywy na posiłek) tak, by te same
 * dania nie powtarzały się między posiłkami — pule obiadu i kolacji mają
 * sporo wspólnych pozycji, więc bez dedupu ta sama potrawa potrafiła wyjść
 * dwa razy w jednym dniu.
 */
export function pickDayPlan(
  diet: DietName,
  seed: number,
): Record<MealSlot, [number, number, number]> {
  const used = new Set<number>()
  const result = {} as Record<MealSlot, [number, number, number]>
  SLOTS.forEach((slot, si) => {
    const triple = pickDiverseTriple(DIET_PLANS[diet][slot], seed + si * 17, used)
    triple.forEach(id => used.add(id))
    result[slot] = triple
  })
  return result
}

function buildSzybkie20Pool(slot: MealSlot): number[] {
  const ids = new Set<number>()
  Object.values(BASE_DIET_PLANS).forEach(plan => plan[slot].forEach(id => ids.add(id)))
  return [...ids].filter(id => {
    const dish = DISH_BY_ID.get(id)
    return !!dish && dish.czas <= 20
  })
}

// ── Filtr glutenowy ────────────────────────────────────────────────────────
// Wykluczamy dania, których lista składników (lub nazwa) zawiera typowe
// produkty z glutenem. Konserwatywne podejście: lepiej wyrzucić dwuznaczne
// (np. każde "ciasto" bez wskazania mąki bezglutenowej) niż zostawić ryzyko.
const GLUTEN_PATTERNS: RegExp[] = [
  /pszen/i, /żyto|żytni/i, /jęczmie/i,
  /\bowies\b|owsian|owsiank|płatk[ai] owsi/i,
  /mąka(?!\s*(?:migdał|kokos|ryżow|gryczan|ziemniacz|jaglan|kasztan|z\s+ciecierzyc))/i,
  /\bchleb\b(?!\s*bezglut)|bułk|bułek|pieczyw|grzank|tost\b|toast/i,
  /tortill|\bpita\b|\bwrap\b/i,
  /naleśn|\bgofr|pancake|crepe/i,
  /makaron(?!\s*(?:ryżow|gryczan|z\s+soczewic|z\s+ciecierzyc|bezglut))/i,
  /spaghett(?!\s*(?:ryżow|z\s+cukini|bezglut))|lasagne|gnocchi|pierog|kluski|kuskus|kus-kus|bulgur/i,
  /kasza\s+(?:jęczmie|pszen|manna|kuskus|bulgur|orkisz)/i,
  /seitan|panierk|panierowan|panko|kasza orkisz/i,
  /sos\w*\s+sojow|sojow\w*\s+sos|teriyaki|hoisin/i,
  /sernik(?!\s*bezglut)|brownie(?!\s*bezglut)|tarta(?!\s*bezglut)/i,
  /\bciasto\b(?!\s*(?:z\s*mąki\s*(?:migdał|kokos|gryczan|ryżow|jaglan)|keto|bezglut))/i,
  /bułka tarta/i, /paluszki(?!\s*ryżow|\s*kukurydz)/i,
]

function isGlutenFree(d: PlanerDish): boolean {
  const text = (d.nazwa + ' ' + d.skladniki).toLowerCase()
  return !GLUTEN_PATTERNS.some(rx => rx.test(text))
}

function buildBezglutenowaPool(slot: MealSlot): number[] {
  const ids = new Set<number>()
  Object.values(BASE_DIET_PLANS).forEach(plan => plan[slot].forEach(id => ids.add(id)))
  return [...ids].filter(id => {
    const dish = DISH_BY_ID.get(id)
    return !!dish && isGlutenFree(dish)
  })
}

// ── Filtr niskotłuszczowy ──────────────────────────────────────────────────
// Dieta niskotłuszczowa ma sens tylko, gdy dania faktycznie mają mało tłuszczu.
// Odrzucamy te, w których tłuszcz daje więcej niż 35% kalorii (feta, awokado,
// tahini, kokos, granola itp.). Pula robi się mniejsza, ale zgodna z nazwą.
const LOW_FAT_MAX_PCT = 35

function isLowFat(d: PlanerDish): boolean {
  if (d.kcal <= 0) return false
  return (d.T * 9) / d.kcal * 100 <= LOW_FAT_MAX_PCT
}

function buildNiskotluszczowaPool(slot: MealSlot): number[] {
  return BASE_DIET_PLANS.niskotluszczowa[slot].filter(id => {
    const dish = DISH_BY_ID.get(id)
    return !!dish && isLowFat(dish)
  })
}

// ── Filtr sodu (DASH) ──────────────────────────────────────────────────────
// DASH ma ograniczać sód. Usuwamy dania wyraźnie słone: sos sojowy/teriyaki,
// wędliny i mięso przetworzone, wędzonki oraz kapary. Feta i oliwki w umiarze
// zostają (dopuszczalne w wersji śródziemnomorskiej DASH).
const DASH_HIGH_SODIUM: RegExp[] = [
  /sos\w*\s+sojow|sojow\w*\s+sos|teriyaki|hoisin/i,
  /boczek|kiełbas|kielbas|salami|kabanos|parówk|parowk|\bszynk|wędzon|wedzon/i,
  /\bkapar/i,
]

function isDashFriendly(d: PlanerDish): boolean {
  const text = (d.nazwa + ' ' + d.skladniki).toLowerCase()
  return !DASH_HIGH_SODIUM.some(rx => rx.test(text))
}

function buildDashPool(slot: MealSlot): number[] {
  return BASE_DIET_PLANS.dash[slot].filter(id => {
    const dish = DISH_BY_ID.get(id)
    return !!dish && isDashFriendly(dish)
  })
}

export const DIET_PLANS: Record<DietName, Record<MealSlot, number[]>> = {
  ...BASE_DIET_PLANS,
  niskotluszczowa: {
    sniadanie:        buildNiskotluszczowaPool('sniadanie'),
    drugie_sniadanie: buildNiskotluszczowaPool('drugie_sniadanie'),
    obiad:            buildNiskotluszczowaPool('obiad'),
    podwieczorek:     buildNiskotluszczowaPool('podwieczorek'),
    kolacja:          buildNiskotluszczowaPool('kolacja'),
  },
  dash: {
    sniadanie:        buildDashPool('sniadanie'),
    drugie_sniadanie: buildDashPool('drugie_sniadanie'),
    obiad:            buildDashPool('obiad'),
    podwieczorek:     buildDashPool('podwieczorek'),
    kolacja:          buildDashPool('kolacja'),
  },
  bezglutenowa: {
    sniadanie:        buildBezglutenowaPool('sniadanie'),
    drugie_sniadanie: buildBezglutenowaPool('drugie_sniadanie'),
    obiad:            buildBezglutenowaPool('obiad'),
    podwieczorek:     buildBezglutenowaPool('podwieczorek'),
    kolacja:          buildBezglutenowaPool('kolacja'),
  },
  szybkie_20: {
    sniadanie:        buildSzybkie20Pool('sniadanie'),
    drugie_sniadanie: buildSzybkie20Pool('drugie_sniadanie'),
    obiad:            buildSzybkie20Pool('obiad'),
    podwieczorek:     buildSzybkie20Pool('podwieczorek'),
    kolacja:          buildSzybkie20Pool('kolacja'),
  },
}

export const DIETS: DietName[] = ['low_carb', 'weganska', 'srodziemnomorska', 'dash', 'wegetarianska', 'niskotluszczowa', 'bezglutenowa', 'szybkie_20']

// ---------------------------------------------------------------------------
// KUCHNIA ŚWIATA — opcjonalny filtr nakładany na pulę dań danej diety
// ---------------------------------------------------------------------------

export type Cuisine = 'wloska' | 'polska' | 'francuska' | 'hiszpanska' | 'grecka' | 'japonska'

export const CUISINES: Cuisine[] = ['wloska', 'polska', 'francuska', 'hiszpanska', 'grecka', 'japonska']

export const CUISINE_LABELS: Record<Cuisine, string> = {
  wloska:     'Włoska',
  polska:     'Polska',
  francuska:  'Francuska',
  hiszpanska: 'Hiszpańska',
  grecka:     'Grecka',
  japonska:   'Japońska',
}

export const CUISINE_EMOJI: Record<Cuisine, string> = {
  wloska:     '🇮🇹',
  polska:     '🇵🇱',
  francuska:  '🇫🇷',
  hiszpanska: '🇪🇸',
  grecka:     '🇬🇷',
  japonska:   '🇯🇵',
}

// Mocne, jednoznaczne sygnały — pierwszy pasujący wzorzec wygrywa.
// Dania nie pasujące do żadnej kuchni traktowane są jako uniwersalne
// (pokazują się tylko gdy wybrane "Wszystkie").
const CUISINE_PATTERNS: Array<[Cuisine, RegExp]> = [
  ['japonska',   /\b(miso|wasabi|sushi|teriyaki|edamame|nori|wodorost|shiitake|ramen|tempura|japoń|japon|dashi|tofu w sosie sojow|olej sezamow|pasta miso|sos sojow.+sezam|sezam.+sos sojow)\w*/i],
  ['grecka',     /\b(feta|tzatziki|gyros|moussaka|musaka|grecki|grecka|halloumi|kalamata|po greck)\w*/i],
  ['francuska',  /\b(ratatouille|quiche|hollandaise|niço|nicoise|roquefort|brie|camembert|francusk|tarte|crepe|crêpe|baget|provençal|prowansal|bourguignon|coq au|beurre|florenck|bénédict|benedykt|ser kozi)\w*/i],
  ['hiszpanska', /\b(paell|gazpacho|tapas|chorizo|manchego|hiszpań|hiszpan|sangria|serrano|jamón|jamon|tortilla hiszp|po hiszpańsk|po hiszpansk)\w*/i],
  ['wloska',     /\b(caprese|pesto|parmezan|mozzarell|ricotta|balsamico|włosk|wlosk|minestrone|focaccia|prosciutto|suszone pomidor|pelati|bolognese|carbonara|risotto|lasagn|gnocchi|bruschett|fettuccine|tiramisu|burrata|panna cotta|mascarpone|gorgonzol)\w*/i],
  ['polska',     /\b(rosół|rosol|pierog|bigos|żurek|zurek|schab|kotlet schabow|kotlet mielon|kotlet z kurczak|kapusta kiszon|kapust kiszon|gryczan|kasza|pyzy|gołąbk|golabk|krokiet|racuch|polsk|barszcz|chłodnik|chlodnik|mizeria|szarlotk|sernik|makowiec|naleśnik|nalesnik|kopytk|placki ziemniacz|leniwe|łazank|lazank|kluski|bryzol|zrazy|śledź|sledz|ogórki kiszon|ogorki kiszon|kapusta biała.+majonez|coleslaw)\w*/i],
]

const CUISINE_BY_ID: Map<number, Cuisine> = (() => {
  const m = new Map<number, Cuisine>()
  for (const d of DISHES) {
    const haystack = `${d.nazwa} ${d.opis} ${d.skladniki}`
    for (const [c, re] of CUISINE_PATTERNS) {
      if (re.test(haystack)) { m.set(d.id, c); break }
    }
  }
  return m
})()

export function getCuisine(dishId: number): Cuisine | null {
  return CUISINE_BY_ID.get(dishId) ?? null
}

/**
 * Klasyfikuje dowolny tekst (np. nazwa+opis+składniki dania spoza puli Planera)
 * do jednej z 6 kuchni świata. Używamy w Kreatorze do filtrowania KreatorProposal
 * i propozycji ad-hoc.
 */
export function getCuisineFromText(text: string): Cuisine | null {
  for (const [c, re] of CUISINE_PATTERNS) {
    if (re.test(text)) return c
  }
  return null
}

/**
 * Filtruje pulę identyfikatorów dań po wybranej kuchni świata.
 * `null` = bez filtra (pełna pula).
 */
export function filterPoolByCuisine(pool: number[], cuisine: Cuisine | null): number[] {
  if (!cuisine) return pool
  return pool.filter(id => CUISINE_BY_ID.get(id) === cuisine)
}

export function getDish(id: number): PlanerDish {
  return DISHES.find(d => d.id === id)!
}

// ---------------------------------------------------------------------------
// MAPOWANIE DAŃ PLANERA → KATEGORIE Z LODÓWKI (Kreator)
// ---------------------------------------------------------------------------

export type FridgeCategory =
  | 'warzywa' | 'owoce' | 'nabial' | 'sery' | 'mieso' | 'ryby'
  | 'roslinne' | 'orzechy' | 'tluszcze' | 'czekolada' | 'dodatki'

interface CatPattern {
  cat: FridgeCategory
  re: RegExp
}

// Kolejność = priorytet. Dla danej liczby trafień wygrywa kategoria z większą wagą.
const CAT_PATTERNS: CatPattern[] = [
  { cat: 'ryby',      re: /\b(łoso|losos|tuńcz|tunczyk|śledź|sledz|dorsz|ryba|sardyn|makrel|krewetk|owoce morza)\w*/i },
  { cat: 'mieso',     re: /\b(kurczak|filet z kurczaka|udko|indyk|wołow|wolow|wieprz|schab|boczek|szynk|kiełbas|kielbas|mięs|mies|kotlet|mielon|polędwic|poledwic|karkówk|karkowk|stek|salami)\w*/i },
  { cat: 'sery',      re: /\b(parmez|cheddar|mozzarell|halloum|feta|gouda|brie|camembert|pleśniow|plesniow|ser żółt|ser zolt)\w*/i },
  { cat: 'nabial',    re: /\b(twaróg|twarog|twarożek|twarozek|jogurt|kefir|maślank|maslank|mleko|śmietan|smietan|mascarpone|ricott|jaj|omlet|jajec)\w*/i },
  { cat: 'czekolada', re: /\b(czekolad|kakao|brownie)\w*/i },
  { cat: 'orzechy',   re: /\b(orzech|migdał|migdal|nerkow|pistacj|chia|siemi|słonecznik|slonecznik|dyni|sezam)\w*/i },
  { cat: 'owoce',     re: /\b(jabłk|jablk|gruszk|banan|truskawk|malin|borów|borow|jagod|jagody|wiśni|wisni|brzoskwin|śliw|sliw|cytry|pomarańcz|pomarancz|ananas|mango|kiwi|owoc)\w*/i },
  { cat: 'warzywa',   re: /\b(brokuł|brokul|kalafior|cukin|bakłaż|baklaz|papryk|pomidor|ogórk|ogork|sałat|salat|szpinak|jarmuż|jarmuz|rukol|kapust|cebul|czosn|marchew|seler|dyni|dynia|fasolk|szparag|kabacz|por|rzodkiew|botwin|pieczark|grzyb|warzyw|awokado)\w*/i },
  { cat: 'tluszcze',  re: /\b(oliw|olej|masło|maslo|smalec|łój|loj|ghee)\w*/i },
  { cat: 'roslinne',  re: /\b(tofu|tempeh|seitan|hummus|ciecierzyc|soczewic|fasol|edamame|mleko kokosow|mleko sojow|mleko owsian|mleko migdał|mleko migdal)\w*/i },
  { cat: 'dodatki',   re: /\b(zioł|ziol|przyprw|przyprawy|sól|sol|pieprz|kurkum|imbir|chili|cynamon|wanil|miód|miod|erytrytol|ksylitol|ocet|sos)\w*/i },
]

/**
 * Heurystyczne wykrycie kategorii dania Planera na podstawie nazwy + składników.
 * Zwraca SET wszystkich pasujących kategorii (jedno danie może pasować do kilku,
 * np. "Kurczak z brokułem" = mieso + warzywa).
 */
export function detectDishCategories(dish: PlanerDish): Set<FridgeCategory> {
  const text = `${dish.nazwa} ${dish.skladniki}`.toLowerCase()
  const out = new Set<FridgeCategory>()
  for (const { cat, re } of CAT_PATTERNS) {
    if (re.test(text)) out.add(cat)
  }
  return out
}

export function findPlanerDishesForCategory(cat: FridgeCategory): PlanerDish[] {
  return DISHES.filter(d => detectDishCategories(d).has(cat))
}
