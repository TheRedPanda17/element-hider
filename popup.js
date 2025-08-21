document.addEventListener('DOMContentLoaded', function() {
  const domainInput = document.getElementById('domain');
  const selectorInput = document.getElementById('selector');
  const addRuleButton = document.getElementById('addRule');
  const rulesList = document.getElementById('rulesList');

  loadRules();
  populateCurrentDomain();

  addRuleButton.addEventListener('click', function() {
    const domain = domainInput.value.trim();
    const selector = selectorInput.value.trim();
    
    if (domain && selector) {
      addRule(domain, selector);
      selectorInput.value = '';
    }
  });

  function addRule(domain, selector) {
    chrome.storage.sync.get(['hideRules'], function(result) {
      const rules = result.hideRules || [];
      const newRule = { domain, selector, id: Date.now() };
      rules.push(newRule);
      
      chrome.storage.sync.set({ hideRules: rules }, function() {
        loadRules();
      });
    });
  }

  function loadRules() {
    chrome.storage.sync.get(['hideRules'], function(result) {
      const rules = result.hideRules || [];
      rulesList.innerHTML = '';
      
      rules.forEach(rule => {
        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule-item';
        ruleElement.innerHTML = `
          <div class="rule-info">
            <strong>${rule.domain}</strong><br>
            <code>${rule.selector}</code>
          </div>
          <button class="delete-btn" data-id="${rule.id}">Delete</button>
        `;
        rulesList.appendChild(ruleElement);
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const ruleId = parseInt(this.getAttribute('data-id'));
          deleteRule(ruleId);
        });
      });
    });
  }

  function deleteRule(ruleId) {
    chrome.storage.sync.get(['hideRules'], function(result) {
      const rules = result.hideRules || [];
      const updatedRules = rules.filter(rule => rule.id !== ruleId);
      
      chrome.storage.sync.set({ hideRules: updatedRules }, function() {
        loadRules();
      });
    });
  }

  function populateCurrentDomain() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0] && tabs[0].url) {
        try {
          const url = new URL(tabs[0].url);
          const hostname = url.hostname;
          
          if (hostname && !hostname.startsWith('chrome://') && !hostname.startsWith('chrome-extension://')) {
            const rootDomain = extractRootDomain(hostname);
            domainInput.value = rootDomain;
          }
        } catch (error) {
          console.log('Could not parse URL:', error);
        }
      }
    });
  }

  function extractRootDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length <= 2) {
      return hostname;
    }
    return parts.slice(-2).join('.');
  }
});