import React, { useEffect, useRef } from "react";

/**
 * CosmicBackground
 * ============================================================================
 * PURPOSE
 * Draws an animated, monochrome cosmic-dust field on a full-screen canvas.
 * The effect is intentionally subtle: particles drift independently, a small
 * subset glows or creates a thin optical flare, and particles near the pointer
 * follow a soft, curved flow instead of rushing directly into the cursor.
 *
 * VISUAL FEATURES
 * - Three particle layers (deep, middle, near) with different visual scales.
 * - Independent ambient drift, gentle twinkle, and varied particle properties.
 * - A soft inward force plus a tangential force creates a loose pointer vortex.
 * - A lightweight perspective projection gives the field a sense of depth.
 * - Optional "glass card" interaction for elements marked:
 *       data-lens-card="true"
 * - Responsive particle counts and device-pixel-ratio limits.
 *
 * IMPORTANT MODEL NOTES
 * - Particle x/y and velocity are stored in canvas/CSS-pixel space.
 * - z is a normalized depth value, not a physical distance in 3D space.
 * - Perspective, lens distortion, glow, and flare are visual approximations.
 *   This component does not refract the actual pixels behind a glass card.
 *
 * PERFORMANCE / LIFECYCLE
 * - One requestAnimationFrame loop draws the scene.
 * - ResizeObserver is not required; window resize rebuilds the particle field.
 * - All event listeners, the MutationObserver, and the animation frame are
 *   cleaned up when the component unmounts.
 *
 * TUNING GUIDE
 * - Increase ATTRACTION_STRENGTH for a stronger pointer influence.
 * - Increase SWIRL_STRENGTH for more curved movement.
 * - Increase POINTER_RANGE to affect particles farther from the pointer.
 * - Reduce MAX_DPR if canvas rendering is expensive on high-resolution screens.
 */

const LENS_SELECTOR = '[data-lens-card="true"]';

const CONFIG = {
  // Canvas rendering: cap DPR to avoid excessively large backing buffers.
  MAX_DPR: 2,

  // Below this width, use fewer particles and a smaller pointer influence area.
  MOBILE_BREAKPOINT: 768,

  // Pointer interaction. These values are accelerations per animation frame,
  // not pixels per second. Small forces accumulate into smooth motion.
  POINTER_RANGE_DESKTOP: 210,
  POINTER_RANGE_MOBILE: 115,
  ATTRACTION_STRENGTH: 0.012,
  SWIRL_STRENGTH: 0.035,

  // Velocity is damped every frame. A value close to 1 preserves momentum;
  // lower values make particles stop sooner after a force is applied.
  VELOCITY_DAMPING: 0.998,

  // Protect against particles gaining unbounded speed near the pointer.
  MAX_SPEED_FAR: 0.8,
  MAX_SPEED_NEAR: 1.35,

  // Only a tiny extra alpha boost is allowed near the pointer. There is
  // deliberately no cursor-centered glow, so the pointer itself stays dark.
  POINTER_BRIGHTNESS_BOOST: 0.035,
  POINTER_BRIGHTNESS_RANGE: 150,

  // Glass-card edge response. A particle near a card edge receives less effect;
  // deeper inside the card, the simulated lens effect becomes stronger.
  LENS_EDGE_FADE_PX: 30,
  LENS_SHIFT_PX: 5,
};

const LAYER_CONFIG = {
  deep: {
    countDesktop: 170,
    countMobile: 70,
    sizeMin: 0.25,
    sizeMax: 0.85,
    alphaMin: 0.025,
    alphaMax: 0.13,
    initialSpeed: 0.12,
    movementMultiplierMin: 0.65,
    movementMultiplierMax: 1.1,
    glowChance: 0,
    flareChance: 0,
  },
  middle: {
    countDesktop: 75,
    countMobile: 30,
    sizeMin: 0.45,
    sizeMax: 1.5,
    alphaMin: 0.06,
    alphaMax: 0.25,
    initialSpeed: 0.22,
    movementMultiplierMin: 0.65,
    movementMultiplierMax: 1.1,
    glowChance: 0.09,
    flareChance: 0.025,
  },
  near: {
    countDesktop: 18,
    countMobile: 7,
    sizeMin: 0.9,
    sizeMax: 2.8,
    alphaMin: 0.025,
    alphaMax: 0.1,
    initialSpeed: 0.36,
    movementMultiplierMin: 0.65,
    movementMultiplierMax: 1.1,
    glowChance: 0.09,
    flareChance: 0.01,
  },
};

