import { useWindowDimensions } from "react-native";

export type Breakpoint = "mobile" | "tablet" | "desktop";

/**
 * Mobile-first responsive breakpoints driven by window width.
 *
 *  - mobile:  < 600  (telefon — domyślny, najgęstszy layout)
 *  - tablet:  600–899
 *  - desktop: >= 900
 *
 * `content` zwraca gotowe style kontenera treści: na telefonie pełna
 * szerokość z ciasnym paddingiem, a na tablecie/desktopie kolumna jest
 * wyśrodkowana i ograniczona `maxWidth`, żeby karty nie rozciągały się
 * na całą szerokość ekranu.
 */
export function useBreakpoint() {
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;
  const isMobile = width < 600;
  const bp: Breakpoint = isDesktop ? "desktop" : isTablet ? "tablet" : "mobile";

  const content = {
    paddingHorizontal: isDesktop ? 32 : isTablet ? 24 : 16,
    maxWidth: isDesktop ? 760 : isTablet ? 600 : undefined,
    alignSelf: "center" as const,
    width: "100%" as const,
  };

  return { width, height, bp, isMobile, isTablet, isDesktop, content };
}
