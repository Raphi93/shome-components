import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  CardChildrenProps,
  CardIconContentProps,
  CardImageContentProps,
} from "./Cards.type";

const checkIsValidCSSLengthUnit = (value: string) => {
  const validCSSLengthUnits = ["px", "em", "rem", "%", "vh", "vw", "auto"];
  return validCSSLengthUnits.some((unit) => value.endsWith(unit))
    ? value
    : `${value}px`;
};

/**
 * ## CardContent
 *
 * Container for the **main content area** of a card.
 * Wraps text, headings, custom JSX, etc.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <h3>Title</h3>
 *   <p>Description text</p>
 * </CardContent>
 * ```
 */
function CardContent({ children }: CardChildrenProps) {
  return <>{children}</>;
}

/**
 * ## CardsImageSelf
 *
 * Use when you want to provide your own **image element(s)** instead of
 * using the built-in `<CardImage />`.
 * The children are rendered directly into the image slot.
 *
 * @example
 * ```tsx
 * <CardsImageSelf>
 *   <picture>
 *     <source srcSet="/image.webp" type="image/webp" />
 *     <img src="/image.png" alt="Custom" />
 *   </picture>
 * </CardsImageSelf>
 * ```
 */
function CardsImageSelf({ children }: CardChildrenProps) {
  return <>{children}</>;
}

/**
 * ## CardExpander
 *
 * Defines the **expandable panel content** of a card.
 * Will be rendered inside the collapsible area when `setValue` is provided on `<Cards />`.
 *
 * @example
 * ```tsx
 * <CardExpander>
 *   <div style={{ padding: '1rem' }}>
 *     Hidden details go here…
 *   </div>
 * </CardExpander>
 * ```
 */
function CardExpander({ children }: CardChildrenProps) {
  return <>{children}</>;
}

/**
 * ## CardIcon
 *
 * A convenience wrapper for **FontAwesome icons** used inside cards.
 * Applies sizing and theme color classes automatically.
 *
 * @param icon - FontAwesome icon (`IconProp`)
 * @param fontSize - CSS length for icon size (`"1.5rem"` default)
 * @param iconColor - Token class (`"primary" | "secondary" | "red" | "green" | "blue" | "orange" | "yellow" | "white" | "black"`)
 * @param className - Extra class hooks
 * @param width - CSS width of the icon container
 *
 * @example
 * ```tsx
 * <CardIcon icon={faCircleInfo} iconColor="blue" fontSize="2rem" />
 * ```
 */
function CardIcon({
  icon,
  fontSize = "1.5rem",
  iconColor = "primary",
  className,
  width = "auto",
}: CardIconContentProps) {
  const iconStyles = {
    width: checkIsValidCSSLengthUnit(width),
    fontSize: checkIsValidCSSLengthUnit(fontSize),
  };

  return (
    <FontAwesomeIcon
      icon={icon}
      className={`iconCard ${iconColor} ${className}`}
      style={iconStyles}
    />
  );
}

/**
 * ## CardImage
 *
 * Built-in responsive image element for cards with sizing helpers.
 *
 * - If `landscape === true` and `height` is default `"5rem"`, it becomes `"7rem"`.
 * - Uses `object-fit: fill` from SCSS by default.
 *
 * @param src - Image source
 * @param alt - Accessible alt text
 * @param height - CSS length, default `"5rem"`
 * @param width - CSS length, default `"auto"`
 * @param maxwidth - CSS length, default `"50rem"`
 * @param landscape - If true, slightly taller default
 * @param className - Extra class hooks
 *
 * @example
 * ```tsx
 * <CardImage src="/hero.jpg" alt="Hero" height="8rem" />
 * ```
 */
function CardImage({
  src,
  alt = "",
  height = "5rem",
  width = "auto",
  landscape = false,
  maxwidth = "50rem",
  className,
}: CardImageContentProps) {
  if (landscape && height === "5rem") {
    height = "7rem";
  }
  return (
    <img
      style={{
        height: checkIsValidCSSLengthUnit(height),
        width: checkIsValidCSSLengthUnit(width),
        maxWidth: checkIsValidCSSLengthUnit(maxwidth),
      }}
      className={`imageCard ${className}`}
      src={src}
      alt={alt}
    />
  );
}

export { CardContent, CardsImageSelf, CardExpander, CardIcon, CardImage };
