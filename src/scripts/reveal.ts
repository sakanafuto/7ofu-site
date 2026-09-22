// .reveal 要素の出現を IntersectionObserver で駆動する（adr/0008）。
// CSS 側は `html.js` が付いたときだけ初期非表示にするため、JS 無効時は常に表示される。
// prefers-reduced-motion は CSS 側で transition を切り常時表示にするため、ここでは分岐しない
// （observer を回しても見た目に影響しないが、無駄な監視を避けるため早期リターンする）。

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const elements = document.querySelectorAll<HTMLElement>('.reveal');

function markVisible(el: Element) {
  el.classList.add('is-in');
}

if (reduceMotion || !('IntersectionObserver' in window)) {
  elements.forEach(markVisible);
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          markVisible(entry.target);
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  );
  elements.forEach((el) => observer.observe(el));
}
