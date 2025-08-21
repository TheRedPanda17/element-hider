/**
 * Background script for Element Hider extension.
 * Manages dynamic content script registration based on hide rules.
 * Only injects content scripts on domains that have active hiding rules.
 */

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === "sync" && changes.hideRules) {
    const rules = changes.hideRules.newValue || [];
    await updateContentScriptRegistration(rules);
  }
});

chrome.runtime.onInstalled.addListener(initializeContentScripts);
chrome.runtime.onStartup.addListener(initializeContentScripts);

async function initializeContentScripts() {
  const result = await chrome.storage.sync.get(["hideRules"]);
  const rules = result.hideRules || [];
  await updateContentScriptRegistration(rules);
}

async function updateContentScriptRegistration(rules) {
  const uniqueDomains = [...new Set(rules.map((rule) => rule.domain))];

  try {
    const existingScripts =
      await chrome.scripting.getRegisteredContentScripts();

    if (existingScripts.length > 0) {
      await chrome.scripting.unregisterContentScripts();
    }

    if (uniqueDomains.length === 0) {
      return;
    }

    const matches = uniqueDomains.map((domain) => `*://${domain}/*`);

    await chrome.scripting.registerContentScripts([
      {
        id: "element-hider",
        matches: matches,
        js: ["content.js"],
        runAt: "document_end",
      },
    ]);
  } catch (error) {
    console.error("Error registering content scripts:", error);
  }
}
