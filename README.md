# Element Hider Chrome Extension

A Chrome extension that allows you to hide specific HTML elements on websites using CSS selectors.

## Demo

![Element Hider Demo](demo.gif)

## How to Use

### Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The Element Hider icon will appear in your toolbar

### Adding Hide Rules

1. Navigate to a website where you want to hide elements
2. Click the Element Hider icon in your toolbar
3. The domain field will auto-populate with the current site
4. Enter a CSS selector for the element you want to hide (e.g., `.ad-banner`, `#sidebar`)
5. Click "Add Rule"

### Managing Rules

- View all your rules in the popup
- Delete rules using the "Delete" button next to each rule
- Rules sync across all your Chrome browsers via Chrome sync

### CSS Selector Examples

- `.classname` - Hide elements with specific class
- `#idname` - Hide element with specific ID
- `div[data-ad]` - Hide divs with data-ad attribute
- `.header .annoying-popup` - Hide nested elements

## How It Works

The extension consists of 4 main components:

### Background Script (`background.js`)

- Manages dynamic content script registration
- Only injects content scripts on domains with active rules
- Listens for rule changes and updates registrations

### Content Script (`content.js`)

- Runs on web pages to apply hiding rules
- Uses aggressive CSS hiding with `!important` flags
- Applies rules multiple times to catch dynamic content

### Popup Interface (`popup.js`, `popup.html`, `popup.css`)

- Provides UI for adding/deleting rules
- Auto-populates current tab's domain
- Manages Chrome sync storage

### Manifest (`manifest.json`)

- Chrome extension configuration
- Defines permissions and entry points

## Development

### Making Changes

#### Modifying Hide Logic

Edit `content.js` to change how elements are hidden. Current implementation uses multiple CSS properties with `!important` for aggressive hiding.

#### Changing UI

- Edit `popup.html` for structure
- Edit `popup.css` for styling
- Edit `popup.js` for functionality

#### Background Logic

Edit `background.js` to change how content scripts are registered or respond to different events.

### Testing

1. Make your changes
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Element Hider extension
4. Test your changes

### Debugging

- Background script: `chrome://extensions/` → Element Hider → "service worker" link
- Content script: Open DevTools on any webpage, check Console
- Popup: Right-click extension icon → "Inspect popup"

## Browser Permissions

The extension requires:

- `storage` - To save hide rules
- `activeTab` - To get current tab's domain
- `<all_urls>` - To inject content scripts on any website

## Storage

Rules are stored in Chrome sync storage as:

```javascript
{
  hideRules: [
    {
      domain: "example.com",
      selector: ".ad-banner",
      id: 1629123456789,
    },
  ];
}
```
