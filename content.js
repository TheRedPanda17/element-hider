function applyHideRules() {
  chrome.storage.sync.get(['hideRules'], function(result) {
    const rules = result.hideRules || [];
    const currentDomain = window.location.hostname;
    
    console.log('Element Hider: Applying rules for', currentDomain);
    console.log('Element Hider: Rules:', rules);
    
    // Only proceed if we have rules for this domain (match with or without www)
    const domainRules = rules.filter(rule => {
      const ruleDomain = rule.domain.replace(/^www\./, '');
      const currentDomainClean = currentDomain.replace(/^www\./, '');
      return ruleDomain === currentDomainClean || rule.domain === currentDomain;
    });
    if (domainRules.length === 0) {
      console.log('Element Hider: No rules for this domain, skipping');
      return;
    }
    
    document.querySelectorAll('[data-element-hider="hidden"]').forEach(el => {
      el.style.display = '';
      el.removeAttribute('data-element-hider');
    });
    
    domainRules.forEach(rule => {
      console.log('Element Hider: Looking for selector:', rule.selector);
      const elements = document.querySelectorAll(rule.selector);
      console.log(`Element Hider: Found ${elements.length} elements`);
      
      elements.forEach((element, index) => {
        console.log(`Element Hider: Hiding element ${index + 1}:`, element);
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('height', '0', 'important');
        element.style.setProperty('width', '0', 'important');
        element.style.setProperty('overflow', 'hidden', 'important');
        element.setAttribute('data-element-hider', 'hidden');
      });
      
      if (elements.length === 0) {
        console.log('Element Hider: No elements found for selector:', rule.selector);
      }
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