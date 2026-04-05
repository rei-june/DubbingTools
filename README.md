# DubbingTools

React app + automation tools for dubbing workflow. Deployed at https://rei-june.github.io/DubbingTools

## Tools

### Web App (React)
- **Character Tracker** - Track episode progress per character
- **Reaper Export** - Convert CSV to episode marker files with stats

### IMDB Automation (NEW!)
- **Google Sheets Script** - Process drama scripts → generate character appearances
- **Chrome Extension** - Auto-populate IMDB voice acting credits

## Quick Start - IMDB Automation

### 1. Google Sheets Setup
```bash
1. Open your Google Sheet
2. Extensions → Apps Script
3. Copy/paste: google-apps-script/Code.gs
4. Save → Refresh sheet
5. New menu appears: 🎬 IMDB Helper
```

### 2. Chrome Extension Setup
```bash
1. chrome://extensions/ → Developer mode ON
2. Load unpacked → Select extension/ folder
3. Pin extension
```

### 3. Weekly Workflow
```
Google Sheets:
  → 🎬 IMDB Helper → Run Complete Workflow
  → Fill actor names
  → Copy CSV

Chrome:
  → Extension icon → Paste CSV → Save
  → Go to IMDB edit page
  → Click "Fill Credits" button
  → Review → Submit
```

**Time saved**: 30-45 min → 5 min per week

## Documentation

- `/extension/README.md` - Chrome extension guide
- `/google-apps-script/README.md` - Sheets processing guide
- `/extension/FORM_STRUCTURE.md` - Technical IMDB form reference

## Dev (React App)

```bash
npm install
npm run dev
npm run deploy  # push to gh-pages
```

## Architecture

```
Drama Script (Sheets)
        ↓
Google Apps Script (process)
        ↓
Episode Tracker (Sheets)
        ↓
Chrome Extension (export)
        ↓
IMDB Form (populate)
        ↓
Manual Review & Submit
```

Built for English dubbing workflow.

