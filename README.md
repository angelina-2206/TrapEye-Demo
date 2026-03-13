# TruthLens AI — Setup & Usage Guide

## What It Does

| Module | Description | APIs Used |
|---|---|---|
| 🎭 Deepfake Detector | Analyzes images for AI generation, face swaps, photo manipulation | Gemini Vision |
| 📰 Fake News Analyzer | Scores article credibility, bias, sensationalism, red flags | Gemini + NewsAPI |
| 🔗 URL Threat Scanner | Checks links for phishing, malware, suspicious patterns | VirusTotal + Gemini |
| 🧠 Explainable AI | Every result shows **why** — factor-by-factor reasoning breakdown | Built-in |

---

## Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Add your API keys

Create `.streamlit/secrets.toml`:
```toml
GEMINI_API_KEY   = "your_gemini_api_key"
NEWS_API_KEY     = "your_newsapi_org_key"
VIRUSTOTAL_KEY   = "your_virustotal_key"
```

Or set as environment variables:
```bash
export GEMINI_API_KEY=...
export NEWS_API_KEY=...
export VIRUSTOTAL_KEY=...
```

You can also enter keys directly in the **sidebar** at runtime — no config file needed.

### 3. Run the app
```bash
streamlit run app.py
```

Opens at: http://localhost:8501

---

## Getting API Keys

| Service | Get Key | Free Tier |
|---|---|---|
| **Gemini** | https://aistudio.google.com/apikey | 1M tokens/day |
| **NewsAPI** | https://newsapi.org/register | 100 req/day |
| **VirusTotal** | https://www.virustotal.com/gui/join-us | 4 req/min |

---

## Feature Details

### 🎭 Deepfake Detector
- Upload JPG/PNG/WebP images
- Gemini Vision analyzes: facial consistency, lighting, texture artifacts, edge boundaries
- Returns: REAL / FAKE / SUSPICIOUS verdict with confidence score
- XAI breakdown shows which visual features triggered the detection

### 📰 Fake News Analyzer
- Input: Headline, full article text, or URL
- Analyzes: factual accuracy, source credibility, emotional manipulation, missing context
- Scores: credibility (0-100%), political bias (-1 left to +1 right), sensationalism
- Cross-references headline with live NewsAPI database
- Lists red flags and positive credibility signals

### 🔗 URL Threat Scanner
- Paste any URL — shortened links, email links, suspicious URLs
- VirusTotal checks against 70+ antivirus engines
- Gemini analyzes: domain reputation, URL structure, phishing patterns, redirect chains
- Shows VirusTotal engine vote breakdown (malicious / suspicious / harmless)
- Gives clear SAFE/DO NOT VISIT recommendation

### 🧠 Explainable AI
Every scan produces a factor-by-factor explanation panel showing:
- **What** the AI detected
- **Why** it reached its conclusion
- **How confident** it is per factor
- **What to do** based on findings

---

## Architecture

```
app.py
├── Gemini 1.5 Flash (vision + text)
│   ├── Deepfake: image + forensics prompt → structured JSON
│   ├── News: article + fact-check prompt → structured JSON  
│   └── URL: link + threat prompt → structured JSON
├── VirusTotal API v3
│   └── URL reputation lookup (70+ AV engines)
├── NewsAPI.org
│   └── Cross-reference headlines with real articles
└── XAI Layer
    └── Factor extraction from JSON → visual explanation cards
```

---

## Limitations
- Deepfake detection is AI-based, not a specialized forensics tool — use as a first pass
- News analysis reflects AI reasoning, not a verified fact database
- VirusTotal free tier: 4 requests/minute
- Gemini may occasionally hallucinate — always verify important findings manually
