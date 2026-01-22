# Keyboard Shortcuts Guide

**Last Updated**: January 22, 2026  
**Scope**: OpenRisk v1.0.4+  

---

## Table of Contents

1. [Global Shortcuts](#global-shortcuts)
2. [Search & Navigation](#search--navigation)
3. [Risk Management](#risk-management)
4. [Tips & Tricks](#tips--tricks)
5. [Platform-Specific Notes](#platform-specific-notes)
6. [Troubleshooting](#troubleshooting)
7. [Planned Shortcuts](#planned-shortcuts)

---

## Global Shortcuts

These shortcuts work from any page or view in OpenRisk:

| Shortcut | Mac Alternative | Action | Notes |
|----------|-----------------|--------|-------|
| <kbd>Ctrl+K</kbd> | <kbd>⌘K</kbd> | **Open global search** | Works from anywhere; great for quick risk lookups |
| <kbd>Ctrl+N</kbd> | <kbd>⌘N</kbd> | **Create new risk** | Available on Dashboard and Risks page |
| <kbd>Esc</kbd> | <kbd>Esc</kbd> | **Close modal/dialog** | Closes any open modal without saving |

### Details

#### ⌨️ Ctrl+K / ⌘K - Global Search
- **Function**: Opens the global search bar
- **Availability**: All pages
- **Use Case**: Quickly find risks by title, ID, or asset name
- **Tips**:
  - Start typing immediately after pressing the shortcut
  - Results update in real-time
  - Use arrow keys to navigate results

**Example Workflow**:
```
1. Press Ctrl+K
2. Type "critical database" 
3. Press Enter or click result to open risk details
```

#### ⌨️ Ctrl+N / ⌘N - Create New Risk
- **Function**: Opens the "Create New Risk" modal
- **Availability**: Dashboard, Risks page
- **Use Case**: Quickly create and log new risks
- **Tips**:
  - Pre-fills with default values
  - Tab through fields for fast data entry
  - Press Escape to discard without saving

**Example Workflow**:
```
1. Press Ctrl+N
2. Fill in risk details (title, impact, probability)
3. Assign assets and frameworks
4. Submit to create risk
```

#### ⌨️ Esc - Close Dialog
- **Function**: Closes any open modal/dialog/drawer
- **Availability**: When any modal is open
- **Use Case**: Quickly exit without saving changes
- **Notes**: Does NOT delete your draft - returns to previous state

---

## Search & Navigation

These shortcuts are available **within search results or suggestions**:

| Shortcut | Action | Context |
|----------|--------|---------|
| <kbd>↑</kbd> Arrow Up | Previous result | Search suggestions open |
| <kbd>↓</kbd> Arrow Down | Next result | Search suggestions open |
| <kbd>Enter</kbd> | Select highlighted result | Any result highlighted |
| <kbd>Esc</kbd> | Close search dropdown | Search suggestions visible |
| <kbd>Backspace</kbd> | Delete last character | In search input |
| <kbd>Ctrl+A</kbd> / <kbd>⌘A</kbd> | Select all search text | In search input |

### Search Result Navigation

After opening search with <kbd>Ctrl+K</kbd>, you can navigate results:

**Step 1**: Press <kbd>Ctrl+K</kbd> to open search
```
┌─────────────────────────────────────┐
│ 🔍 Search risks, assets...          │
└─────────────────────────────────────┘
```

**Step 2**: Type your query
```
┌─────────────────────────────────────┐
│ 🔍 database vulnerability           │
├─────────────────────────────────────┤
│ → DB001: Database Injection Flaw     │  ← Highlighted (use ↓ to next)
│   DB002: Outdated SQL Server         │
│   DB003: Missing Backups             │
└─────────────────────────────────────┘
```

**Step 3**: Navigate with arrows, press <kbd>Enter</kbd>
```
Pressing ↓ moves to DB002, press Enter to open it
```

---

## Risk Management

These shortcuts are available on **risk-related pages**:

| Shortcut | Action | Context |
|----------|--------|---------|
| <kbd>Esc</kbd> | Close risk details panel | Risk details open |
| <kbd>Esc</kbd> | Close edit modal | Risk editing modal open |
| <kbd>Enter</kbd> (in form) | Submit form | Create/Edit Risk modal open |

### Risk Details Navigation

When viewing risk details:

- **Close Panel**: Press <kbd>Esc</kbd> to return to risks list
- **Edit Risk**: Click "Edit" button or use Edit button in modal
- **Delete Risk**: Use the delete option (no keyboard shortcut yet)

### Editing Risks

Within the Edit Risk modal:

- **Navigate Fields**: <kbd>Tab</kbd> to move to next field, <kbd>Shift+Tab</kbd> to previous
- **Submit Changes**: <kbd>Ctrl+Enter</kbd> or click "Save"
- **Discard Changes**: <kbd>Esc</kbd> key
- **Toggle Checkboxes**: <kbd>Space</kbd> to toggle selected checkbox

---

## Tips & Tricks

### Power User Workflow

**Scenario**: You need to quickly add three critical risks to your dashboard.

```
1. Press Ctrl+K
2. Look for existing critical risks to understand priority levels
3. Press Esc to close search
4. Press Ctrl+N to create first new risk
5. Fill details (Tab to navigate fields quickly)
6. Submit with Ctrl+Enter
7. Repeat steps 4-6 for additional risks
```

### Search Tips

| Tip | Description |
|-----|-------------|
| **Partial Matches** | Search for "data" finds "Database Injection", "Data Loss", etc. |
| **ID Search** | Search by risk ID (e.g., "RISK-123") for direct access |
| **Asset Search** | Search by asset name to find all related risks |
| **Case Insensitive** | Searches work regardless of upper/lowercase |

### Modal Tips

| Tip | Description |
|-----|-------------|
| **Tab Navigation** | Use Tab to move between form fields without mouse |
| **Escape = No Save** | Pressing Esc discards changes, returns to previous state |
| **Quick Submit** | Hold Ctrl and press Enter to save and close modal |
| **Field Jumping** | Shift+Tab moves backward through fields |

---

## Platform-Specific Notes

### Windows

- **Modifier Key**: Use <kbd>Ctrl</kbd> (not Command)
- **Example**: <kbd>Ctrl+K</kbd> for search
- **Works With**: Chrome, Firefox, Edge, Brave

### macOS

- **Modifier Key**: Use <kbd>⌘</kbd> (Command) key
- **Example**: <kbd>⌘K</kbd> for search
- **Alternative**: <kbd>Ctrl</kbd> also works with Chrome/Firefox
- **Works With**: Chrome, Safari, Firefox, Brave

### Linux

- **Modifier Key**: Use <kbd>Ctrl</kbd>
- **Example**: <kbd>Ctrl+K</kbd> for search
- **Works With**: Chrome, Firefox, Brave, Chromium

### Mobile / Tablet

- **Status**: Most shortcuts not available on mobile
- **Alternative**: Use on-screen buttons and touch gestures
- **Future**: Mobile shortcuts planned for v1.1

---

## Troubleshooting

### Shortcut Not Working?

| Issue | Solution |
|-------|----------|
| <kbd>Ctrl+K</kbd> not opening search | Verify you're focused on the main window (not in an iframe) |
| <kbd>Ctrl+N</kbd> not creating risk | Check that you're on Dashboard or Risks page |
| Arrow keys not navigating search | Click in the search box first to ensure focus |
| <kbd>Esc</kbd> not closing modal | Modal may not have keyboard support; use close button |

### Browser Conflicts

Some browser extensions may intercept shortcuts. Try:

1. Disable browser extensions temporarily
2. Clear browser cache and cookies
3. Try in an incognito/private window
4. Use a different browser

### Accessibility

If shortcuts don't work with your accessibility tool:

1. Enable **Focus Mode** in Settings
2. Use **Tab Navigation** to navigate UI elements
3. Use **Screen Reader** features
4. All functionality available via mouse/touch

---

## Planned Shortcuts

The following shortcuts are planned for future releases:

| Shortcut | Action | Status | Target Release |
|----------|--------|--------|-----------------|
| <kbd>Ctrl+E</kbd> / <kbd>⌘E</kbd> | Edit last viewed risk | Planned | v1.1 |
| <kbd>Ctrl+F</kbd> / <kbd>⌘F</kbd> | Advanced filter | Planned | v1.1 |
| <kbd>Ctrl+D</kbd> / <kbd>⌘D</kbd> | Delete selected | Planned | v1.1 |
| <kbd>/</kbd> | Focus search | Planned | v1.1 |
| <kbd>Ctrl+,</kbd> / <kbd>⌘,</kbd> | Open settings | Planned | v1.1 |
| <kbd>Ctrl+?</kbd> / <kbd>⌘?</kbd> | Help menu | Planned | v1.2 |
| <kbd>Ctrl+Shift+E</kbd> | Export risks | Planned | v1.2 |
| <kbd>Ctrl+L</kbd> / <kbd>⌘L</kbd> | Select location bar | Planned | v1.2 |

### Request a Shortcut

Have a shortcut request? [Open a GitHub issue](https://github.com/opendefender/OpenRisk/issues/new) with:

```
Title: Feature Request: Keyboard Shortcut for [Feature]
Body:
- Current workaround: [describe]
- Proposed shortcut: [suggest]
- Use case: [describe when you'd use it]
```

---

## Summary

### Quick Reference Card

```
╔════════════════════════════════════════════════════════════╗
║           OpenRisk Keyboard Shortcuts Summary               ║
╠════════════════════════════════════════════════════════════╣
║ Ctrl+K / ⌘K   →  Global Search                             ║
║ Ctrl+N / ⌘N   →  Create New Risk                           ║
║ Esc           →  Close Modal/Dialog                        ║
║                                                             ║
║ ↑ / ↓ Arrows  →  Navigate Search Results (in search)       ║
║ Enter         →  Select Highlighted Result                 ║
║ Tab / Shift+Tab → Navigate Form Fields                     ║
║                                                             ║
║ For more info: See KEYBOARD_SHORTCUTS.md                   ║
╚════════════════════════════════════════════════════════════╝
```

---

## Support

- **Found a bug?** [Report it on GitHub](https://github.com/opendefender/OpenRisk/issues)
- **Have a feature request?** [Discuss it in GitHub Discussions](https://github.com/opendefender/OpenRisk/discussions)
- **Need help?** Check [FAQ](./FAQ.md) or [docs](./README.md)

---

**Last Updated**: January 22, 2026  
**Document Version**: 1.0  
**OpenRisk Version**: 1.0.4+
