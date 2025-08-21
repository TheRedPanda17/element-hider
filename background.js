chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'sync' && changes.hideRules) {
    const rules = changes.hideRules.newValue || [];
    await updateContentScriptRegistration(rules);
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get(['hideRules']);
  const rules = result.hideRules || [];
  await updateContentScriptRegistration(rules);
});

chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.sync.get(['hideRules']);
  const rules = result.hideRules || [];
  await updateContentScriptRegistration(rules);
});

async function updateContentScriptRegistration(rules) {
  const uniqueDomains = [...new Set(rules.map(rule => rule.domain))];
  
  try {
    const existingScripts = await chrome.scripting.getRegisteredContentScripts();
    
    if (existingScripts.length > 0) {
      await chrome.scripting.unregisterContentScripts();
    }
    
    if (uniqueDomains.length > 0) {
      const matches = uniqueDomains.map(domain => `*://${domain}/*`);
      
      await chrome.scripting.registerContentScripts([{
        id: "element-hider",
        matches: matches,
        js: ["content.js"],
        runAt: "document_end"
      }]);
    } else {
    }
  } catch (error) {
    // Silently handle content script registration errors
  }
}