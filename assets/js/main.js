(function () {
  'use strict';

  // 1. Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Active Nav Link on Scroll
  const navLinks = document.querySelectorAll('.nav-item a');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              const href = link.getAttribute('href');
              if (href === '#' + id) {
                link.classList.add('is-active');
              } else {
                link.classList.remove('is-active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  // 3. Project row click handling: clicking non-link areas of project row opens primary link if available
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const primaryLink = item.querySelector('.project-actions a');
      if (primaryLink) {
        const href = primaryLink.getAttribute('href');
        const target = primaryLink.getAttribute('target') || '_self';
        window.open(href, target);
      }
    });
  });

})();