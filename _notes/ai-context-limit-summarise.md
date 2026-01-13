---
title: Ai Context Limit Summarise
description: Short summary of Ai Context Limit Summarise
layout: note
---

Great — here is a **complete, working, production-grade Python summarizer** that:

* Talks directly to your **`llama-server` API**
* Handles **15k+ token files safely**
* Uses **chunk → reduce → final reduce**
* Is **Qwen-4B friendly**
* Runs **headless** (screen off is fine)

You can copy-paste this and run it.

---

## 0️⃣ Prerequisites

```bash
pip install requests tiktoken
```

Make sure your server is running:

```bash
./llama.cpp/build/bin/llama-server \
  -m $HOME/models/Qwen3-4B-Instruct-2507-Q4_K_S-3.87bpw.gguf \
  -c 2048 \
  -t 6 \
  --host 0.0.0.0 \
  --port 8070
```

---

## 1️⃣ Full Python Script: `summarize.py`

```python
import time
import requests
import tiktoken
from pathlib import Path

# =========================
# CONFIG
# =========================
LLAMA_URL = "http://localhost:8070/v1/chat/completions"
MODEL_NAME = "qwen"

CHUNK_TOKENS = 1000
CHUNK_OVERLAP = 150
CHUNK_SUMMARY_TOKENS = 120
REDUCE_GROUP_SIZE = 5

TEMPERATURE = 0.2
SLEEP_BETWEEN_CALLS = 0.5

# =========================
# TOKENIZER
# =========================
enc = tiktoken.get_encoding("cl100k_base")

# =========================
# LLM CALL
# =========================
def call_llm(prompt: str, max_tokens: int) -> str:
    r = requests.post(
        LLAMA_URL,
        json={
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": "You are a concise assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": TEMPERATURE,
            "max_tokens": max_tokens
        },
        timeout=300
    )
    r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"].strip()

# =========================
# CHUNKING
# =========================
def chunk_text(text: str):
    tokens = enc.encode(text)
    chunks = []
    start = 0

    while start < len(tokens):
        end = start + CHUNK_TOKENS
        chunk_tokens = tokens[start:end]
        chunks.append(enc.decode(chunk_tokens))
        start += CHUNK_TOKENS - CHUNK_OVERLAP

    return chunks

# =========================
# PROMPTS
# =========================
def chunk_prompt(chunk: str) -> str:
    return f"""
You are summarizing part of a larger document.

TASK:
- Extract only important information
- Remove repetition and examples
- Use bullet points
- Max {CHUNK_SUMMARY_TOKENS} tokens

TEXT:
{chunk}

OUTPUT:
- Key points:
- Important facts:
""".strip()

def reduce_prompt(summaries: list[str]) -> str:
    return f"""
Combine the summaries below.
Remove duplicates.
Preserve all facts.
Use bullet points.

{chr(10).join(summaries)}
""".strip()

def final_prompt(summaries: list[str]) -> str:
    return f"""
Create a concise final summary.
Focus on:
- Conclusions
- Decisions
- Key facts
No filler.

{chr(10).join(summaries)}
""".strip()

# =========================
# PIPELINE
# =========================
def summarize_large_text(text: str) -> str:
    chunks = chunk_text(text)
    print(f"[+] Created {len(chunks)} chunks")

    # ---- Map step ----
    chunk_summaries = []
    for i, chunk in enumerate(chunks, 1):
        print(f"[+] Summarizing chunk {i}/{len(chunks)}")
        summary = call_llm(
            chunk_prompt(chunk),
            max_tokens=CHUNK_SUMMARY_TOKENS
        )
        chunk_summaries.append(summary)
        time.sleep(SLEEP_BETWEEN_CALLS)

    # ---- Reduce step (grouped) ----
    reduced = []
    for i in range(0, len(chunk_summaries), REDUCE_GROUP_SIZE):
        group = chunk_summaries[i:i + REDUCE_GROUP_SIZE]
        print(f"[+] Reducing summaries {i+1}–{i+len(group)}")
        reduced_summary = call_llm(
            reduce_prompt(group),
            max_tokens=200
        )
        reduced.append(reduced_summary)
        time.sleep(SLEEP_BETWEEN_CALLS)

    # ---- Final reduce ----
    print("[+] Creating final summary")
    final = call_llm(
        final_prompt(reduced),
        max_tokens=300
    )

    return final

# =========================
# CLI ENTRY
# =========================
if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python summarize.py <input.txt>")
        sys.exit(1)

    input_file = Path(sys.argv[1])
    text = input_file.read_text(encoding="utf-8")

    summary = summarize_large_text(text)

    output_file = input_file.with_suffix(".summary.txt")
    output_file.write_text(summary, encoding="utf-8")

    print(f"[✓] Summary written to {output_file}")
```

---

## 2️⃣ Run it

```bash
python summarize.py large_document.txt
```

Output:

```
large_document.summary.txt
```

Screen can be off. SSH session can stay idle. No UI involved.

---

## 3️⃣ Why this works well with Qwen-4B

* Conservative chunk size
* Multi-stage reduction
* Bullet-based compression
* Low temperature
* Serial inference

This avoids:
❌ Context overflow
❌ Hallucination cascades
❌ Web UI freezing

---

## 4️⃣ Easy upgrades (next steps)

I can quickly add:

* 📄 **PDF / DOCX support**
* 🧠 **Fact-only extraction mode**
* ⚡ **Streaming output**
* 🧵 **Retry + resume**
* 🔧 **argparse CLI flags**
* 🌐 **REST wrapper service**

Just tell me **which one you want next**.
