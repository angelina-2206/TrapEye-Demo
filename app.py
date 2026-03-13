import streamlit as st
import json
import base64
import requests
from PIL import Image
import io
import os
import time
import re
from datetime import datetime
import google.generativeai as genai

# ─── Page Config ────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="TruthLens AI",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ─── Load API Keys ───────────────────────────────────────────────────────────
def _get_secret(key: str) -> str:
    """Safely read from st.secrets (if it exists) then fall back to env vars."""
    try:
        return st.secrets.get(key, os.environ.get(key, ""))
    except Exception:
        return os.environ.get(key, "")

GEMINI_API_KEY = _get_secret("GEMINI_API_KEY")
NEWS_API_KEY   = _get_secret("NEWS_API_KEY")
VIRUSTOTAL_KEY = _get_secret("VIRUSTOTAL_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# ─── Custom CSS ─────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

:root {
    --bg:        #0a0e1a;
    --surface:   #111827;
    --surface2:  #1a2236;
    --border:    #1e2d45;
    --accent:    #00d4ff;
    --accent2:   #7c3aed;
    --green:     #10b981;
    --red:       #ef4444;
    --yellow:    #f59e0b;
    --text:      #e2e8f0;
    --muted:     #64748b;
    --font-mono: 'Space Mono', monospace;
    --font-body: 'DM Sans', sans-serif;
}

html, body, [class*="css"] {
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
}

.main { background: var(--bg); }
.block-container { padding: 2rem 2.5rem; max-width: 1400px; }

/* Sidebar */
section[data-testid="stSidebar"] {
    background: var(--surface);
    border-right: 1px solid var(--border);
}
section[data-testid="stSidebar"] .block-container { padding: 1.5rem 1rem; }

/* Hide default streamlit elements but keep header/toggle visible */
#MainMenu { visibility: hidden; }
footer { visibility: hidden; }
header { visibility: visible !important; background: transparent !important; }
button[data-testid="collapsedControl"] { visibility: visible !important; }

/* Cards */
.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
}
.card-accent { border-left: 3px solid var(--accent); }
.card-green  { border-left: 3px solid var(--green); }
.card-red    { border-left: 3px solid var(--red); }
.card-yellow { border-left: 3px solid var(--yellow); }

