import React, { useEffect, useRef } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { CardsProps } from "./Cards.type";

import "./Cards.scss";

const checkIsValidCSSLengthUnit = (value: string) => {
    const validCSSLengthUnits = ['px', 'em', 'rem', '%', 'vh', 'vw', 'auto'];
    return validCSSLengthUnits.some(unit => value.endsWith(unit)) ? value : `${value}px`;
};

/**
 * Cards component — flexible card layout that optionally displays an image, main content and an expandable section.
 *
 * The component expects its children in a specific order depending on the `noImage` prop:
 * - When `noImage` is false (default): children[0] is treated as the image node, children[1] is the content node,
 *   and children[2] (optional) is the expander content that will be shown/hidden when expanded.
 * - When `noImage` is true: children[0] is treated as the content node and no image container will be rendered.
 *
 * Behavior:
 * - If a `setValue` object is provided, the card renders an expand/collapse button (chevron) and toggles expanded state.
 *   The button uses `setValue.setValue` as its onClick handler and reads `setValue.value` (boolean) to determine the current state.
 * - When `setValue.value` changes an animation class ("animate-icon" or "animate-icon-back") is briefly applied to the button
 *   and then removed (timeout of 10ms) to allow icon animation CSS to run.
 * - The top-level container accepts a `maxwidth` string which is validated by `checkIsValidCSSLengthUnit(...)`
 *   before being applied as inline `maxWidth`.
 * - Several CSS classes are conditionally applied to control layout and open/closed state:
 *   - "cards", "cards-expandet" (when expanded), "cards-link" (when `link` is truthy)
 *   - Inner classes: "cards-container-expandet" / "card-container", "contents-container",
 *     "image-container" / "image-container-expandet" (or right-aligned variant when `isRightIcon` is true),
 *     "content-container" / "content-container-image", and "expander-container" (with "open" when expanded).
 *
 * Accessibility note:
 * - The expand/collapse control is a button element. Consumers should ensure any accessible labels/aria attributes
 *   are applied to the image/content/expander children as appropriate.
 *
 * @param children - React children: expected nodes for image, content and optional expander as described above.
 * @param link - If truthy, applies link-style class to the card (visual styling only).
 * @param setValue - Optional controller object for expanded state:
 *   - value: boolean - current expanded state (true = expanded).
 *   - setValue: (event?: React.MouseEvent<HTMLButtonElement>) => void - handler to toggle or set expand state.
 * @param isRightIcon - When true, uses the right-aligned variant of the expanded image container (affects CSS class).
 * @param maxwidth - CSS length for the card's max-width (default: "100vw"). Value is validated by checkIsValidCSSLengthUnit.
 * @param noImage - When true, the component will not render an image wrapper and will treat the first child as content.
 *
 * @returns JSX.Element — the rendered card structure with optional image, content and expandable area.
 *
 * @remarks
 * - Make sure to provide children in the expected order to avoid rendering issues.
 * - The component relies on external CSS classes (listed above) to produce the visual layout and animations.
 */
export const Cards: React.FC<CardsProps> = ({
    children,
    link,
    setValue,
    isRightIcon,
    maxwidth = '100vw',
    noImage = false,
}) => {
    const childArray = React.Children.toArray(children);

    const imageChildren = noImage ? null : childArray[0] as React.JSX.Element;
    const contentChildren = noImage ? childArray[0] as React.JSX.Element : childArray[1] as React.JSX.Element;
    const expanderChildren = childArray[2] ? (childArray[2] as React.JSX.Element) : null;

    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (buttonRef.current) {
            const iconElement = buttonRef.current;
            if (setValue && setValue.value === true) {
                iconElement.classList.add("animate-icon");
            } else if (setValue && setValue.value === false) {
                iconElement.classList.add("animate-icon-back");
            }
            setTimeout(() => {
                iconElement.classList.remove("animate-icon");
                iconElement.classList.remove("animate-icon-back");
            }, 10);
        }
    }, [setValue?.value]);

    const ExpandedImage = () => (
        <div className={isRightIcon ? "image-container-expandet-is-right" : "image-container-expandet"}>
            {imageChildren}
            <button ref={buttonRef} className="expandet-icon" onClick={setValue?.setValue}>
                <FontAwesomeIcon icon={setValue?.value ? faChevronUp : faChevronDown} />
            </button>
        </div>
    );

    const NormalImage = () => (
        <>
            {noImage ? null :
                <div className="image-container">
                    {imageChildren}
                </div>
            }
        </>
    );

    return (
        <div
            style={{ maxWidth: checkIsValidCSSLengthUnit(maxwidth) }}
            className={classNames("cards", {
                "cards-expandet": setValue?.value,
                "cards-link": link
            })}
        >
            <div className={setValue?.value ? "cards-container-expandet" : "card-container"}>
                <div className="contents-container">
                    {expanderChildren ? <ExpandedImage /> : <NormalImage />}
                    <div className={`${noImage ? 'content-container' : 'content-container-image'}`}>{contentChildren}</div>
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
