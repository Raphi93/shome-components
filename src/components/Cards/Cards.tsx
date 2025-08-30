import React, { useEffect, useRef } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { CardsProps } from "./Cards.type";

// ⚠️ Falls deine Datei anders heißt, ggf. anpassen:
// import "./Cards.module.scss";
import "./Cards.css";

/**
 * Ensures a given string is a valid CSS length. If unitless, `px` is appended.
 *
 * @param value - Any CSS length string (e.g. "20px", "2rem", "50%") or unitless number string (e.g. "320")
 * @returns A valid CSS length (e.g. "320px" if unitless)
 *
 * @example
 * checkIsValidCSSLengthUnit("24")      // "24px"
 * checkIsValidCSSLengthUnit("1.5rem")  // "1.5rem"
 */
const checkIsValidCSSLengthUnit = (value: string) => {
  const validCSSLengthUnits = ["px", "em", "rem", "%", "vh", "vw", "auto"];
  return validCSSLengthUnits.some((unit) => value.endsWith(unit)) ? value : `${value}px`;
};

/**
 * # Cards
 *
 * A composable **card layout** with optional image area, main content area, and an **expandable section**.
 * The component uses a **slot-like** composition via child helpers (`CardImage`, `CardContent`, `CardExpander`, …).
 *
 * ## Composition rules
 * Order of children if `noImage === false` (default):
 * 1. **Image slot** – usually `<CardImage />` or `<CardsImageSelf />`
 * 2. **Content slot** – `<CardContent />` (required)
 * 3. **Expander slot** – `<CardExpander />` (optional)
 *
 * If `noImage === true`, the **first** child is treated as **content** directly.
 *
 * ## Behavior
 * - If an **expander child** exists **and** `setValue` is provided, a chevron button is rendered to toggle the panel.
 * - `link` adds subtle **hover scale & shadow** to hint interactivity (purely visual).
 * - `maxwidth` controls the outer card width (any CSS length).
 * - `isRightIcon` moves image + chevron to the **right** in the expanded header layout.
 *
 * ## Examples
 * **Basic (image + content)**
 * ```tsx
 * <Cards>
 *   <CardImage src="/hero.jpg" alt="Hero" height="8rem" />
 *   <CardContent>
 *     <h3>Title</h3>
 *     <p>Description text goes here.</p>
 *   </CardContent>
 * </Cards>
 * ```
 *
 * **Content-only**
 * ```tsx
 * <Cards noImage>
 *   <CardContent>
 *     <h3>Only Content</h3>
 *     <p>There is no image in this card.</p>
 *   </CardContent>
 * </Cards>
 * ```
 *
 * **Expandable**
 * ```tsx
 * const [open, setOpen] = useState(false);
 * <Cards setValue={{ value: open, setValue: () => setOpen(v => !v) }}>
 *   <CardImage src="/place.jpg" alt="Place" />
 *   <CardContent>...</CardContent>
 *   <CardExpander>
 *     <div style={{ padding: '1rem' }}>Hidden details…</div>
 *   </CardExpander>
 * </Cards>
 * ```
 *
 * ## CSS Variables (theming)
 * - `--border-radius` – corner radius
 * - `--color-box-shadow` – shadows/border tints (e.g. `rgba(29,34,41,.1)`)
 * - Color helpers used by icon utility classes: `--color-primary`, `--color-secondary`, `--color-success`,
 *   `--color-danger`, `--color-warning`, `--color-info`, `--color-yellow`, `--color-white`, `--color-black`
 *
 * ## Class hooks (from SCSS)
 * - Root: `.cards` (+ `.cards-expandet`, `.cards-link`)
 * - Surface: `.card-container`, `.cards-container-expandet`
 * - Image: `.image-container`, `.image-container-expandet`, `.image-container-expandet-is-right`
 * - Content: `.content-container`, `.content-container-image`
 * - Row: `.contents-container`
 * - Expander panel: `.expander-container` (+ `.open`)
 * - Chevron: `.expandet-icon` (+ `.animate-icon` / `.animate-icon-back`)
 *
 * @remarks
 * This component is **layout-only** and does not perform navigation. Use a surrounding `<a>`/router-link if needed.
 *
 * @param props - {@link CardsProps} controlling composition & behavior
 * @param props.children - Slot children (image/content/expander). See composition rules above.
 * @param props.link - When `true`, applies hover scale & shadow (visual affordance only).
 * @param props.setValue - Controlled expander `{ value, setValue }`. If provided & an expander child exists, a chevron button appears.
 * @param props.isRightIcon - In expanded header layout, puts image + chevron on the **right** side.
 * @param props.maxwidth - Maximum width of the card container (any CSS length). Defaults to `"100vw"`.
 * @param props.noImage - Treat the first child as **content** (no image slot).
 */
const Cards: React.FC<CardsProps> = ({
  children,
  link,
  setValue,
  isRightIcon,
  maxwidth = "100vw",
  noImage = false,
}) => {
  const childArray = React.Children.toArray(children);

  const imageChildren = noImage ? null : (childArray[0] as React.JSX.Element);
  const contentChildren = noImage
    ? (childArray[0] as React.JSX.Element)
    : (childArray[1] as React.JSX.Element);
  const expanderChildren = childArray[2] ? (childArray[2] as React.JSX.Element) : null;

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle chevron animation class toggles when value changes
  useEffect(() => {
    if (!buttonRef.current) return;
    const el = buttonRef.current;

    if (setValue && setValue.value === true) {
      el.classList.add("animate-icon");
    } else if (setValue && setValue.value === false) {
      el.classList.add("animate-icon-back");
    }
    // Briefly add class then remove to trigger CSS transition
    const t = setTimeout(() => {
      el.classList.remove("animate-icon");
      el.classList.remove("animate-icon-back");
    }, 10);

    return () => clearTimeout(t);
  }, [setValue?.value]);

  const ExpandedImage = () => (
    <div className={isRightIcon ? "image-container-expandet-is-right" : "image-container-expandet"}>
      {imageChildren}
      <button ref={buttonRef} className="expandet-icon" onClick={setValue?.setValue}>
        <FontAwesomeIcon icon={setValue?.value ? faChevronUp : faChevronDown} />
      </button>
    </div>
  );

  const NormalImage = () =>
    noImage ? null : (
      <div className="image-container">
        {imageChildren}
      </div>
    );

  return (
    <div
      style={{ maxWidth: checkIsValidCSSLengthUnit(maxwidth) }}
      className={classNames("cards", {
        "cards-expandet": setValue?.value,
        "cards-link": link,
      })}
    >
      <div className={setValue?.value ? "cards-container-expandet" : "card-container"}>
        <div className="contents-container">
          {expanderChildren ? <ExpandedImage /> : <NormalImage />}
          <div className={noImage ? "content-container" : "content-container-image"}>
            {contentChildren}
          </div>
        </div>
      </div>

      {expanderChildren && (
        <div className={`expander-container ${setValue?.value ? "open" : ""}`}>
          {expanderChildren}
        </div>
      )}
    </div>
  );
};

export default Cards;
