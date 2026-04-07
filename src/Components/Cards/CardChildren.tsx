import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CardChildrenProps, CardIconContentProps, CardImageContentProps } from "./Cards.type";

const checkIsValidCSSLengthUnit = (value: string) => {
  const validCSSLengthUnits = ['px', 'em', 'rem', '%', 'vh', 'vw', 'auto'];
  return validCSSLengthUnits.some(unit => value.endsWith(unit)) ? value : `${value}px`;
};

/**
 * Renders the content for a Card.
 *
 * Lightweight wrapper component that returns its children inside a React Fragment.
 * This provides a semantically named subcomponent for card content without
 * introducing additional DOM elements or styles by default.
 *
 * @param children - The content to render inside the card (text, elements, or other components).
 * @returns A React fragment containing the provided children (or null/empty fragment if no children).
 *
 * @example
 * <Card>
 *   <CardContent>
 *     <p>Card body text</p>
 *   </CardContent>
 * </Card>
 */
export const CardContent: React.FC<CardChildrenProps> = ({
  children,
}) => {
  return <>{children}</>;
}

/**
 * CardsImageSelf — passthrough wrapper for card children (typically image or media content).
 *
 * Renders its children verbatim without adding any extra DOM nodes or styling.
 * Use this component when you want to provide semantic/typed composition for
 * card content while preserving the original element structure.
 *
 * @remarks
 * - This component intentionally returns its children wrapped in a fragment,
 *   so it does not introduce additional wrapper elements or affect layout.
 *
 * @param props.children - The content to render (usually image JSX or other media).
 * @returns The provided children rendered as-is.
 *
 * @example
 * <CardsImageSelf>
 *   <img src="cover.jpg" alt="Cover image" />
 * </CardsImageSelf>
 */
export const CardsImageSelf: React.FC<CardChildrenProps> = ({
  children,
}) => {
  return (
    <>{children}</>
  );
}

/**
 * CardExpander
 *
 * A lightweight wrapper used to mark or group content that belongs to a card's expandable region.
 * This component intentionally does not add any DOM nodes (it returns a fragment) — it simply
 * forwards its children so the parent Card component can control visibility, styling, and accessibility.
 *
 * @param children - The content to render inside the expander. Accepts any valid React node.
 * @returns A JSX fragment containing the provided children.
 *
 * @remarks
 * - Use this component when you want to semantically separate expandable content from the rest of the card
 *   without introducing extra DOM elements.
 * - Any behavior (expand/collapse, ARIA attributes, animations) should be handled by the parent Card component.
 *
 * @example
 * <Card>
 *   <CardHeader>Title</CardHeader>
 *   <CardExpander>
 *     <div>Expanded content goes here</div>
 *   </CardExpander>
 * </Card>
 */
export const CardExpander: React.FC<CardChildrenProps> = ({
  children,
}) => {
  return (
    <>{children}</>
  );
}

/**
 * Renders a FontAwesome icon styled for use inside a card.
 *
 * @param icon - The FontAwesome icon definition to render (e.g., an IconDefinition).
 * @param fontSize - CSS length used for the icon size (any valid CSS length unit). Defaults to '1.5rem'. The value is validated via checkIsValidCSSLengthUnit before being applied.
 * @param iconColor - A CSS class or semantic name applied to control the icon color (e.g., 'primary'). Defaults to 'primary'.
 * @param className - Additional CSS class(es) to append to the icon element.
 *
 * @returns A JSX element (FontAwesomeIcon) with combined classes and an inline font-size style.
 *
 * @example
 * <CardIcon icon={faCoffee} fontSize="2rem" iconColor="accent" className="my-icon" />
 */
export const CardIcon: React.FC<CardIconContentProps> = ({
  icon,
  fontSize = '1.5rem',
  iconColor = 'primary',
  className,
}) => {

  return (
    <FontAwesomeIcon icon={icon} className={`iconCard pdc-card-${iconColor} ${className}`} style={{ fontSize: checkIsValidCSSLengthUnit(fontSize) }} />
  );
};

/**
 * Renders an image intended for use inside a card component.
 *
 * @param props - Component props.
 * @param props.src - Source URL or path for the image.
 * @param props.alt - Alternative text for the image. Defaults to an empty string.
 * @param props.height - CSS height value (e.g. '5rem', '100px'). Defaults to '5rem'.
 * @param props.width - CSS width value (e.g. 'auto', '100%'). Defaults to 'auto'.
 * @param props.landscape - When true and the incoming height equals the default ('5rem'),
 *                          the component increases the height to '7rem'. Defaults to false.
 * @param props.maxwidth - CSS max-width value applied to the image. Defaults to '50rem'.
 * @param props.className - Additional CSS class(es) to append to the image element.
 *
 * @remarks
 * - The height, width and maxwidth values are validated via checkIsValidCSSLengthUnit before being applied inline.
 * - The component always includes the 'imageCard' CSS class and appends any provided className.
 *
 * @returns JSX.Element - an <img> element configured with validated inline sizing and classes.
 */
export const CardImage: React.FC<CardImageContentProps> = ({
  src,
  alt = '',
  height = '5rem',
  width = 'auto',
  landscape = false,
  maxwidth = '50rem',
  className,
}) => {
  if (landscape && height === '5rem') {
    height = '7rem'
  }
  return (
    <img
      style={{
        height: checkIsValidCSSLengthUnit(height),
        width: checkIsValidCSSLengthUnit(width),
        maxWidth: checkIsValidCSSLengthUnit(maxwidth)
      }}
      className={`imageCard ${className}`} src={src}
      alt={alt}
    />
  );
};
