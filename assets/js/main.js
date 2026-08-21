/**
 * main.js - 页面交互脚本
 * 负责：粒子引擎初始化、滚动显现交错动画、锚点平滑滚动、导航高亮与页脚年份更新
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. 初始化 Antigravity 粒子背景
  initParticleField();

  // 2. 滚动渐显与同级元素错峰动画 (IntersectionObserver)
  initScrollReveal();

  // 3. 锚点平滑滚动与导航高亮监听
  initNavigation();

  // 4. 页脚版权年份自动更新
  initFooterYear();
});

/**
 * 初始化 Hero 区域粒子力场
 */
function initParticleField() {
  const canvas = document.getElementById('particle-hero');
  if (!canvas) return;

  const launchParticles = () => {
    if (window.ParticleField && typeof window.ParticleField.init === 'function') {
      window.ParticleField.init(canvas, {
        accentColor: '#F53D6B',
        influenceRadiusDesktop: 140,
        influenceRadiusMobile: 100,
        maxForce: 0.55,
        damping: 0.96,
        driftSpeedMax: 0.35,
        trailColor: 'rgba(244, 242, 237, 0.10)'
      });
    }
  };

  if (window.ParticleField) {
    launchParticles();
  } else {
    // 兼容异步加载粒子脚本情况
    window.addEventListener('load', launchParticles, { once: true });
  }
}

/**
 * 元素进入视口时的交错渐显动画
 * 同级 .reveal 元素按序递增 60ms 延迟
 */
function initScrollReveal() {
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  if (revealElements.length === 0) return;

  // 按父容器对元素分组，实现同级元素错峰出现
  const parentMap = new Map();
  revealElements.forEach((el) => {
    const parent = el.parentElement || document.body;
    if (!parentMap.has(parent)) {
      parentMap.set(parent, []);
    }
    parentMap.get(parent).push(el);
  });

  parentMap.forEach((children) => {
    children.forEach((el, index) => {
      el.style.transitionDelay = `${index * 60}ms`;
    });
  });

  if (!('IntersectionObserver' in window)) {
    // 降级支持：不支持 IntersectionObserver 时直接全部显示
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  });

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * 锚点平滑滚动与滚动导航联动高亮
 */
function initNavigation() {
  const navLinks = Array.from(document.querySelectorAll('.nav-pill a'));
  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));

  // 点击锚点平滑滚动
  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      if (href === '#portfolio') {
        // 作品集占位符，不拦截默认行为或阻止页面跳回顶部
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        if (history.pushState) {
          history.pushState(null, '', href);
        }
      }
    });
  });

  // 视口滚动监听导航当前区块
  const trackedSections = [
    document.getElementById('hero'),
    document.getElementById('projects'),
    document.getElementById('opensource'),
    document.getElementById('contact')
  ].filter(Boolean);

  if (trackedSections.length === 0 || !('IntersectionObserver' in window)) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -40% 0px',
    threshold: 0.15
  });

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

/**
 * 自动填充当前版权年份
 */
function initFooterYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
}
