function applyHideRules() {
  chrome.storage.sync.get(['hideRules'], function(result) {
    const rules = result.hideRules || [];
    const currentDomain = window.location.hostname;
    
    
    // Only proceed if we have rules for this domain (match with or without www)
    const domainRules = rules.filter(rule => {
      const ruleDomain = rule.domain.replace(/^www\./, '');
      const currentDomainClean = currentDomain.replace(/^www\./, '');
      return ruleDomain === currentDomainClean || rule.domain === currentDomain;
    });
    if (domainRules.length === 0) {
      return;
    }
    
    document.querySelectorAll('[data-element-hider="hidden"]').forEach(el => {
      el.style.display = '';
      el.removeAttribute('data-element-hider');
    });
    
    domainRules.forEach(rule => {
      const elements = document.querySelectorAll(rule.selector);
      
      elements.forEach((element, index) => {
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('height', '0', 'important');
        element.style.setProperty('width', '0', 'important');
        element.style.setProperty('overflow', 'hidden', 'important');
        element.setAttribute('data-element-hider', 'hidden');
      });
      
    });
  });
}

function waitAndApply() {
  applyHideRules();
  setTimeout(applyHideRules, 1000);
  setTimeout(applyHideRules, 3000);
}

waitAndApply();

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.hideRules) {
    waitAndApply();
  }
});