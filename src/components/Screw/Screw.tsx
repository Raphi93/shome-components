import React from "react";
import "./Screw.css";

export type ScrewSize = "xs" | "sm" | "md" | "lg" | "xlg";

export type CommonProps = {
  size?: ScrewSize;
  className?: string;
};

const SIZE_MAP: Record<ScrewSize, number> = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xlg: 36,
};

const styleFromSize = (size: ScrewSize | undefined) =>
  size ? ({ ["--screw-size" as any]: `${SIZE_MAP[size]}px` } as React.CSSProperties) : undefined;

export function Screw({ size = "md", className }: CommonProps) {
  const style = styleFromSize(size);
  return (
    <>
      <div className={["screw top-left cross rotated", className ?? ""].join(" ")} style={style} />
      <div className={["screw top-right cross", className ?? ""].join(" ")} style={style} />
      <div className={["screw bottom-left cross", className ?? ""].join(" ")} style={style} />
      <div className={["screw bottom-right cross rotated", className ?? ""].join(" ")} style={style} />
    </>
  );
}

export function ScrewCircle({ size = "md", className }: CommonProps) {
  const style = styleFromSize(size);
  return (
    <>
      <div className={["screw top-left-circle cross rotated", className ?? ""].join(" ")} style={style} />
      <div className={["screw top-right-circle cross", className ?? ""].join(" ")} style={style} />
      <div className={["screw bottom-left-circle cross", className ?? ""].join(" ")} style={style} />
      <div className={["screw bottom-right-circle cross rotated", className ?? ""].join(" ")} style={style} />
    </>
  );
}
