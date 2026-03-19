# TrapEye — AI-Powered Scam & Misinformation Detection

TrapEye is an AI-powered threat detection platform designed to identify deepfakes, fake news, phishing URLs, and digital manipulation before harm occurs. Built with accessibility in mind for elderly users and students, it combines Google Gemini's vision and language capabilities with VirusTotal and NewsAPI to deliver explainable, real-time threat assessments.

**Live Demo:** [https://trapeye-demo.onrender.com/](https://trapeye-demo.onrender.com/)

---

## Overview

Online scams and misinformation cause significant harm across all demographics. TrapEye addresses this by providing a unified, easy-to-use interface for detecting:

- AI-generated or manipulated images (deepfakes)
- Misleading or fabricated news articles
- Malicious and phishing URLs

Every analysis includes an Explainable AI (XAI) breakdown — showing not just the verdict, but the specific factors that led to it.

---

## Features

### Deepfake Detector

Upload any image (JPG, PNG, WebP) and receive an AI-driven forensic analysis powered by Gemini Vision.

- Detects GAN-generated images (StyleGAN, Stable Diffusion, Midjourney, etc.)
- Identifies face-swapping artifacts (DeepFaceLab, FaceSwap, etc.)
- Analyzes facial consistency, lighting coherence, texture detail, edge boundaries, and background integrity
- Returns a verdict of REAL, FAKE, or SUSPICIOUS with a confidence score and manipulation score
- Provides a factor-by-factor XAI breakdown and a practical recommendation

### Fake News Analyzer

Evaluate the credibility of news content by entering a headline, full article text, or article URL.

- Cross-references headlines against live news databases via NewsAPI
- Scores credibility (0–100%), political bias (left to right scale), and sensationalism level
- Identifies red flags (emotional manipulation, missing context, logical inconsistencies) and positive credibility signals
- Provides a verdict of TRUE, FALSE, MISLEADING, UNVERIFIABLE, or SATIRE
- Includes media literacy tips and actionable fact-check suggestions

### URL Threat Scanner

Paste any URL — including shortened links, email links, or suspected phishing URLs — for a multi-layered security scan.

- Checks against 70+ antivirus engines via VirusTotal API v3
- Performs AI analysis of domain reputation, URL structure, phishing indicators, redirect chain risk, and content patterns
- Provides a verdict of SAFE, SUSPICIOUS, DANGEROUS, PHISHING, or MALWARE
- Displays a full URL breakdown (protocol, domain, path, query parameters) before scanning
- Gives a clear safe/do-not-visit recommendation with technical indicators

### Explainable AI (XAI)

Every scan produces a structured explanation panel showing:

- What the AI detected
- Why it reached its conclusion, factor by factor
- Confidence levels per factor
- Recommended next steps

### Session Dashboard

A live metrics panel tracks total scans, fakes detected, URL threats found, and model accuracy within the current session.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Streamlit (Python) + Custom CSS |
| AI Model | Google Gemini 2.5 Flash (vision + text) |
| URL Threat Intelligence | VirusTotal API v3 |
| News Cross-Reference | NewsAPI.org |
| Web Interface | React + TypeScript (frontend directory) |
| Deployment | Render |

---

## Repository Structure

```
TrapEye-Demo/
├── app.py                  # Main Streamlit application
├── requirements.txt        # Python dependencies
├── frontend/               # React/TypeScript web interface
│   └── ...
└── .gitignore
```

---

## Local Setup

### Prerequisites

- Python 3.9 or higher
- pip

### 1. Clone the repository

```bash
git clone https://github.com/angelina-2206/TrapEye-Demo.git
cd TrapEye-Demo
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure API keys

**Option A — Streamlit secrets file**

Create `.streamlit/secrets.toml`:

```toml
GEMINI_API_KEY   = "your_gemini_api_key"
NEWS_API_KEY     = "your_newsapi_org_key"
VIRUSTOTAL_KEY   = "your_virustotal_key"
```

**Option B — Environment variables**

```bash
export GEMINI_API_KEY=your_gemini_api_key
export NEWS_API_KEY=your_newsapi_org_key
export VIRUSTOTAL_KEY=your_virustotal_key
```

**Option C — Runtime input**

Keys can also be entered directly in the in-app configuration panel at startup. No config file is required.

### 4. Run the application

```bash
streamlit run app.py
```

The app will be available at `http://localhost:8501`.

---

## API Keys

| Service | Registration | Free Tier Limits |
|---|---|---|
| Google Gemini | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | 1M tokens/day |
| NewsAPI | [newsapi.org/register](https://newsapi.org/register) | 100 requests/day |
| VirusTotal | [virustotal.com/gui/join-us](https://www.virustotal.com/gui/join-us) | 4 requests/minute |

Only the Gemini API key is required to use the core detection features. NewsAPI and VirusTotal extend the Fake News Analyzer and URL Scanner respectively.

---

## Architecture

```
app.py
├── Gemini 2.5 Flash (vision + text)
│   ├── Deepfake Detector  → image + forensics prompt → structured JSON
│   ├── Fake News Analyzer → article + fact-check prompt → structured JSON
│   └── URL Threat Scanner → link + threat prompt → structured JSON
├── VirusTotal API v3
│   └── URL reputation lookup across 70+ antivirus engines
├── NewsAPI.org
│   └── Cross-reference headlines with verified news sources
└── XAI Layer
    └── Factor extraction from JSON → visual explanation cards
```

---

## Limitations

- Deepfake detection relies on AI reasoning and is not a specialized cryptographic forensics tool. It should be treated as a first-pass indicator, not a definitive proof.
- News analysis reflects AI reasoning applied to the input text. It does not access a verified fact-checking database.
- VirusTotal free tier is rate-limited to 4 requests per minute. Previously unscanned URLs may require a short wait before results are available.
- As with all large language models, Gemini may occasionally produce imprecise outputs. Critical findings should always be verified through additional sources.

---

## Target Audience

TrapEye is designed with two primary groups in mind:

- **Elderly users** who are frequent targets of phishing, fraud, and manipulated media
- **Students and young adults** who encounter misinformation across social media platforms

The interface is designed to be accessible and interpretable without technical background knowledge.

---

## License

This project is provided as a demonstration. See repository for licensing details.

## Limitations
- Deepfake detection is AI-based, not a specialized forensics tool — use as a first pass
- News analysis reflects AI reasoning, not a verified fact database
- VirusTotal free tier: 4 requests/minute
- Gemini may occasionally hallucinate — always verify important findings manually
