# DubbingTools

Scripts and web app to help with tedious dubbing processes.

## 🌐 Web Application

A React app using Mantine UI for generating episode marker files from CSV data.

### Features

- Upload CSV files directly in the browser
- Filter by actor name and optional character list
- Generates ZIP files with episode marker CSVs and statistics
- All processing happens client-side (no server needed)
- Works perfectly as a static GitHub Page

### Running Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building

```bash
npm run build
```

Output will be in the `dist/` directory, ready to deploy to GitHub Pages or any static host.

### Deployment

Deploy to GitHub Pages or any static host (Vercel, Netlify, etc.):

1. Push to GitHub
2. Enable GitHub Pages → set source to `gh-pages` branch
3. Run `npm run build && npm run deploy` (or manually push `dist/` to `gh-pages` branch)

## 📋 CLI Tools

### create-episode-markers.js

Converts a CSV file of episode data into marker files, filtered by actor name (command-line version).

#### Usage

```bash
node create-episode-markers.js <inputfile.csv> <actor-name> [characters]
```

#### Arguments

- `inputfile.csv` - Input CSV file with episode data
- `actor-name` - Actor name to filter by (required)
- `characters` (optional) - Comma-separated list of character names to include. If omitted, all characters for the specified actor are included.

#### Output

Generates the following files in the same directory as the input file:

- `{episode}-markers.csv` - Marker entries with format: `#,Name,Start`
- `{baseName}-stats.csv` - Statistics file with marker counts and cumulative progress