/**
 * Return a random value in [min, max).
 * Keeping this helper makes particle distributions easier to read and tune.
 */
const randomBetween = (min, max) => min + Math.random() * (max - min);

/**
 * Clamp a value to an inclusive interval.
 * Used for alpha and edge-response calculations to avoid invalid visual values.
 */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });

    // A canvas can be unavailable in unusual environments, such as server-side
    // rendering or a browser that cannot provide a 2D rendering context.
    if (!canvas || !ctx) return undefined;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let elapsed = 0;
    let lastFrameTime = 0;

    // The pointer begins inactive and off-screen. This prevents an artificial
    // force from being applied at (0, 0) before the first pointer movement.
    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    let particles = [];
    let lensRects = [];

    const isMobile = () => width < CONFIG.MOBILE_BREAKPOINT;

    /**
     * Cache the visible rectangles of glass-card elements.
     *
     * getBoundingClientRect() returns viewport coordinates, which match
     * MouseEvent.clientX/clientY and the canvas's CSS-pixel coordinate space.
     * Caching avoids querying layout for every particle on every frame.
     */
    const updateLensRects = () => {
      lensRects = Array.from(document.querySelectorAll(LENS_SELECTOR))
        .map((element) => element.getBoundingClientRect())
        .filter(
          (rect) =>
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.top < height &&
            rect.right > 0 &&
            rect.left < width,
        );
    };

    /**
     * Find whether a projected particle is inside a glass-card rectangle.
     *
     * edgeDistance is the shortest distance from the point to any card edge.
     * Dividing by LENS_EDGE_FADE_PX and clamping to [0, 1] creates a soft
     * transition: the effect is weak at an edge and stronger farther inside.
     *
     * dx/dy are small visual offsets from the card center. They simulate a
     * mild lens displacement; they do not alter the underlying page pixels.
     */
    const getLensEffect = (x, y) => {
      for (const rect of lensRects) {
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          const edgeDistance = Math.min(
            x - rect.left,
            rect.right - x,
            y - rect.top,
            rect.bottom - y,
          );

          const factor = clamp(edgeDistance / CONFIG.LENS_EDGE_FADE_PX, 0, 1);

          const normalizedX =
            (x - (rect.left + rect.width / 2)) / Math.max(rect.width / 2, 1);
          const normalizedY =
            (y - (rect.top + rect.height / 2)) / Math.max(rect.height / 2, 1);

          return {
            factor,
            dx: normalizedX * CONFIG.LENS_SHIFT_PX * factor,
            dy: normalizedY * CONFIG.LENS_SHIFT_PX * factor,
          };
        }
      }

      return null;
    };

    /**
     * Create one particle with its own physical-looking and visual properties.
     *
     * The size distribution uses random^1.7 rather than a plain random value.
     * This makes tiny particles more common while leaving a few larger ones
     * for visual variety. z is normalized depth: higher z means a nearer layer.
     */
    const createParticle = (layer) => {
      const config = LAYER_CONFIG[layer];
      const initialAngle = Math.random() * Math.PI * 2;
      const initialSpeed = Math.random() * config.initialSpeed;

      return {
        layer,

        // World position is stored in CSS pixels before perspective projection.
        x: Math.random() * width,
        y: Math.random() * height,

        // A normalized depth value used only for visual perspective.
        z: randomBetween(0.15, 1),

        // Initial velocity points in a random direction, with varied magnitude.
        vx: Math.cos(initialAngle) * initialSpeed,
        vy: Math.sin(initialAngle) * initialSpeed,

        // Skew the distribution toward small particles; a few larger grains
        // make the field feel less uniform and more like layered dust.
        size:
          config.sizeMin +
          Math.pow(Math.random(), 1.7) * (config.sizeMax - config.sizeMin),

        alpha: randomBetween(config.alphaMin, config.alphaMax),

        // Different particles move at different rates even within one layer.
        movementMultiplier: randomBetween(
          config.movementMultiplierMin,
          config.movementMultiplierMax,
        ),

        // phase offsets the particle's sine-wave motion so particles do not
        // oscillate together. driftRate changes the speed of that oscillation.
        phase: Math.random() * Math.PI * 2,
        driftAngle: initialAngle,
        driftRate: randomBetween(0.15, 0.95),
        twinkleSpeed: randomBetween(0.3, 1.8),

        // curl is a per-particle signed value. Positive and negative values
        // make particles bend in different directions around the pointer.
        curl: randomBetween(-1, 1),

        // Glow and flare are sparse visual traits, not properties of every dot.
        glow: Math.random() < config.glowChance,
        flare: Math.random() < config.flareChance,
      };
    };

    /**
     * Rebuild the field after a resize.
     *
     * Counts are intentionally fixed per viewport class rather than scaling
     * with every pixel of screen area. This keeps performance predictable.
     */
    const initializeParticles = () => {
      const mobile = isMobile();
      const countFor = (layer) =>
        mobile
          ? LAYER_CONFIG[layer].countMobile
          : LAYER_CONFIG[layer].countDesktop;

      particles = [
        ...Array.from({ length: countFor("deep") }, () =>
          createParticle("deep"),
        ),
        ...Array.from({ length: countFor("middle") }, () =>
          createParticle("middle"),
        ),
        ...Array.from({ length: countFor("near") }, () =>
          createParticle("near"),
        ),
      ];
    };

    /**
     * Resize the canvas backing buffer.
     *
     * CSS pixels define the coordinate system used by pointer events. The
     * backing buffer is multiplied by DPR for sharp rendering on high-density
     * displays; setTransform() maps drawing coordinates back to CSS pixels.
     * Capping DPR limits memory use and the number of pixels the GPU/CPU draws.
     */
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, CONFIG.MAX_DPR);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Every drawing command can now use ordinary CSS-pixel coordinates.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initializeParticles();
      updateLensRects();
    };

    /**
     * Convert a particle's stored world position to its visible screen point.
     *
     * perspective = 0.55 + z * 1.1 ranges from about 0.715 to 1.65:
     * - smaller factors pull distant particles toward the screen center;
     * - larger factors push nearer particles farther from the center.
     *
     * This is a 2D perspective illusion, not a full 3D camera projection.
     */
    const projectParticle = (particle) => {
      const perspective = 0.55 + particle.z * 1.1;

      return {
        x: width / 2 + (particle.x - width / 2) * perspective,
        y: height / 2 + (particle.y - height / 2) * perspective,
        perspective,
      };
    };

    /**
     * Apply a soft attraction and a curved, tangential component.
     *
     * dx/dy point from the particle's projected position toward the pointer.
     * dist is Euclidean distance: sqrt(dx² + dy²).
     *
     * proximity = 1 - dist/range is 1 near the pointer and 0 at the edge.
     * Squaring it makes the force fade smoothly toward the range boundary,
     * avoiding a hard "on/off" ring around the pointer.
     *
     * The inward force moves dust toward the pointer. The tangent vector
     * (-dy/dist, dx/dist) is perpendicular to the inward direction, so adding
     * a small signed amount bends the path into a loose vortex.
     *
     * Because position is perspective-projected for the distance calculation,
     * divide the force by the perspective factor before applying it to world
     * velocity. This keeps the perceived acceleration reasonably consistent
     * across depth layers.
     */
    const applyPointerField = (particle, projected) => {
      if (!pointer.active) return;

      const dx = pointer.x - projected.x;
      const dy = pointer.y - projected.y;
      const distance = Math.hypot(dx, dy);
      const range = isMobile()
        ? CONFIG.POINTER_RANGE_MOBILE
        : CONFIG.POINTER_RANGE_DESKTOP;

      // Skip points outside the field and avoid dividing by zero at the cursor.
      if (distance <= 1 || distance >= range) return;

      const proximity = 1 - distance / range;
      const influence = proximity * proximity;

      // Nearer particles respond slightly more strongly, but not dramatically.
      const depthWeight = 0.5 + particle.z;
      const inwardForce = CONFIG.ATTRACTION_STRENGTH * influence * depthWeight;

      // A tangent is a 90-degree rotation of the normalized inward vector.
      // particle.curl selects direction and magnitude for this particle.
      const tangentX = -dy / distance;
      const tangentY = dx / distance;
      const swirlForce =
        CONFIG.SWIRL_STRENGTH * particle.curl * influence * 0.25;

      const perspective = projected.perspective;

      particle.vx +=
        ((dx / distance) * inwardForce + tangentX * swirlForce) / perspective;
      particle.vy +=
        ((dy / distance) * inwardForce + tangentY * swirlForce) / perspective;
    };

    /**
     * Add a tiny, independent ambient drift to a particle.
     *
     * The drift angle changes slowly over time. Sine/cosine convert that angle
     * into horizontal and vertical components. A small acceleration is used
     * instead of directly setting velocity, so pointer forces and momentum
     * remain part of the same motion model.
     */
    const updateAmbientDrift = (particle, time) => {
      particle.driftAngle +=
        Math.sin(time * particle.driftRate + particle.phase) * 0.0015;

      particle.vx += Math.cos(particle.driftAngle) * 0.0018;
      particle.vy += Math.sin(particle.driftAngle) * 0.0018;
    };

    /**
     * Apply damping and cap the particle's speed.
     *
     * Multiplying velocity by a value close to 1 removes a small fraction of
     * momentum each frame. At 0.998, 99.8% of the velocity remains per frame;
     * the result is smooth inertia rather than abrupt stopping.
     *
     * The speed cap is applied to the vector's magnitude, not each axis:
     * speed = sqrt(vx² + vy²). If it exceeds the cap, both components are scaled
     * by maxSpeed/speed, preserving direction while reducing magnitude.
     */
    const stabilizeVelocity = (particle) => {
      particle.vx *= CONFIG.VELOCITY_DAMPING;
      particle.vy *= CONFIG.VELOCITY_DAMPING;

      const maxSpeed =
        particle.layer === "near"
          ? CONFIG.MAX_SPEED_NEAR
          : CONFIG.MAX_SPEED_FAR;

      const speed = Math.hypot(particle.vx, particle.vy);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        particle.vx *= scale;
        particle.vy *= scale;
      }
    };

    /**
     * Move the particle and wrap it around screen edges.
     *
     * Wrapping teleports a particle to the opposite edge after it leaves the
     * padded viewport. This avoids particles piling up at boundaries and
     * keeps the background field continuous without creating new objects.
     */
    const moveParticle = (particle) => {
      particle.x += particle.vx * particle.movementMultiplier;
      particle.y += particle.vy * particle.movementMultiplier;

      const padding = 24;

      if (particle.x < -padding) particle.x = width + padding;
      if (particle.x > width + padding) particle.x = -padding;
      if (particle.y < -padding) particle.y = height + padding;
      if (particle.y > height + padding) particle.y = -padding;
    };

    /**
     * Draw a circular white particle, optionally with a restrained halo.
     *
     * globalAlpha controls opacity for the current draw operation. shadowBlur
     * is enabled only for selected glowing particles because broad shadow use
     * can be expensive on a large animated canvas.
     */
    const drawParticle = (x, y, size, alpha, glow = false) => {
      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.fillStyle = "#fff";

      if (glow) {
        ctx.shadowColor = "rgba(255,255,255,0.7)";
        ctx.shadowBlur = 6;
      }

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Reset shadow state immediately; canvas context state persists between
      // drawing commands unless explicitly reset.
      ctx.shadowBlur = 0;
    };

    /**
     * Draw a fine four-point optical flare for a rare bright particle.
     *
     * The horizontal and vertical strokes are intentionally thin and short.
     * A radial gradient adds a faint halo that fades to transparent. The
     * save/restore pair isolates alpha and stroke settings from other drawing.
     */
    const drawFlare = (x, y, size, alpha) => {
      ctx.save();
      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 0.5;

      const armLength = size * 5;

      ctx.beginPath();
      ctx.moveTo(x - armLength, y);
      ctx.lineTo(x + armLength, y);
      ctx.moveTo(x, y - armLength);
      ctx.lineTo(x, y + armLength);
      ctx.stroke();

      const haloRadius = size * 5;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, haloRadius);
      gradient.addColorStop(0, "rgba(255,255,255,0.2)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    /**
     * Draw one frame of the scene.
     *
     * deltaFactor normalizes updates to roughly a 60 Hz reference frame.
     * It prevents motion from running much faster on a high-refresh display.
     * A maximum of 2 limits sudden jumps after a long pause or a background tab.
     */
    const render = (timestamp = 0) => {
      const rawDelta = lastFrameTime ? (timestamp - lastFrameTime) / 16.667 : 1;
      const deltaFactor = clamp(rawDelta, 0, 2);
      lastFrameTime = timestamp;
      elapsed += deltaFactor * 0.016;

      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        // 1) Add independent ambient movement.
        updateAmbientDrift(particle, elapsed);

        // 2) Project once for pointer-distance calculations.
        const projectedBeforeMove = projectParticle(particle);

        // 3) Apply the pointer field using the visible (projected) position.
        applyPointerField(particle, projectedBeforeMove);

        // 4) Dampen/cap velocity, then integrate position exactly once.
        stabilizeVelocity(particle);
        moveParticle(particle);

        // 5) Project the updated position for drawing.
        const projected = projectParticle(particle);
        let x = projected.x;
        let y = projected.y;
        let size = particle.size * projected.perspective;

        // Twinkle oscillates opacity between 82% and 100% of base alpha.
        // phase offsets each particle, avoiding synchronized blinking.
        const twinkle =
          0.82 +
          0.18 * Math.sin(elapsed * particle.twinkleSpeed + particle.phase);

        let alpha = particle.alpha * twinkle;

        // 6) Simulate a mild glass-card lens response.
        const lens = getLensEffect(x, y);

        if (lens) {
          x += lens.dx;
          y += lens.dy;
          size *= 1 + lens.factor * 0.45;
          alpha += (0.42 - alpha) * lens.factor;
        }

        // 7) Very small brightness change near the pointer. No cursor glow is
        // drawn, and the boost is intentionally too small to wash out the scene.
        if (pointer.active) {
          const pointerDistance = Math.hypot(pointer.x - x, pointer.y - y);
          const influence = Math.max(
            0,
            1 - pointerDistance / CONFIG.POINTER_BRIGHTNESS_RANGE,
          );
          alpha += influence * CONFIG.POINTER_BRIGHTNESS_BOOST;
        }

        // Keep all particle opacity within a controlled visual range.
        alpha = clamp(alpha, 0, lens ? 0.62 : 0.42);

        // Near-layer particles use a radial gradient for soft depth. The center
        // remains the brightest point and fades smoothly to transparent.
        if (particle.layer === "near") {
          const radius = size * 2.6;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

          gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
          gradient.addColorStop(0.3, `rgba(255,255,255,${alpha * 0.35})`);
          gradient.addColorStop(1, "rgba(255,255,255,0)");

          ctx.globalAlpha = 1;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawParticle(x, y, size, alpha, particle.glow && alpha > 0.12);
        }

        // A flare is drawn only for rare, sufficiently visible particles.
        // This keeps the background cinematic instead of making every dot glow.
        if (
          particle.flare &&
          alpha > 0.14 &&
          (particle.z > 0.65 || (lens && lens.factor > 0.45))
        ) {
          drawFlare(x, y, Math.max(size, 0.8), Math.min(0.12, alpha * 0.3));
        }
      }

      // Do not leave an altered alpha value for the next frame.
      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(render);
    };

    /**
     * Pointer events use client coordinates, which share the canvas's CSS-pixel
     * coordinate system. The pointer only changes the force field; it does not
     * create a visible circle or spotlight.
     */
    const onPointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onScroll = () => updateLensRects();

    // Set up dimensions and particles before the first animation frame.
    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    // Cards may be added, removed, or receive the lens attribute dynamically.
    // Rebuild the rectangle cache when relevant DOM changes occur.
    const lensObserver = new MutationObserver(updateLensRects);
    lensObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-lens-card"],
    });

    rafId = window.requestAnimationFrame(render);

    // Cleanup prevents duplicate loops/listeners if React unmounts this effect
    // or remounts the component during development's Strict Mode checks.
    return () => {
      window.cancelAnimationFrame(rafId);
      lensObserver.disconnect();

      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}