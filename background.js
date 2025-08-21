chrome.storage.onChanged.addListener(async (changes, namespace) => {
  console.log('Background: Storage changed', changes, namespace);
  if (namespace === 'sync' && changes.hideRules) {
    const rules = changes.hideRules.newValue || [];
    console.log('Background: Updating content script registration for rules:', rules);
    await updateContentScriptRegistration(rules);
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  console.log('Background: Extension installed/updated');
  const result = await chrome.storage.sync.get(['hideRules']);
  const rules = result.hideRules || [];
  console.log('Background: Initial rules:', rules);
  await updateContentScriptRegistration(rules);
});

chrome.runtime.onStartup.addListener(async () => {
  console.log('Background: Browser startup');
  const result = await chrome.storage.sync.get(['hideRules']);
  const rules = result.hideRules || [];
  await updateContentScriptRegistration(rules);
});

async function updateContentScriptRegistration(rules) {
  const uniqueDomains = [...new Set(rules.map(rule => rule.domain))];
  console.log('Background: Unique domains:', uniqueDomains);
  
  try {
    const existingScripts = await chrome.scripting.getRegisteredContentScripts();
    console.log('Background: Existing scripts:', existingScripts);
    
    if (existingScripts.length > 0) {
      await chrome.scripting.unregisterContentScripts();
      console.log('Background: Unregistered existing scripts');
    }
    
    if (uniqueDomains.length > 0) {
      const matches = uniqueDomains.map(domain => `*://${domain}/*`);
      console.log('Background: Registering for matches:', matches);
      
      await chrome.scripting.registerContentScripts([{
        id: "element-hider",
        matches: matches,
        js: ["content.js"],
        runAt: "document_end"
      }]);
      console.log('Background: Content scripts registered successfully');
    } else {
      console.log('Background: No domains to register');
    }
  } catch (error) {
    console.error('Background: Error updating content script registration:', error);
  }
}