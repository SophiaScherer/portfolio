/**
 * Every Material Symbols icon the site renders. The icon font is requested as
 * a subset of just these glyphs (about 5 KB instead of over 1 MB), so an icon
 * missing from this list renders as its raw name. Add new icons here.
 */
export const MATERIAL_ICONS = [
  "arrow_forward",
  "arrow_outward",
  "check_circle",
  "close",
  "code",
  "code_blocks",
  "dark_mode",
  "handshake",
  "insights",
  "layers",
  "light_mode",
  "lightbulb",
  "location_on",
  "mail",
  "memory",
  "person",
  "query_stats",
  "settings",
  "terminal",
] as const;

/**
 * Stylesheet for the icon subset. Only the axes in use are requested (weight
 * 400, fill on/off). The API requires icon names in alphabetical order, and
 * `display=block` hides icons briefly rather than flashing their names as text.
 */
export const MATERIAL_SYMBOLS_HREF =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1" +
  `&icon_names=${[...MATERIAL_ICONS].sort().join(",")}` +
  "&display=block";