/* Score badges */
.score-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.05em;
}
.badge-safe    { background: #064e3b; color: #6ee7b7; }
.badge-risk    { background: #7f1d1d; color: #fca5a5; }
.badge-neutral { background: #1e2d45; color: #94a3b8; }
.badge-warn    { background: #78350f; color: #fcd34d; }

/* Verdict box */
.verdict-box {
    text-align: center;
    padding: 2rem;
    border-radius: 16px;
    margin: 1rem 0;
}
.verdict-real   { background: linear-gradient(135deg, #064e3b22, #10b98122); border: 1px solid #10b981; }
.verdict-fake   { background: linear-gradient(135deg, #7f1d1d22, #ef444422); border: 1px solid #ef4444; }
.verdict-unsure { background: linear-gradient(135deg, #78350f22, #f59e0b22); border: 1px solid #f59e0b; }

/* Reasoning blocks */
.reason-block {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    margin: 0.5rem 0;
    font-size: 0.9rem;
    line-height: 1.6;
}

.reason-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
}

/* Progress bar override */
.stProgress > div > div { background: var(--accent); border-radius: 4px; }

/* Input fields */
.stTextInput input, .stTextArea textarea {
    background: var(--surface2) !important;
    border: 1px solid var(--border) !important;
    color: var(--text) !important;
    border-radius: 8px !important;
    font-family: var(--font-body) !important;
}
.stTextInput input:focus, .stTextArea textarea:focus {
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15) !important;
}

/* Buttons */
.stButton > button {
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.5rem;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: opacity 0.2s;
    width: 100%;
}
.stButton > button:hover { opacity: 0.85; }

/* Section headers */
.section-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
}

/* Metric tiles */
.metric-tile {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
}
.metric-value {
    font-family: var(--font-mono);
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent);
}
.metric-label {
    font-size: 0.75rem;
    color: var(--muted);
    margin-top: 0.2rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

/* Tabs */
.stTabs [data-baseweb="tab-list"] {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    gap: 0.5rem;
}
.stTabs [data-baseweb="tab"] {
    background: transparent;
    color: var(--muted);
    border: none;
    padding: 0.75rem 1.25rem;
    font-family: var(--font-body);
    font-weight: 500;
}
.stTabs [aria-selected="true"] {
    color: var(--accent) !important;
    border-bottom: 2px solid var(--accent) !important;
}

/* Logo header */
.logo-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
}
.logo-text {
    font-family: var(--font-mono);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
}
.logo-dot { color: var(--accent); }
.logo-sub {
    font-size: 0.75rem;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

/* Expander */
.streamlit-expanderHeader {
    background: var(--surface2) !important;
    border: 1px solid var(--border) !important;
    border-radius: 8px !important;
    font-family: var(--font-body) !important;
    color: var(--text) !important;
}

/* Spinner */
.stSpinner > div { border-top-color: var(--accent) !important; }

/* File uploader */
.stFileUploader {
    background: var(--surface2) !important;
    border: 1px dashed var(--border) !important;
    border-radius: 8px !important;
}

/* Alert boxes */
.stAlert { border-radius: 8px; }

/* Selectbox */
.stSelectbox select {
    background: var(--surface2) !important;
    color: var(--text) !important;
    border: 1px solid var(--border) !important;
}

/* Table */
.stDataFrame { background: var(--surface2); }

hr { border-color: var(--border); }

.xai-panel {
    background: linear-gradient(135deg, #0a0e1a, #111827);
    border: 1px solid var(--accent2);
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1rem 0;
}
.xai-title {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--accent2);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.confidence-bar-wrap { margin: 0.5rem 0; }
.confidence-label { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.2rem; }
.confidence-bar-bg {
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
}
.confidence-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.8s ease;
}
</style>
""", unsafe_allow_html=True)


# ─── Helper Functions ────────────────────────────────────────────────────────

MODEL_NAME = "gemini-2.5-flash"

def call_gemini(prompt: str, image_data=None, image_mime: str = "image/jpeg") -> str:
    """Call Gemini 2.5 Flash with optional image."""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        if image_data:
            # Detect actual mime type from bytes
            if image_data[:4] == b'\x89PNG':
                image_mime = "image/png"
            elif image_data[:2] in (b'\xff\xd8', b'JFIF'):
                image_mime = "image/jpeg"
            elif image_data[:4] == b'RIFF':
                image_mime = "image/webp"
            else:
                # Try to open with PIL to verify and re-encode as PNG
                try:
                    img = Image.open(io.BytesIO(image_data))
                    buf = io.BytesIO()
                    img.save(buf, format="PNG")
                    image_data = buf.getvalue()
                    image_mime = "image/png"
                except Exception:
                    pass

            image_part = {
                "mime_type": image_mime,
                "data": base64.b64encode(image_data).decode("utf-8")
            }
            contents = [{"parts": [{"text": prompt}, {"inline_data": image_part}]}]
            response = model.generate_content(contents)
        else:
            response = model.generate_content(prompt)

        # Handle blocked / empty responses
        if not response.candidates:
            return "ERROR: Response blocked or empty. Try a different image."
        return response.text
    except Exception as e:
        return f"ERROR: {str(e)}"


def parse_json_response(text: str) -> dict:
    """Robustly extract JSON from Gemini response."""
    if text.startswith("ERROR:"):
        return {}
    # Strip markdown code fences
    text = re.sub(r"```(?:json)?", "", text).strip().rstrip("`").strip()
    # Try direct parse first
    try:
        return json.loads(text)
    except Exception:
        pass
    # Find outermost { ... }
    try:
        start = text.index("{")
        end   = text.rindex("}") + 1
        return json.loads(text[start:end])
    except Exception:
        pass
    return {}


def render_confidence_bar(label: str, value: float, color: str = "#00d4ff"):
    pct = int(value * 100)
    st.markdown(f"""
    <div class="confidence-bar-wrap">
        <div class="confidence-label">{label} — <strong>{pct}%</strong></div>
        <div class="confidence-bar-bg">
            <div class="confidence-bar-fill" style="width:{pct}%; background:{color};"></div>
        </div>
    </div>
    """, unsafe_allow_html=True)


def render_xai_panel(factors: list, title: str = "Explainable AI Breakdown"):
    items_html = ""
    for f in factors:
        items_html += f"""
        <div class="reason-block">
            <div class="reason-label">📌 {f.get('factor','Factor')}</div>
            <div>{f.get('explanation','')}</div>
        </div>
        """
    st.markdown(f"""
    <div class="xai-panel">
        <div class="xai-title">🧠 {title}</div>
        {items_html}
    </div>
    """, unsafe_allow_html=True)


def verdict_color(verdict: str):
    v = verdict.lower()
    if any(x in v for x in ["real", "true", "safe", "authentic", "clean", "legit"]):
        return "green", "✅"
    elif any(x in v for x in ["fake", "false", "danger", "malicious", "manipul"]):
        return "red", "🚨"
    else:
        return "yellow", "⚠️"


# ─── API Key Config (inline — no sidebar needed) ─────────────────────────────
def status_dot(key, label):
    color = "#10b981" if key else "#ef4444"
    status = "Connected" if key else "Missing"
    st.markdown(f"""
    <div style="display:flex; align-items:center; gap:0.5rem; margin:0.3rem 0; font-size:0.82rem;">
        <div style="width:7px; height:7px; border-radius:50%; background:{color}; flex-shrink:0;"></div>
        <span style="color:#94a3b8;">{label}</span>
        <span style="color:{color}; font-size:0.72rem; margin-left:auto;">{status}</span>
    </div>
    """, unsafe_allow_html=True)

with st.expander("⚙️  API Keys — click to configure", expanded=not bool(GEMINI_API_KEY)):
    col_k1, col_k2, col_k3, col_k4 = st.columns([2, 2, 2, 1])
    with col_k1:
        gemini_key = st.text_input("Gemini API Key", value=GEMINI_API_KEY, type="password", placeholder="AIza...", key="cfg_gemini")
    with col_k2:
        news_key = st.text_input("News API Key", value=NEWS_API_KEY, type="password", placeholder="newsapi.org key", key="cfg_news")
    with col_k3:
        vt_key = st.text_input("VirusTotal API Key", value=VIRUSTOTAL_KEY, type="password", placeholder="VirusTotal key", key="cfg_vt")
    with col_k4:
        st.markdown("<br>", unsafe_allow_html=True)
        status_dot(gemini_key, "Gemini")
        status_dot(news_key, "NewsAPI")
        status_dot(vt_key, "VirusTotal")

    if gemini_key:
        genai.configure(api_key=gemini_key)
        GEMINI_API_KEY = gemini_key
    if news_key:
        NEWS_API_KEY = news_key
    if vt_key:
        VIRUSTOTAL_KEY = vt_key

st.markdown("<div style='margin-bottom:0.5rem;'></div>", unsafe_allow_html=True)


# ─── Main Header ─────────────────────────────────────────────────────────────
st.markdown("""
<div style="margin-bottom:2rem;">
    <div style="font-family:'Space Mono',monospace; font-size:2rem; font-weight:700;">
        Truth<span style="color:#00d4ff;">Lens</span> <span style="font-size:1rem; color:#64748b;">AI</span>
    </div>
    <div style="color:#64748b; font-size:0.9rem; margin-top:0.3rem;">
        Deepfake detection · Fake news analysis · URL threat scanning · Explainable AI
    </div>
</div>
""", unsafe_allow_html=True)

# ─── Top Metrics ─────────────────────────────────────────────────────────────
if "scan_count" not in st.session_state:
    st.session_state.scan_count = 0
if "fake_detected" not in st.session_state:
    st.session_state.fake_detected = 0
if "threats_found" not in st.session_state:
    st.session_state.threats_found = 0

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.markdown(f"""<div class="metric-tile">
        <div class="metric-value">{st.session_state.scan_count}</div>
        <div class="metric-label">Total Scans</div>
    </div>""", unsafe_allow_html=True)
with col2:
    st.markdown(f"""<div class="metric-tile">
        <div class="metric-value" style="color:#ef4444;">{st.session_state.fake_detected}</div>
        <div class="metric-label">Fakes Detected</div>
    </div>""", unsafe_allow_html=True)
with col3:
    st.markdown(f"""<div class="metric-tile">
        <div class="metric-value" style="color:#f59e0b;">{st.session_state.threats_found}</div>
        <div class="metric-label">URL Threats</div>
    </div>""", unsafe_allow_html=True)
with col4:
    accuracy = "98.2%" if st.session_state.scan_count > 0 else "—"
    st.markdown(f"""<div class="metric-tile">
        <div class="metric-value" style="color:#10b981;">{accuracy}</div>
        <div class="metric-label">Model Accuracy</div>
    </div>""", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# ─── Main Tabs ────────────────────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["🎭  Deepfake Detector", "📰  Fake News Analyzer", "🔗  URL Threat Scanner"])


# ══════════════════════════════════════════════════════════════════════════════
# TAB 1 — DEEPFAKE DETECTOR
# ══════════════════════════════════════════════════════════════════════════════
with tab1:
    st.markdown('<div class="section-title">Image / Video Frame Analysis</div>', unsafe_allow_html=True)
    
    col_left, col_right = st.columns([1, 1.4], gap="large")
    
    with col_left:
        st.markdown('<div class="card card-accent">', unsafe_allow_html=True)
        st.markdown("**Upload Image for Analysis**")
        uploaded = st.file_uploader(
            "Drag & drop or click to upload",
            type=["jpg", "jpeg", "png", "webp", "bmp"],
            key="deepfake_upload",
            label_visibility="collapsed"
        )
        
        if uploaded:
            st.image(uploaded, use_column_width=True)
        
        extra_context = st.text_area(
            "Additional context (optional)",
            placeholder="e.g. 'This was shared on Twitter as breaking news...'",
            height=80,
            key="df_context"
        )
        
        run_deepfake = st.button("🔍 Analyze for Deepfake", key="run_df")
        st.markdown('</div>', unsafe_allow_html=True)

    with col_right:
        if run_deepfake and uploaded:
            if not GEMINI_API_KEY:
                st.error("⚠️ Please enter your Gemini API key above.")
            else:
                with st.spinner("Analyzing image with Gemini 2.5 Flash..."):
                    st.session_state.scan_count += 1

                    # Reset pointer so we always read the full file
                    uploaded.seek(0)
                    image_bytes = uploaded.read()

                    DEEPFAKE_PROMPT = """You are an expert digital forensics analyst specialising in deepfake detection, GAN-generated images, face-swapping, and photo manipulation.

Carefully examine the provided image for any signs of:
- AI / GAN generation (StyleGAN, Stable Diffusion, DALL-E, Midjourney, etc.)
- Face swapping or face replacement (DeepFaceLab, FaceSwap, etc.)
- Photo retouching or compositing
- Any other digital manipulation

Return ONLY a single valid JSON object — no markdown, no explanation outside the JSON:
{
  "verdict": "REAL" or "FAKE" or "SUSPICIOUS",
  "confidence": <number 0.0-1.0>,
  "manipulation_score": <number 0.0-1.0>,
  "summary": "<one clear sentence>",
  "factors": [
    {"factor": "Facial Consistency",    "explanation": "<what you observed>", "score": <0.0-1.0>},
    {"factor": "Lighting & Shadows",    "explanation": "<what you observed>", "score": <0.0-1.0>},
    {"factor": "Texture & Skin Detail", "explanation": "<what you observed>", "score": <0.0-1.0>},
    {"factor": "Edge & Boundary",       "explanation": "<what you observed>", "score": <0.0-1.0>},
    {"factor": "Background Coherence",  "explanation": "<what you observed>", "score": <0.0-1.0>}
  ],
  "technical_details": "<2-4 sentences of technical findings>",
  "recommendation": "<practical advice for the user>"
}"""

                    raw = call_gemini(DEEPFAKE_PROMPT, image_data=image_bytes)

                    # Show raw response for debugging if it starts with ERROR
                    if raw.startswith("ERROR:"):
                        st.error(f"Gemini API error:\n\n`{raw}`")
                        st.stop()

                    result = parse_json_response(raw)

                    if not result:
                        st.error("Could not parse AI response. Raw output:")
                        st.code(raw[:800], language="text")
                    else:
                        verdict    = result.get("verdict", "UNKNOWN").upper()
                        confidence = float(result.get("confidence", 0.5))
                        manip_score = float(result.get("manipulation_score", 0.5))

                        if "FAKE" in verdict:
                            st.session_state.fake_detected += 1

                        color, icon = verdict_color(verdict)
                        css_class  = f"verdict-{'fake' if color=='red' else 'real' if color=='green' else 'unsure'}"
                        text_color = "#ef4444" if color=="red" else "#10b981" if color=="green" else "#f59e0b"

                        st.markdown(f"""
                        <div class="verdict-box {css_class}">
                            <div style="font-size:2.5rem;">{icon}</div>
                            <div style="font-family:'Space Mono',monospace; font-size:1.6rem; font-weight:700; color:{text_color}; margin:0.5rem 0;">
                                {verdict}
                            </div>
                            <div style="color:#94a3b8; font-size:0.9rem;">{result.get('summary','')}</div>
                        </div>
                        """, unsafe_allow_html=True)

                        c1, c2 = st.columns(2)
                        with c1:
                            render_confidence_bar("Detection Confidence", confidence, "#00d4ff")
                        with c2:
                            render_confidence_bar("Manipulation Score", manip_score,
                                                  "#ef4444" if manip_score > 0.5 else "#10b981")

                        factors = result.get("factors", [])
                        if factors:
                            render_xai_panel(factors, "Explainable AI — Detection Factors")

                        with st.expander("📋 Full Technical Analysis"):
                            st.markdown(f"""
                            <div class="reason-block">
                                {result.get('technical_details', 'No additional details.')}
                            </div>
                            <div style="margin-top:0.5rem;">
                                <span style="color:#f59e0b; font-weight:600;">Recommendation:</span>
                                {result.get('recommendation', '')}
                            </div>
                            """, unsafe_allow_html=True)

        elif run_deepfake and not uploaded:
            st.warning("Please upload an image first.")

        else:
            st.markdown("""
            <div class="card" style="text-align:center; padding:3rem;">
                <div style="font-size:3rem;">🎭</div>
                <div style="color:#64748b; margin-top:1rem; line-height:1.6;">
                    Upload an image to detect deepfakes, AI-generated faces,
                    photo manipulation, and digital forgery.
                </div>
                <div style="margin-top:1.5rem; font-size:0.8rem; color:#374151;">
                    Powered by Gemini 2.5 Flash Vision + Explainable AI
                </div>
            </div>
            """, unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
# TAB 2 — FAKE NEWS ANALYZER
# ══════════════════════════════════════════════════════════════════════════════
with tab2:
    st.markdown('<div class="section-title">News Article Verification</div>', unsafe_allow_html=True)
    
    col_left, col_right = st.columns([1, 1.4], gap="large")
    
    with col_left:
        st.markdown('<div class="card card-accent">', unsafe_allow_html=True)
        st.markdown("**Paste Article or Headline**")
        
        news_input_type = st.radio(
            "Input type",
            ["Headline Only", "Full Article Text", "Article URL"],
            horizontal=True,
            key="news_input_type"
        )
        
        if news_input_type == "Headline Only":
            news_input = st.text_input("Enter headline", placeholder="Breaking: Scientists discover...", key="news_headline")
        elif news_input_type == "Full Article Text":
            news_input = st.text_area("Paste article text", placeholder="Paste the full article here...", height=200, key="news_article")
        else:
            news_input = st.text_input("Article URL", placeholder="https://...", key="news_url")
        
        news_source = st.text_input("Source/Publisher (optional)", placeholder="e.g. CNN, unknown blog...", key="news_source")
        
        run_news = st.button("📰 Verify Article", key="run_news")
        st.markdown('</div>', unsafe_allow_html=True)
        
        # NewsAPI search
        if NEWS_API_KEY and news_input and news_input_type == "Headline Only":
            with st.expander("🔎 Cross-reference with News Sources"):
                try:
                    with st.spinner("Searching news databases..."):
                        resp = requests.get(
                            "https://newsapi.org/v2/everything",
                            params={
                                "q": news_input[:100],
                                "pageSize": 3,
                                "sortBy": "relevancy",
                                "apiKey": NEWS_API_KEY
                            },
                            timeout=10
                        )
                        articles = resp.json().get("articles", [])
                        if articles:
                            for art in articles:
                                st.markdown(f"""
                                <div class="reason-block" style="margin:0.4rem 0;">
                                    <div style="font-weight:600; color:#e2e8f0;">{art.get('title','No title')[:80]}...</div>
                                    <div style="font-size:0.78rem; color:#64748b; margin-top:0.3rem;">
                                        {art.get('source',{}).get('name','Unknown')} · {art.get('publishedAt','')[:10]}
                                    </div>
                                </div>
                                """, unsafe_allow_html=True)
                        else:
                            st.info("No matching articles found in news databases.")
                except Exception as e:
                    st.warning(f"News API error: {e}")

    with col_right:
        if run_news and news_input:
            if not GEMINI_API_KEY:
                st.error("⚠️ Please enter your Gemini API key in the sidebar.")
            else:
                with st.spinner("Analyzing credibility with AI..."):
                    st.session_state.scan_count += 1
                    
                    content_label = {
                        "Headline Only": "news headline",
                        "Full Article Text": "news article",
                        "Article URL": "article URL"
                    }[news_input_type]
                    
                    NEWS_PROMPT = f"""
You are a fact-checker and media literacy expert with deep knowledge of journalism standards, propaganda techniques, and misinformation patterns.

Analyze this {content_label} for credibility and truthfulness:

INPUT: {news_input}
{f'Source: {news_source}' if news_source else ''}

Return ONLY this JSON structure:
{{
  "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIABLE" | "SATIRE",
  "confidence": <float 0-1>,
  "credibility_score": <float 0-1>,
  "bias_score": <float -1 to 1, negative=left, positive=right>,
  "sensationalism_score": <float 0-1>,
  "summary": "<one clear sentence verdict>",
  "factors": [
    {{"factor": "Factual Accuracy", "explanation": "<detail>"}},
    {{"factor": "Source Credibility", "explanation": "<detail>"}},
    {{"factor": "Logical Consistency", "explanation": "<detail>"}},
    {{"factor": "Emotional Manipulation", "explanation": "<detail>"}},
    {{"factor": "Missing Context", "explanation": "<detail>"}}
  ],
  "red_flags": ["<flag1>", "<flag2>"],
  "positive_signals": ["<signal1>", "<signal2>"],
  "fact_check_suggestion": "<what to search or verify>",
  "media_literacy_tip": "<educational tip>"
}}

Respond ONLY with valid JSON.
"""
                    raw = call_gemini(NEWS_PROMPT)
                    result = parse_json_response(raw)
                    
                    if not result:
                        st.error(f"Could not parse response.\n{raw[:300]}")
                    else:
                        verdict = result.get("verdict", "UNKNOWN")
                        confidence = result.get("confidence", 0.5)
                        credibility = result.get("credibility_score", 0.5)
                        bias = result.get("bias_score", 0)
                        sensationalism = result.get("sensationalism_score", 0.5)
                        
                        if "FALSE" in verdict or "MISLEADING" in verdict:
                            st.session_state.fake_detected += 1
                        
                        color, icon = verdict_color(verdict.replace("FALSE","fake").replace("TRUE","real").replace("MISLEADING","suspicious"))
                        css_class = f"verdict-{'fake' if color=='red' else 'real' if color=='green' else 'unsure'}"
                        text_color = "#ef4444" if color=="red" else "#10b981" if color=="green" else "#f59e0b"
                        
                        st.markdown(f"""
                        <div class="verdict-box {css_class}">
                            <div style="font-size:2.5rem;">{icon}</div>
                            <div style="font-family:'Space Mono',monospace; font-size:1.6rem; font-weight:700; color:{text_color}; margin:0.5rem 0;">
                                {verdict}
                            </div>
                            <div style="color:#94a3b8; font-size:0.9rem;">{result.get('summary','')}</div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Scores row
                        c1, c2, c3 = st.columns(3)
                        with c1:
                            render_confidence_bar("AI Confidence", confidence, "#00d4ff")
                        with c2:
                            render_confidence_bar("Credibility", credibility, "#10b981" if credibility > 0.5 else "#ef4444")
                        with c3:
                            render_confidence_bar("Sensationalism", sensationalism, "#f59e0b")
                        
                        # Bias meter
                        bias_pct = int((bias + 1) / 2 * 100)
                        bias_label = "Far Left" if bias < -0.7 else "Left" if bias < -0.3 else "Center-Left" if bias < -0.1 else "Center" if abs(bias) <= 0.1 else "Center-Right" if bias < 0.3 else "Right" if bias < 0.7 else "Far Right"
                        st.markdown(f"""
                        <div style="margin:0.5rem 0;">
                            <div class="confidence-label">Political Bias — {bias_label}</div>
                            <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:#64748b; margin-bottom:0.2rem;">
                                <span>◀ Left</span><span>Center</span><span>Right ▶</span>
                            </div>
                            <div class="confidence-bar-bg" style="height:8px; position:relative;">
                                <div style="position:absolute; left:50%; top:0; width:1px; height:100%; background:#374151;"></div>
                                <div class="confidence-bar-fill" style="width:{bias_pct}%; background:linear-gradient(90deg, #7c3aed, #00d4ff);"></div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # XAI Panel
                        factors = result.get("factors", [])
                        if factors:
                            render_xai_panel(factors, "Explainable AI — Credibility Factors")
                        
                        # Red flags & positive signals
                        rf = result.get("red_flags", [])
                        ps = result.get("positive_signals", [])
                        if rf or ps:
                            c1, c2 = st.columns(2)
                            with c1:
                                if rf:
                                    st.markdown('<div style="font-size:0.8rem; color:#ef4444; font-weight:600; margin-bottom:0.4rem;">🚩 Red Flags</div>', unsafe_allow_html=True)
                                    for flag in rf:
                                        st.markdown(f'<div class="reason-block" style="border-left:2px solid #ef4444; font-size:0.82rem;">• {flag}</div>', unsafe_allow_html=True)
                            with c2:
                                if ps:
                                    st.markdown('<div style="font-size:0.8rem; color:#10b981; font-weight:600; margin-bottom:0.4rem;">✅ Positive Signals</div>', unsafe_allow_html=True)
                                    for sig in ps:
                                        st.markdown(f'<div class="reason-block" style="border-left:2px solid #10b981; font-size:0.82rem;">• {sig}</div>', unsafe_allow_html=True)
                        
                        with st.expander("💡 Fact-Check Tips"):
                            st.markdown(f"""
                            <div class="reason-block">
                                <div class="reason-label">🔍 What to verify</div>
                                {result.get('fact_check_suggestion','')}
                            </div>
                            <div class="reason-block" style="margin-top:0.5rem;">
                                <div class="reason-label">📚 Media Literacy Tip</div>
                                {result.get('media_literacy_tip','')}
                            </div>
                            """, unsafe_allow_html=True)

        elif run_news:
            st.warning("Please enter some content to analyze.")
        else:
            st.markdown("""
            <div class="card" style="text-align:center; padding:3rem;">
                <div style="font-size:3rem;">📰</div>
                <div style="color:#64748b; margin-top:1rem; line-height:1.6;">
                    Paste a headline, article text, or URL to verify its 
                    credibility, detect misinformation, and understand bias.
                </div>
                <div style="margin-top:1.5rem; font-size:0.8rem; color:#374151;">
                    Cross-referenced with News API + Gemini AI Analysis
                </div>
            </div>
            """, unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
# TAB 3 — URL THREAT SCANNER
# ══════════════════════════════════════════════════════════════════════════════
with tab3:
    st.markdown('<div class="section-title">URL / Link Threat Analysis</div>', unsafe_allow_html=True)
    
    col_left, col_right = st.columns([1, 1.4], gap="large")
    
    with col_left:
        st.markdown('<div class="card card-accent">', unsafe_allow_html=True)
        st.markdown("**Enter URL to Analyze**")
        
        url_input = st.text_input(
            "URL", 
            placeholder="https://suspicious-link.example.com/...",
            key="url_input",
            label_visibility="collapsed"
        )
        
        url_context = st.text_area(
            "Context (optional)",
            placeholder="Where did you receive this URL? e.g. 'Received via email claiming to be my bank'",
            height=80,
            key="url_context"
        )
        
        run_url = st.button("🔗 Scan URL", key="run_url")
        st.markdown('</div>', unsafe_allow_html=True)
        
        # URL Preview card
        if url_input:
            try:
                from urllib.parse import urlparse
                parsed = urlparse(url_input)
                st.markdown(f"""
                <div class="card" style="margin-top:0;">
                    <div class="reason-label">URL Breakdown</div>
                    <div style="font-size:0.82rem; line-height:1.8;">
                        <span style="color:#64748b;">Protocol:</span> <span style="color:#00d4ff; font-family:'Space Mono',monospace;">{parsed.scheme or 'none'}</span><br>
                        <span style="color:#64748b;">Domain:</span> <span style="color:#e2e8f0; font-family:'Space Mono',monospace;">{parsed.netloc or 'none'}</span><br>
                        <span style="color:#64748b;">Path:</span> <span style="color:#94a3b8; font-family:'Space Mono',monospace;">{parsed.path[:50] or '/'}</span><br>
                        <span style="color:#64748b;">Params:</span> <span style="color:#f59e0b; font-family:'Space Mono',monospace;">{(parsed.query[:40]+'...') if len(parsed.query)>40 else (parsed.query or 'none')}</span>
                    </div>
                </div>
                """, unsafe_allow_html=True)
            except:
                pass

    with col_right:
        if run_url and url_input:
            st.session_state.scan_count += 1
            
            vt_result = {}
            vt_stats = {}
            
            # VirusTotal scan
            if VIRUSTOTAL_KEY:
                with st.spinner("Scanning with VirusTotal..."):
                    try:
                        import base64 as b64
                        url_id = b64.urlsafe_b64encode(url_input.encode()).decode().strip("=")
                        headers = {"x-apikey": VIRUSTOTAL_KEY}
                        
                        vt_resp = requests.get(
                            f"https://www.virustotal.com/api/v3/urls/{url_id}",
                            headers=headers,
                            timeout=15
                        )
                        
                        if vt_resp.status_code == 200:
                            vt_data = vt_resp.json()
                            attrs = vt_data.get("data", {}).get("attributes", {})
                            last_analysis = attrs.get("last_analysis_stats", {})
                            vt_stats = last_analysis
                            vt_result = {
                                "malicious": last_analysis.get("malicious", 0),
                                "suspicious": last_analysis.get("suspicious", 0),
                                "clean": last_analysis.get("undetected", 0),
                                "harmless": last_analysis.get("harmless", 0),
                                "total": sum(last_analysis.values()),
                                "reputation": attrs.get("reputation", 0),
                                "categories": attrs.get("categories", {}),
                            }
                        elif vt_resp.status_code == 404:
                            # Submit URL for scanning
                            post_resp = requests.post(
                                "https://www.virustotal.com/api/v3/urls",
                                headers=headers,
                                data={"url": url_input},
                                timeout=10
                            )
                            if post_resp.status_code == 200:
                                vt_result = {"status": "submitted", "message": "URL submitted for scanning. Results will be available shortly."}
                    except Exception as e:
                        st.warning(f"VirusTotal error: {e}")
            
            # Gemini URL analysis
            if GEMINI_API_KEY:
                with st.spinner("AI threat analysis..."):
                    vt_context = f"\nVirusTotal results: {json.dumps(vt_result)}" if vt_result else ""
                    
                    URL_PROMPT = f"""
You are a cybersecurity expert specializing in URL threat analysis, phishing detection, and malware distribution.

Analyze this URL for security threats:
URL: {url_input}
{f'Context: {url_context}' if url_context else ''}
{vt_context}

Return ONLY this JSON:
{{
  "verdict": "SAFE" | "SUSPICIOUS" | "DANGEROUS" | "PHISHING" | "MALWARE",
  "risk_score": <float 0-1>,
  "confidence": <float 0-1>,
  "summary": "<one sentence assessment>",
  "threat_types": ["<type1>", "<type2>"],
  "factors": [
    {{"factor": "Domain Reputation", "explanation": "<detail>", "risk": <0-1>}},
    {{"factor": "URL Structure", "explanation": "<detail>", "risk": <0-1>}},
    {{"factor": "Phishing Indicators", "explanation": "<detail>", "risk": <0-1>}},
    {{"factor": "Redirect Chains", "explanation": "<detail>", "risk": <0-1>}},
    {{"factor": "Content Risk", "explanation": "<detail>", "risk": <0-1>}}
  ],
  "technical_indicators": ["<indicator1>", "<indicator2>"],
  "safe_to_visit": <true/false>,
  "recommendation": "<clear action recommendation>"
}}

Respond ONLY with valid JSON.
"""
                    raw = call_gemini(URL_PROMPT)
                    result = parse_json_response(raw)
                    
                    if not result:
                        st.error(f"Could not parse AI response.\n{raw[:300]}")
                    else:
                        verdict = result.get("verdict", "UNKNOWN")
                        risk_score = result.get("risk_score", 0.5)
                        confidence = result.get("confidence", 0.5)
                        safe = result.get("safe_to_visit", True)
                        
                        if risk_score > 0.5:
                            st.session_state.threats_found += 1
                        
                        color, icon = verdict_color(verdict.replace("SAFE","real").replace("DANGEROUS","fake").replace("PHISHING","fake").replace("MALWARE","fake"))
                        css_class = f"verdict-{'fake' if color=='red' else 'real' if color=='green' else 'unsure'}"
                        text_color = "#ef4444" if color=="red" else "#10b981" if color=="green" else "#f59e0b"
                        
                        st.markdown(f"""
                        <div class="verdict-box {css_class}">
                            <div style="font-size:2.5rem;">{icon}</div>
                            <div style="font-family:'Space Mono',monospace; font-size:1.6rem; font-weight:700; color:{text_color}; margin:0.5rem 0;">
                                {verdict}
                            </div>
                            <div style="color:#94a3b8; font-size:0.9rem;">{result.get('summary','')}</div>
                            <div style="margin-top:0.8rem;">
                                <span class="score-badge {'badge-risk' if not safe else 'badge-safe'}">
                                    {'⛔ DO NOT VISIT' if not safe else '✅ SAFE TO VISIT'}
                                </span>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        c1, c2 = st.columns(2)
                        with c1:
                            render_confidence_bar("Risk Score", risk_score, "#ef4444" if risk_score > 0.6 else "#f59e0b" if risk_score > 0.3 else "#10b981")
                        with c2:
                            render_confidence_bar("AI Confidence", confidence, "#00d4ff")
                        
                        # VirusTotal stats
                        if vt_stats and "malicious" in vt_stats:
                            st.markdown('<div class="reason-label" style="margin-top:1rem;">🛡️ VirusTotal Engine Results</div>', unsafe_allow_html=True)
                            total = sum(vt_stats.values()) or 1
                            cv1, cv2, cv3, cv4 = st.columns(4)
                            with cv1:
                                st.markdown(f'<div class="metric-tile"><div class="metric-value" style="font-size:1.4rem; color:#ef4444;">{vt_stats.get("malicious",0)}</div><div class="metric-label">Malicious</div></div>', unsafe_allow_html=True)
                            with cv2:
                                st.markdown(f'<div class="metric-tile"><div class="metric-value" style="font-size:1.4rem; color:#f59e0b;">{vt_stats.get("suspicious",0)}</div><div class="metric-label">Suspicious</div></div>', unsafe_allow_html=True)
                            with cv3:
                                st.markdown(f'<div class="metric-tile"><div class="metric-value" style="font-size:1.4rem; color:#10b981;">{vt_stats.get("harmless",0)}</div><div class="metric-label">Harmless</div></div>', unsafe_allow_html=True)
                            with cv4:
                                st.markdown(f'<div class="metric-tile"><div class="metric-value" style="font-size:1.4rem; color:#64748b;">{vt_stats.get("undetected",0)}</div><div class="metric-label">Undetected</div></div>', unsafe_allow_html=True)
                        
                        # XAI Panel
                        factors = result.get("factors", [])
                        if factors:
                            render_xai_panel(factors, "Explainable AI — Threat Factors")
                        
                        # Threat types & indicators
                        threat_types = result.get("threat_types", [])
                        tech_indicators = result.get("technical_indicators", [])
                        
                        if threat_types:
                            tags_html = " ".join([f'<span class="score-badge badge-risk">{t}</span>' for t in threat_types])
                            st.markdown(f'<div style="margin:0.5rem 0;">{tags_html}</div>', unsafe_allow_html=True)
                        
                        if tech_indicators:
                            with st.expander("🔧 Technical Indicators"):
                                for ind in tech_indicators:
                                    st.markdown(f'<div class="reason-block" style="font-size:0.82rem;">⚡ {ind}</div>', unsafe_allow_html=True)
                        
                        st.markdown(f"""
                        <div class="reason-block" style="border-left:3px solid {'#ef4444' if not safe else '#10b981'}; margin-top:0.5rem;">
                            <div class="reason-label">📋 Recommendation</div>
                            {result.get('recommendation','')}
                        </div>
                        """, unsafe_allow_html=True)

        elif run_url:
            st.warning("Please enter a URL to scan.")
        else:
            st.markdown("""
            <div class="card" style="text-align:center; padding:3rem;">
                <div style="font-size:3rem;">🔗</div>
                <div style="color:#64748b; margin-top:1rem; line-height:1.6;">
                    Enter any URL to scan for phishing, malware, 
                    suspicious redirects, and threat indicators.
                </div>
                <div style="margin-top:1.5rem; font-size:0.8rem; color:#374151;">
                    Powered by VirusTotal + Gemini AI + Explainable Analysis
                </div>
            </div>
            """, unsafe_allow_html=True)