import React, { useEffect, useRef } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { CardsProps } from "./Cards.type";
import "./Cards.css";

const checkIsValidCSSLengthUnit = (value: string) => {
  const validCSSLengthUnits = ["px", "em", "rem", "%", "vh", "vw", "auto"];
  return validCSSLengthUnits.some((unit) => value.endsWith(unit)) ? value : `${value}px`;
};

const Cards: React.FC<CardsProps> = ({
  children,
  link,
  setValue,
  isRightIcon,
  maxwidth = "100vw",
  noImage = false,
}) => {
  const childArray = React.Children.toArray(children);

  const imageChildren = noImage ? null : (childArray[0] as React.JSX.Element | undefined);
  const contentChildren = noImage
    ? (childArray[0] as React.JSX.Element | undefined)
    : (childArray[1] as React.JSX.Element | undefined);

  const expanderChildren = (noImage
    ? (childArray[1] as React.JSX.Element | undefined) // [Content, Expander]
    : (childArray[2] as React.JSX.Element | undefined) // [Image, Content, Expander]
  ) || null;

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;
    const el = buttonRef.current;

    if (setValue && setValue.value === true) {
      el.classList.add("animate-icon");
    } else if (setValue && setValue.value === false) {
      el.classList.add("animate-icon-back");
    }
    const t = setTimeout(() => {
      el.classList.remove("animate-icon");
      el.classList.remove("animate-icon-back");
    }, 10);

    return () => clearTimeout(t);
  }, [setValue?.value]);

  const ExpandedImage = () => (
    <div className={isRightIcon ? "image-container-expandet-is-right" : "image-container-expandet"}>
      {imageChildren /* bei noImage ist das einfach leer – ok */}
      {setValue && (
        <button
          ref={buttonRef}
          className="expandet-icon"
          onClick={setValue.setValue}
          aria-label={setValue.value ? "Collapse details" : "Expand details"}
          type="button"
        >
          <FontAwesomeIcon icon={setValue.value ? faChevronUp : faChevronDown} />
        </button>
      )}
    </div>
  );

  const NormalImage = () =>
    noImage ? null : (
      <div className="image-container">
        {imageChildren}
      </div>
    );

  const hasExpandableControl = Boolean(expanderChildren && setValue);

  return (
    <div
      style={{ maxWidth: checkIsValidCSSLengthUnit(maxwidth) }}
      className={classNames("cards", {
        "cards-expandet": !!setValue?.value,
        "cards-link": link,
      })}
    >
      <div className={setValue?.value ? "cards-container-expandet" : "card-container"}>
        <div className="contents-container">
          {/* Nur wenn Expander + setValue existieren, zeigen wir die Chevron-Header-Zeile */}
          {hasExpandableControl ? <ExpandedImage /> : <NormalImage />}
          <div className={noImage ? "content-container" : "content-container-image"}>
            {contentChildren}
          </div>
        </div>
      </div>

      {/* Panel nur rendern, wenn Expander + setValue vorhanden sind */}
      {hasExpandableControl && (
        <div className={`expander-container ${setValue?.value ? "open" : ""}`}>
          {expanderChildren}
        </div>
      )}
    </div>
  );
};

export default Cards;
