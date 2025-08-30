import React, { forwardRef } from 'react';
import type { Placement } from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';

import './Tooltip.css';

export interface TooltipOptions {
  /** Is open by default */
  initialOpen?: boolean;
  /** Position of the tooltip relative to the element */
  placement?: Placement;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open state change handler */
  onOpenChange?: (open: boolean) => void;
}

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);
  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }
  return context;
};

/** Text tip that replaces default HTML title */
export function Tooltip({
  children,
  ...options
}: { children: React.ReactNode } & TooltipOptions) {
  const tooltip = useTooltip(options);
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, className, ...props }, propRef) {
  const context = useTooltipContext();
  const childrenRef = (children as any)?.ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  const stateAttr = context.open ? 'open' : 'closed';

  // asChild: wrapped Element bleibt erhalten
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<any>;
    const mergedClass = clsx((childElement.props as any).className, 'tooltip-trigger', className);
    return React.cloneElement(childElement, {
      ...context.getReferenceProps({
        ...(typeof childElement.props === 'object' ? (childElement.props as object) : {}),
        ...props,
        ref,
        className: mergedClass,
      }),
      'data-state': stateAttr,
    });
  }

  // Default: wir rendern ein <button>
  return (
    <button
      type="button"
      ref={ref as any}
      className={clsx('tooltip-trigger', className)}
      data-state={stateAttr}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const TooltipContent = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function TooltipContent({ style, className, ...props }, propRef) {
    const context = useTooltipContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);

    if (!context.open) return null;

    return (
      <FloatingPortal>
        <div
          ref={ref}
          style={{ ...context.floatingStyles, ...style }}
          className={clsx('tooltip-content', className)}
          {...context.getFloatingProps(props)}
        />
      </FloatingPortal>
    );
  }
);
