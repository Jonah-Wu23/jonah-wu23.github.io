/**
 * ParticleField - Antigravity Particle Animation Engine
 * 
 * Production-ready, zero-dependency, vanilla JS particle simulation.
 * Replicates Google Antigravity-style floating particles with pointer repulsion,
 * momentum damping, edge wrapping, trailing effect, DPR scaling, and energy-saving hooks.
 * 
 * Specification compliant with §4.3.4 of Portfolio & Homepage PRD.
 */
(function (global) {
  'use strict';

  // Default configuration dictionary
  var DEFAULTS = {
    // Repulsion physics
    influenceRadiusDesktop: 140,
    influenceRadiusMobile: 100,
    mobileBreakpoint: 768,
    maxForce: 0.55,
    damping: 0.96,
    driftSpeedMax: 0.35,

    // Density and particle counts
    densityDivisor: 5000,
    maxParticlesDesktop: 700,
    maxParticlesMobile: 350,

    // Particle sizes (radius in px)
    minSize: 1.0,
    maxSize: 3.5,

    // Palette: 94% Ink + 6% Accent
    inkColor: '23, 21, 15', // rgb components for #17150F
    inkOpacityMin: 0.08,
    inkOpacityMax: 0.16,
    accentColor: '#F53D6B',
    accentOpacity: 0.20,
    accentRatio: 0.06,

    // Trail and background
    trailColor: 'rgba(244, 242, 237, 0.10)',
    backgroundColor: '#F4F2ED',

    // Display & performance
    maxDpr: 2,
    resizeDebounce: 150,

    // Accessibility override: undefined / 'auto' for media query, or boolean
    reducedMotion: 'auto'
  };

  /**
   * Parse hex, rgb, or rgba string into "r, g, b" string tuple
   */
  function parseToRgbTuple(colorStr, fallbackTuple) {
    if (!colorStr) return fallbackTuple;
    colorStr = String(colorStr).trim();

    if (colorStr.charAt(0) === '#') {
      var hex = colorStr.slice(1);
      if (hex.length === 3) {
        var r3 = parseInt(hex.charAt(0) + hex.charAt(0), 16);
        var g3 = parseInt(hex.charAt(1) + hex.charAt(1), 16);
        var b3 = parseInt(hex.charAt(2) + hex.charAt(2), 16);
        return r3 + ', ' + g3 + ', ' + b3;
      } else if (hex.length === 6) {
        var r6 = parseInt(hex.slice(0, 2), 16);
        var g6 = parseInt(hex.slice(2, 4), 16);
        var b6 = parseInt(hex.slice(4, 6), 16);
        return r6 + ', ' + g6 + ', ' + b6;
      }
    }

    var match = colorStr.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (match) {
      return match[1] + ', ' + match[2] + ', ' + match[3];
    }

    if (/^\d+\s*,\s*\d+\s*,\s*\d+$/.test(colorStr)) {
      return colorStr;
    }

    return fallbackTuple;
  }

  /**
   * Build rgba(r, g, b, a) string
   */
  function buildRgba(rgbTuple, alpha) {
    return 'rgba(' + rgbTuple + ', ' + alpha + ')';
  }

  /**
   * Debounce helper
   */
  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var ctx = this;
      var args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        fn.apply(ctx, args);
      }, delay);
    };
  }

  /**
   * ParticleEngine instance constructor
   */
  function ParticleEngine(canvas, userOptions) {
    var self = this;
    var opt = Object.assign({}, DEFAULTS, userOptions || {});

    // Allow user to supply single influenceRadius / maxParticles
    if (userOptions && userOptions.influenceRadius !== undefined) {
      opt.influenceRadiusDesktop = userOptions.influenceRadius;
      if (userOptions.influenceRadiusMobile === undefined) {
        opt.influenceRadiusMobile = Math.round(userOptions.influenceRadius * (100 / 140));
      }
    }
    if (userOptions && userOptions.maxParticles !== undefined) {
      opt.maxParticlesDesktop = userOptions.maxParticles;
      if (userOptions.maxParticlesMobile === undefined) {
        opt.maxParticlesMobile = Math.round(userOptions.maxParticles / 2);
      }
    }

    // Color tuples
    var inkRgb = parseToRgbTuple(opt.inkColor, '23, 21, 15');
    var accentRgb = parseToRgbTuple(opt.accentColor, '245, 61, 107');
    var accentRgbaString = buildRgba(accentRgb, opt.accentOpacity);

    // Canvas & 2D context
    var ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      // Fallback for context if alpha:false not supported
      ctx = canvas.getContext('2d');
    }

    var width = 0;
    var height = 0;
    var dpr = 1;

    // Fixed particle storage (zero allocations inside tick)
    var particles = [];
    var count = 0;

    // Pointer state
    var pointer = {
      x: -9999,
      y: -9999,
      active: false
    };

    // Lifecycle state
    var isRunning = false;
    var isDestroyed = false;
    var isManuallyPaused = false;
    var isDocumentVisible = (typeof document !== 'undefined' ? document.visibilityState !== 'hidden' : true);
    var isIntersecting = true;
    var rafId = null;

    // Media query for reduced motion
    var mediaQuery = (typeof window !== 'undefined' && window.matchMedia)
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    function isReducedMotionActive() {
      if (opt.reducedMotion === true) return true;
      if (opt.reducedMotion === false) return false;
      return mediaQuery ? mediaQuery.matches : false;
    }

    /**
     * Populate or resize particles array
     */
    function updateParticleCount() {
      var isMobile = (width <= opt.mobileBreakpoint || (typeof window !== 'undefined' && window.innerWidth <= opt.mobileBreakpoint));
      var cap = isMobile ? opt.maxParticlesMobile : opt.maxParticlesDesktop;
      var area = width * height;
      var targetCount = Math.min(Math.floor(area / opt.densityDivisor), cap);
      if (targetCount < 8) targetCount = Math.min(8, cap);

      count = targetCount;

      // Expand array if needed
      while (particles.length < count) {
        var isAccent = Math.random() < opt.accentRatio;
        var pColor;
        if (isAccent) {
          pColor = accentRgbaString;
        } else {
          var op = (opt.inkOpacityMin + Math.random() * (opt.inkOpacityMax - opt.inkOpacityMin)).toFixed(3);
          pColor = buildRgba(inkRgb, op);
        }

        var angle = Math.random() * Math.PI * 2;
        var speed = 0.08 + Math.random() * (opt.driftSpeedMax - 0.08);

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseVx: Math.cos(angle) * speed,
          baseVy: Math.sin(angle) * speed,
          size: opt.minSize + Math.random() * (opt.maxSize - opt.minSize),
          color: pColor,
          isAccent: isAccent
        });
      }

      // Constrain existing particles within new canvas bounds
      for (var i = 0; i < count; i++) {
        var p = particles[i];
        if (p.x > width) p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      }
    }

    /**
     * Synchronize canvas pixel resolution with DPR
     */
    function resize() {
      if (isDestroyed) return;

      var rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width || canvas.clientWidth || 300, 10);
      height = Math.max(rect.height || canvas.clientHeight || 150, 10);
      dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, opt.maxDpr);

      var physWidth = Math.round(width * dpr);
      var physHeight = Math.round(height * dpr);

      if (canvas.width !== physWidth || canvas.height !== physHeight) {
        canvas.width = physWidth;
        canvas.height = physHeight;
      }

      updateParticleCount();

      // Clean background fill upon resize
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = opt.backgroundColor;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      if (isReducedMotionActive()) {
        drawStaticFrame();
      }
    }

    var debouncedResize = debounce(resize, opt.resizeDebounce);

    /**
     * Pointer event listeners
     */
    var pointerTarget = canvas.parentElement || canvas;

    function onPointerMove(e) {
      if (isDestroyed) return;
      var rect = canvas.getBoundingClientRect();
      var px = e.clientX - rect.left;
      var py = e.clientY - rect.top;

      // Generous bounding check to smoothly catch entry/exit
      if (px >= -80 && px <= rect.width + 80 && py >= -80 && py <= rect.height + 80) {
        pointer.x = px;
        pointer.y = py;
        pointer.active = true;
      } else {
        pointer.active = false;
      }
    }

    function onPointerDown(e) {
      onPointerMove(e);
    }

    function onPointerUp() {
      // Keep tracking movement or disable if touch
    }

    function onPointerLeave() {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    }

    function onWindowPointerLeave(e) {
      if (!e.relatedTarget && !e.toElement) {
        onPointerLeave();
      }
    }

    /**
     * Physics update (zero object allocation)
     */
    function updatePhysics() {
      var isMobile = (width <= opt.mobileBreakpoint || (typeof window !== 'undefined' && window.innerWidth <= opt.mobileBreakpoint));
      var radius = isMobile ? opt.influenceRadiusMobile : opt.influenceRadiusDesktop;
      var radiusSq = radius * radius;
      var maxForce = opt.maxForce;
      var damping = opt.damping;
      var oneMinusDamping = 1 - damping;
      var pActive = pointer.active;
      var ptrX = pointer.x;
      var ptrY = pointer.y;

      for (var i = 0; i < count; i++) {
        var p = particles[i];

        // Pointer repulsion
        if (pActive) {
          var dx = p.x - ptrX;
          var dy = p.y - ptrY;
          var distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0.0001) {
            var dist = Math.sqrt(distSq);
            var force = ((radius - dist) / radius) * maxForce;
            var invDist = 1 / dist;
            p.vx += dx * invDist * force;
            p.vy += dy * invDist * force;
          }
        }

        // Damping toward intrinsic base drift velocity
        p.vx = p.vx * damping + p.baseVx * oneMinusDamping;
        p.vy = p.vy * damping + p.baseVy * oneMinusDamping;

        // Velocity clamping (max 8.0px/frame)
        var speedSq = p.vx * p.vx + p.vy * p.vy;
        if (speedSq > 64) {
          var scale = 8 / Math.sqrt(speedSq);
          p.vx *= scale;
          p.vy *= scale;
        }

        // Position integration
        p.x += p.vx;
        p.y += p.vy;

        // Toroidal boundary wrapping
        var margin = p.size * 2 + 4;
        if (p.x < -margin) {
          p.x = width + margin;
        } else if (p.x > width + margin) {
          p.x = -margin;
        }

        if (p.y < -margin) {
          p.y = height + margin;
        } else if (p.y > height + margin) {
          p.y = -margin;
        }
      }
    }

    /**
     * Render frame with trail overlay
     */
    function render() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Low-opacity background overlay creates smooth visual trail
      ctx.fillStyle = opt.trailColor;
      ctx.fillRect(0, 0, width, height);

      // Render particles
      for (var i = 0; i < count; i++) {
        var p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 6.283185307179586);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    }

    /**
     * Draw single static frame (for prefers-reduced-motion)
     */
    function drawStaticFrame() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = opt.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      for (var i = 0; i < count; i++) {
        var p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 6.283185307179586);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    }

    /**
     * Main animation loop
     */
    function tick() {
      if (!isRunning || isDestroyed) return;

      rafId = requestAnimationFrame(tick);
      updatePhysics();
      render();
    }

    /**
     * Determine whether animation loop should run
     */
    function updateRunningState() {
      if (isDestroyed) return;

      var reduced = isReducedMotionActive();
      var shouldRun = !reduced && isDocumentVisible && isIntersecting && !isManuallyPaused;

      if (shouldRun && !isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(tick);
      } else if (!shouldRun && isRunning) {
        isRunning = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (reduced) {
          drawStaticFrame();
        }
      }
    }

    // Visibility change handler (energy-saving)
    function onVisibilityChange() {
      if (isDestroyed) return;
      isDocumentVisible = (document.visibilityState !== 'hidden');
      updateRunningState();
    }

    // Reduced motion media query change handler
    function onMediaChange() {
      if (isDestroyed) return;
      updateRunningState();
      if (isReducedMotionActive()) {
        drawStaticFrame();
      }
    }

    // IntersectionObserver (pause when scrolled out of viewport)
    var observer = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      try {
        observer = new IntersectionObserver(function (entries) {
          if (isDestroyed) return;
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].target === pointerTarget || entries[i].target === canvas) {
              isIntersecting = entries[i].isIntersecting;
              updateRunningState();
              break;
            }
          }
        }, {
          root: null,
          rootMargin: '60px',
          threshold: 0
        });
        observer.observe(pointerTarget);
      } catch (e) {
        isIntersecting = true;
      }
    }

    // Wire DOM event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', debouncedResize, { passive: true });
      window.addEventListener('pointerleave', onWindowPointerLeave, { passive: true });
      document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

      if (pointerTarget) {
        pointerTarget.addEventListener('pointermove', onPointerMove, { passive: true });
        pointerTarget.addEventListener('pointerdown', onPointerDown, { passive: true });
        pointerTarget.addEventListener('pointerup', onPointerUp, { passive: true });
        pointerTarget.addEventListener('pointerleave', onPointerLeave, { passive: true });
        pointerTarget.addEventListener('pointercancel', onPointerLeave, { passive: true });
      }

      if (mediaQuery) {
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', onMediaChange);
        } else if (mediaQuery.addListener) {
          mediaQuery.addListener(onMediaChange);
        }
      }
    }

    // Initial setup
    resize();
    updateRunningState();
    if (isReducedMotionActive()) {
      drawStaticFrame();
    }

    // Instance public interface
    this.canvas = canvas;
    this.options = opt;

    this.destroy = function () {
      if (isDestroyed) return;
      isDestroyed = true;
      isRunning = false;

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', debouncedResize);
        window.removeEventListener('pointerleave', onWindowPointerLeave);
        document.removeEventListener('visibilitychange', onVisibilityChange);

        if (pointerTarget) {
          pointerTarget.removeEventListener('pointermove', onPointerMove);
          pointerTarget.removeEventListener('pointerdown', onPointerDown);
          pointerTarget.removeEventListener('pointerup', onPointerUp);
          pointerTarget.removeEventListener('pointerleave', onPointerLeave);
          pointerTarget.removeEventListener('pointercancel', onPointerLeave);
        }

        if (mediaQuery) {
          if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', onMediaChange);
          } else if (mediaQuery.removeListener) {
            mediaQuery.removeListener(onMediaChange);
          }
        }
      }

      particles = [];
      count = 0;
    };

    this.resize = function () {
      resize();
    };

    this.pause = function () {
      isManuallyPaused = true;
      updateRunningState();
    };

    this.resume = function () {
      isManuallyPaused = false;
      updateRunningState();
    };

    this.setReducedMotion = function (val) {
      opt.reducedMotion = val;
      updateRunningState();
      if (isReducedMotionActive()) {
        drawStaticFrame();
      }
    };

    this.getStats = function () {
      return {
        count: count,
        width: width,
        height: height,
        dpr: dpr,
        isRunning: isRunning,
        isReducedMotion: isReducedMotionActive(),
        isIntersecting: isIntersecting,
        isDocumentVisible: isDocumentVisible,
        pointer: {
          x: pointer.x,
          y: pointer.y,
          active: pointer.active
        }
      };
    };
  }

  // Registry of active ParticleEngine instances
  var instances = [];

  /**
   * Global ParticleField API
   */
  var ParticleField = {
    /**
     * Initialize particle animation on target canvas
     * @param {HTMLCanvasElement|string} canvas - Canvas element or CSS selector
     * @param {Object} [options] - Custom configuration overrides
     * @returns {ParticleEngine|null} Engine instance
     */
    init: function (canvas, options) {
      if (!canvas) {
        console.warn('[ParticleField] canvas element or selector is required.');
        return null;
      }

      if (typeof canvas === 'string') {
        canvas = document.querySelector(canvas);
      }

      if (!canvas || typeof canvas.getContext !== 'function') {
        console.warn('[ParticleField] Invalid canvas element passed to init().');
        return null;
      }

      // Destroy existing instance attached to this canvas if any
      for (var i = 0; i < instances.length; i++) {
        if (instances[i].canvas === canvas) {
          instances[i].destroy();
          instances.splice(i, 1);
          break;
        }
      }

      var engine = new ParticleEngine(canvas, options || {});
      instances.push(engine);
      return engine;
    },

    /**
     * Destroy active ParticleEngine instance(s)
     * @param {ParticleEngine|HTMLCanvasElement|string} [target] - Specific instance or canvas to destroy. If omitted, destroys all.
     */
    destroy: function (target) {
      if (target) {
        var targetCanvas = (typeof target === 'string') ? document.querySelector(target) : target;
        for (var i = 0; i < instances.length; i++) {
          if (instances[i] === target || instances[i].canvas === targetCanvas || instances[i].canvas === target) {
            instances[i].destroy();
            instances.splice(i, 1);
            break;
          }
        }
      } else {
        while (instances.length > 0) {
          var inst = instances.pop();
          if (inst && typeof inst.destroy === 'function') {
            inst.destroy();
          }
        }
      }
    },

    /**
     * Default parameters reference
     */
    DEFAULTS: DEFAULTS,

    /**
     * Active instances array (read-only inspection)
     */
    get instances() {
      return instances;
    }
  };

  // Expose as Global & UMD
  if (typeof window !== 'undefined') {
    window.ParticleField = ParticleField;
  }
  if (typeof global !== 'undefined') {
    global.ParticleField = ParticleField;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleField;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () { return ParticleField; });
  }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
