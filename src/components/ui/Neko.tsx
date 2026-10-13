"use client";

import { useEffect, useSyncExternalStore } from "react";

function subscribeToPointerPreferences(listener: () => void) {
  const queries = [window.matchMedia("(prefers-reduced-motion: reduce)"), window.matchMedia("(pointer: coarse)")];
  queries.forEach(query => query.addEventListener("change", listener));
  return () => queries.forEach(query => query.removeEventListener("change", listener));
}
const canRunNeko = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !window.matchMedia("(pointer: coarse)").matches;

export default function Neko({ spriteSrc = "/neko.gif" }: { spriteSrc?: string }) {
  const allowed = useSyncExternalStore(subscribeToPointerPreferences, canRunNeko, () => false);
  useEffect(() => {
    if (!allowed) return;
    if (document.getElementById("oneko")) return;

    const isReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches === true;
    if (isReducedMotion || isTouchDevice) return;

    const nekoEl = document.createElement("div");

    let nekoPosX = 32;
    let nekoPosY = 32;
    let mousePosX = 0;
    let mousePosY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;
    let isDragging = false;
    let dragPointerId: number | null = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    const nekoSpeed = 10;
    const pawPrints = new Set<HTMLDivElement>();
    const pawTimers = new Set<number>();

    const spriteSets: Record<string, [number, number][]> = {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
      scratchWallN: [[0, 0], [0, -1]],
      scratchWallS: [[-7, -1], [-6, -2]],
      scratchWallE: [[-2, -2], [-2, -3]],
      scratchWallW: [[-4, 0], [-4, -1]],
      tired: [[-3, -2]],
      sleeping: [[-2, 0], [-2, -1]],
      N: [[-1, -2], [-1, -3]],
      NE: [[0, -2], [0, -3]],
      E: [[-3, 0], [-3, -1]],
      SE: [[-5, -1], [-5, -2]],
      S: [[-6, -3], [-7, -2]],
      SW: [[-5, -3], [-6, -1]],
      W: [[-4, -2], [-4, -3]],
      NW: [[-1, 0], [-1, -1]],
    };

    nekoEl.id = "oneko";
    nekoEl.setAttribute("aria-hidden", "true");
    Object.assign(nekoEl.style, {
      width: "32px",
      height: "32px",
      position: "fixed",
      pointerEvents: "auto",
      backgroundImage: `url(${JSON.stringify(spriteSrc)})`,
      cursor: "grab",
      imageRendering: "pixelated",
      filter: "var(--neko-outline, none)",
      left: `${nekoPosX - 16}px`,
      top: `${nekoPosY - 16}px`,
      touchAction: "none",
      zIndex: "40",
    });

    document.body.appendChild(nekoEl);

    const onMouseMove = (e: MouseEvent) => {
      mousePosX = e.clientX;
      mousePosY = e.clientY;
      // Remain draggable on the page, but let controls underneath receive clicks.
      const overControl = document.elementsFromPoint(e.clientX, e.clientY).some(element => element !== nekoEl && element.closest("a, button, input, textarea, select, [role='button']"));
      nekoEl.style.pointerEvents = isDragging || !overControl ? "auto" : "none";
    };
    document.addEventListener("mousemove", onMouseMove);

    function clampToViewport(x: number, y: number) {
      nekoPosX = Math.min(Math.max(16, x), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, y), window.innerHeight - 16);
      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragPointerId = e.pointerId;
      dragOffsetX = e.clientX - nekoPosX;
      dragOffsetY = e.clientY - nekoPosY;
      idleTime = 0;
      resetIdleAnimation();
      setSprite("alert", 0);
      nekoEl.style.cursor = "grabbing";
      nekoEl.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || e.pointerId !== dragPointerId) return;
      clampToViewport(e.clientX - dragOffsetX, e.clientY - dragOffsetY);
      mousePosX = nekoPosX;
      mousePosY = nekoPosY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging || e.pointerId !== dragPointerId) return;
      isDragging = false;
      dragPointerId = null;
      idleTime = 0;
      resetIdleAnimation();
      mousePosX = nekoPosX;
      mousePosY = nekoPosY;
      nekoEl.style.cursor = "grab";
      if (nekoEl.hasPointerCapture(e.pointerId)) {
        nekoEl.releasePointerCapture(e.pointerId);
      }
    };

    nekoEl.addEventListener("pointerdown", onPointerDown);
    nekoEl.addEventListener("pointermove", onPointerMove);
    nekoEl.addEventListener("pointerup", onPointerUp);
    nekoEl.addEventListener("pointercancel", onPointerUp);

    function setSprite(name: string, frame: number) {
      const set = spriteSets[name];
      const sprite = set[frame % set.length];
      nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    }

    function resetIdleAnimation() {
      idleAnimation = null;
      idleAnimationFrame = 0;
    }

    function leavePawPrint(x: number, y: number, direction: string) {
      const paw = document.createElement("div");
      const angleByDirection: Record<string, number> = {
        N: 0,
        NE: 35,
        E: 90,
        SE: 145,
        S: 180,
        SW: 215,
        W: 270,
        NW: 325,
      };
      const angle = angleByDirection[direction] ?? 0;

      Object.assign(paw.style, {
        position: "fixed",
        left: `${x - 6}px`,
        top: `${y + 9}px`,
        width: "12px",
        height: "12px",
        pointerEvents: "none",
        zIndex: "2",
        opacity: "0.16",
        transform: `rotate(${angle}deg) scale(1)`,
        transition: "opacity 1800ms ease-out, transform 1800ms ease-out",
      });

      [
        { left: 2, top: 1, width: 3, height: 3 },
        { left: 7, top: 1, width: 3, height: 3 },
        { left: 1, top: 5, width: 3, height: 3 },
        { left: 8, top: 5, width: 3, height: 3 },
        { left: 4, top: 7, width: 4, height: 4 },
      ].forEach((part) => {
        const dot = document.createElement("span");
        Object.assign(dot.style, {
          position: "absolute",
          left: `${part.left}px`,
          top: `${part.top}px`,
          width: `${part.width}px`,
          height: `${part.height}px`,
          borderRadius: "999px",
          background: "var(--paw-color, #201d18)",
        });
        paw.appendChild(dot);
      });

      pawPrints.add(paw);
      document.body.appendChild(paw);

      const fadeTimer = window.setTimeout(() => {
        pawTimers.delete(fadeTimer);
        paw.style.opacity = "0";
        paw.style.transform = `rotate(${angle}deg) scale(0.72)`;
      }, 80);

      const removeTimer = window.setTimeout(() => {
        pawTimers.delete(removeTimer);
        paw.remove();
        pawPrints.delete(paw);
      }, 1900);
      pawTimers.add(fadeTimer);
      pawTimers.add(removeTimer);
    }

    function idle() {
      idleTime += 1;

      if (idleTime > 100 && idleAnimation == null) {
        idleAnimation = "sleeping";
      }

      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation == null) {
        const options = ["sleeping", "scratchSelf"];
        if (nekoPosX < 32) options.push("scratchWallW");
        if (nekoPosY < 32) options.push("scratchWallN");
        if (nekoPosX > window.innerWidth - 32) options.push("scratchWallE");
        if (nekoPosY > window.innerHeight - 32) options.push("scratchWallS");
        idleAnimation = options[Math.floor(Math.random() * options.length)];
      }

      switch (idleAnimation) {
        case "sleeping":
          if (idleAnimationFrame < 8) {
            setSprite("tired", 0);
            break;
          }
          setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192) resetIdleAnimation();
          break;
        case "scratchWallN":
        case "scratchWallS":
        case "scratchWallE":
        case "scratchWallW":
        case "scratchSelf":
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) resetIdleAnimation();
          break;
        default:
          setSprite("idle", 0);
          return;
      }
      idleAnimationFrame += 1;
    }

    function frame() {
      frameCount += 1;
      if (isDragging) return;

      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      if (distance < nekoSpeed || distance < 48) {
        idle();
        return;
      }

      idleAnimation = null;
      idleAnimationFrame = 0;

      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 7);
        idleTime -= 1;
        return;
      }

      let direction = "";
      direction += diffY / distance > 0.5 ? "N" : "";
      direction += diffY / distance < -0.5 ? "S" : "";
      direction += diffX / distance > 0.5 ? "W" : "";
      direction += diffX / distance < -0.5 ? "E" : "";
      setSprite(direction, frameCount);

      nekoPosX -= (diffX / distance) * nekoSpeed;
      nekoPosY -= (diffY / distance) * nekoSpeed;
      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;

      if (frameCount % 6 === 0) {
        leavePawPrint(nekoPosX, nekoPosY, direction);
      }
    }

    let lastFrameTimestamp: number | undefined;
    let rafId: number;

    function onAnimationFrame(timestamp: number) {
      if (!nekoEl.isConnected) return;
      if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
      if (timestamp - lastFrameTimestamp > 100) {
        lastFrameTimestamp = timestamp;
        frame();
      }
      rafId = window.requestAnimationFrame(onAnimationFrame);
    }

    rafId = window.requestAnimationFrame(onAnimationFrame);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      nekoEl.removeEventListener("pointerdown", onPointerDown);
      nekoEl.removeEventListener("pointermove", onPointerMove);
      nekoEl.removeEventListener("pointerup", onPointerUp);
      nekoEl.removeEventListener("pointercancel", onPointerUp);
      window.cancelAnimationFrame(rafId);
      pawTimers.forEach(timer => window.clearTimeout(timer));
      pawTimers.clear();
      pawPrints.forEach((paw) => paw.remove());
      pawPrints.clear();
      nekoEl.remove();
    };
  }, [allowed, spriteSrc]);

  return null;
}
