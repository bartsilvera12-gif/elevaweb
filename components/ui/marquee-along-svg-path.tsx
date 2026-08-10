"use client";
import React, { RefObject, useCallback, useEffect, useRef } from "react";
import {
  motion,
  SpringOptions,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, value: number): number => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

type PreserveAspectRatioAlign =
  | "none" | "xMinYMin" | "xMidYMin" | "xMaxYMin"
  | "xMinYMid" | "xMidYMid" | "xMaxYMid"
  | "xMinYMax" | "xMidYMax" | "xMaxYMax";

interface CSSVariableInterpolation {
  property: string;
  from: number | string;
  to: number | string;
}

type PreserveAspectRatioMeetOrSlice = "meet" | "slice";
type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`;

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode;
  className?: string;
  path: string;
  pathId?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  baseVelocity?: number;
  direction?: "normal" | "reverse";
  easing?: (value: number) => number;
  slowdownOnHover?: boolean;
  slowDownFactor?: number;
  slowDownSpringConfig?: SpringOptions;
  useScrollVelocity?: boolean;
  scrollAwareDirection?: boolean;
  scrollSpringConfig?: SpringOptions;
  scrollContainer?: RefObject<HTMLElement | null> | HTMLElement | null;
  repeat?: number;
  draggable?: boolean;
  dragSensitivity?: number;
  dragVelocityDecay?: number;
  dragAwareDirection?: boolean;
  grabCursor?: boolean;
  enableRollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;
  cssVariableInterpolation?: CSSVariableInterpolation[];
  responsive?: boolean;
}

const MarqueeAlongSvgPath = ({
  children,
  className,
  path,
  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },
  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,
  repeat = 3,
  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,
  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,
  cssVariableInterpolation = [],
  responsive = false,
}: MarqueeAlongSvgPathProps) => {
  const container = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const baseOffset = useMotionValue(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!responsive) return;
    const [, , vbW, vbH] = viewBox.split(" ").map(Number);
    const originalWidth = vbW || 100;
    const originalHeight = vbH || 100;
    const updateScale = () => {
      const wrapper = container.current;
      const marqueeContainer = marqueeContainerRef.current;
      if (!wrapper || !marqueeContainer) return;
      const wrapperWidth = wrapper.clientWidth;
      const wrapperHeight = wrapper.clientHeight;
      const scale = Math.min(wrapperWidth / originalWidth, wrapperHeight / originalHeight);
      const scaledWidth = originalWidth * scale;
      const scaledHeight = originalHeight * scale;
      const offsetX = (wrapperWidth - scaledWidth) / 2;
      const offsetY = (wrapperHeight - scaledHeight) / 2;
      marqueeContainer.style.width = `${originalWidth}px`;
      marqueeContainer.style.height = `${originalHeight}px`;
      marqueeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      marqueeContainer.style.transformOrigin = "top left";
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [responsive, viewBox]);

  const items = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => {
        const itemIndex = repeatIndex * childrenArray.length + childIndex;
        return { child, childIndex, repeatIndex, itemIndex, key: `${childIndex}-${repeatIndex}` };
      })
    );
  }, [children, repeat]);

  const calculateZIndex = useCallback(
    (offsetDistance: number) => {
      if (!enableRollingZIndex) return undefined;
      const normalizedDistance = offsetDistance / 100;
      return Math.floor(zIndexBase + normalizedDistance * zIndexRange);
    },
    [enableRollingZIndex, zIndexBase, zIndexRange]
  );

  const id = pathId || `marquee-path-${Math.random().toString(36).substring(7)}`;

  const { scrollY } = useScroll({
    container: (scrollContainer as RefObject<HTMLDivElement | null>) || container,
  });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig);

  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const dragVelocity = useRef(0);
  const directionFactor = useRef(direction === "normal" ? 1 : -1);
  const hoverFactorValue = useMotionValue(1);
  const defaultVelocity = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig);

  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false }
  );

  useAnimationFrame((_, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current);
      dragVelocity.current *= 0.9;
      if (Math.abs(dragVelocity.current) < 0.01) dragVelocity.current = 0;
      return;
    }
    hoverFactorValue.set(isHovered.current && slowdownOnHover ? slowDownFactor : 1);
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * smoothHoverFactor.get();
    if (scrollAwareDirection && !isDragging.current) {
      if (velocityFactor.get() < 0) directionFactor.current = -1;
      else if (velocityFactor.get() > 0) directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    if (draggable) {
      moveBy += dragVelocity.current;
      if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocity.current);
      }
      if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay;
      } else if (!isDragging.current) {
        dragVelocity.current = 0;
      }
    }
    baseOffset.set(baseOffset.get() + moveBy);
  });

  const lastPointerPosition = useRef({ x: 0, y: 0 });
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (grabCursor) (e.currentTarget as HTMLElement).style.cursor = "grabbing";
    isDragging.current = true;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    dragVelocity.current = 0;
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !isDragging.current) return;
    const cur = { x: e.clientX, y: e.clientY };
    const dx = cur.x - lastPointerPosition.current.x;
    const dy = cur.y - lastPointerPosition.current.y;
    const delta = Math.sqrt(dx * dx + dy * dy);
    dragVelocity.current = (dx > 0 ? delta : -delta) * dragSensitivity;
    lastPointerPosition.current = cur;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    isDragging.current = false;
    if (grabCursor) (e.currentTarget as HTMLElement).style.cursor = "grab";
  };

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn("relative", className)}
    >
      <div ref={marqueeContainerRef} className="relative" style={{ contain: "layout style" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className="w-full h-full"
        >
          <path id={id} d={path} stroke={showPath ? "currentColor" : "none"} fill="none" ref={pathRef} />
        </svg>
        {items.map(({ child, repeatIndex, itemIndex, key }) => (
          <MarqueeItem
            key={key}
            uniqueKey={key}
            baseOffset={baseOffset}
            itemIndex={itemIndex}
            totalItems={items.length}
            path={path}
            easing={easing}
            enableRollingZIndex={enableRollingZIndex}
            calculateZIndex={calculateZIndex}
            cssVariableInterpolation={cssVariableInterpolation}
            draggable={draggable}
            grabCursor={grabCursor}
            hidden={repeatIndex > 0}
            onEnter={() => (isHovered.current = true)}
            onLeave={() => (isHovered.current = false)}
          >
            {child}
          </MarqueeItem>
        ))}
      </div>
    </div>
  );
};

interface MarqueeItemProps {
  uniqueKey: string;
  baseOffset: MotionValue<number>;
  itemIndex: number;
  totalItems: number;
  path: string;
  easing?: (v: number) => number;
  enableRollingZIndex: boolean;
  calculateZIndex: (v: number) => number | undefined;
  cssVariableInterpolation: CSSVariableInterpolation[];
  draggable: boolean;
  grabCursor: boolean;
  hidden: boolean;
  onEnter: () => void;
  onLeave: () => void;
  children: React.ReactNode;
}

function MarqueeItem({
  baseOffset, itemIndex, totalItems, path, easing,
  enableRollingZIndex, calculateZIndex, cssVariableInterpolation,
  draggable, grabCursor, hidden, onEnter, onLeave, children,
}: MarqueeItemProps) {
  const itemOffset = useTransform(baseOffset, (v) => {
    const position = (itemIndex * 100) / totalItems;
    const wrappedValue = wrap(0, 100, v + position);
    return `${easing ? easing(wrappedValue / 100) * 100 : wrappedValue}%`;
  });
  const currentOffsetDistance = useMotionValue(0);
  const zIndex = useTransform(currentOffsetDistance, (v) => calculateZIndex(v) ?? 0);

  useEffect(() => {
    const unsub = itemOffset.on("change", (value: string) => {
      const m = value.match(/^([\d.]+)%$/);
      if (m && m[1]) currentOffsetDistance.set(parseFloat(m[1]));
    });
    return unsub;
  }, [itemOffset, currentOffsetDistance]);

  const cssVariables: Record<string, MotionValue<number | string>> = Object.fromEntries(
    (cssVariableInterpolation || []).map(({ property, from, to }) => [
      property,
      useTransform(currentOffsetDistance, [0, 100], [from, to]),
    ])
  );

  return (
    <motion.div
      className={cn("absolute top-0 left-0", draggable && grabCursor && "cursor-grab")}
      style={{
        offsetPath: `path('${path}')`,
        offsetDistance: itemOffset,
        zIndex: enableRollingZIndex ? zIndex : undefined,
        willChange: "offset-distance",
        backfaceVisibility: "hidden",
        ...cssVariables,
      }}
      aria-hidden={hidden}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

export default MarqueeAlongSvgPath;
