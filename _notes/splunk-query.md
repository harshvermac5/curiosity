---
title: Splunk Query
description: Short summary of Splunk Query
layout: note
---

Below is a **clear explanation of each Splunk query**, what it does, and *why* it’s typically used. I’ll break down every command piece by piece.

---

# ✅ **1.**

### **`index=main sourcetype=web_traffic | timechart span=1d count`**

**What it does:**

* Searches logs in `index=main` with `sourcetype=web_traffic`
* Creates a **time-based chart** (`timechart`)
* Aggregates data by **1 day intervals** (`span=1d`)
* Counts the number of events per day

**Use case:**
Daily traffic trend graph—useful for detecting spikes/drops.

---

# ✅ **2.**

### **`index=main sourcetype=web_traffic | timechart span=1d count | sort by count | reverse`**

Same as above **with sorting added**:

* `sort by count` → sort results ascending
* `reverse` → converts to descending (largest first)

**Use case:**
Sort days from highest → lowest traffic.

---

# ✅ **3.**

### **`index=main sourcetype=web_traffic user_agent!=*Mozilla* user_agent!=*Chrome* user_agent!=*Safari* user_agent!=*Firefox*`**

**What it does:**
Filters **out** events where `user_agent` belongs to major browsers.

You're left with:

* Bots
* Scripts
* Unknown agents
* Scanners

**Use case:**
Identify **suspicious or non-browser traffic**.

---

# ✅ **4.**

### **`sourcetype=web_traffic user_agent!=*Mozilla* user_agent!=*Chrome* user_agent!=*Safari* user_agent!=*Firefox* | stats count by client_ip | sort -count | head 5`**

Same filtering as above, plus:

* `stats count by client_ip` → count number of events per IP
* `sort -count` → highest first
* `head 5` → top 5 IPs

**Use case:**
Find the **top 5 suspicious IPs** based on strange/non-browser UAs.

---

# ✅ **5.**

### **`sourcetype=web_traffic client_ip="<REDACTED>" AND path IN ("/.env", "/*phpinfo*", "/.git*") | table _time, path, user_agent, status`**

**What it does:**

Filters requests from a specific IP:

* Looking for paths matching

  * `/.env`
  * `*phpinfo*`
  * `/.git*`

These are **common attack targets**.

Outputs selected fields into a table:

* `_time`
* `path`
* `user_agent`
* `status`

**Use case:**
Investigate if that IP is attempting **info-disclosure or Git/Env file probing**.

---

# ✅ **6.**

### **`sourcetype=web_traffic client_ip="<REDACTED>" AND path="*..*" OR path="*redirect*"`**

**What it does:**

Searches for:

* Directory traversal (`*..*`)
* Redirection attempts (`*redirect*`)

**BUT WARNING:**
Operator precedence means Splunk interprets this as:

```
( sourcetype=web_traffic AND client_ip="<REDACTED>" AND path="*..*" )
OR
path="*redirect*"
```

To fix it, you should use parentheses:

```
sourcetype=web_traffic client_ip="<REDACTED>" AND (path="*..*" OR path="*redirect*")
```

**Use case:**
Catch directory traversal or malicious redirect scanning.

---

# ✅ **7.**

### **`sourcetype=web_traffic client_ip="<REDACTED>" AND path="*..\/..\/*" OR path="*redirect*" | stats count by path`**

Similar to above but with:

* More specific traversal pattern: `..\/..\/`
* Count grouped by `path`

**Use case:**
See which dangerous paths are being hit and how often.

---

# ✅ **8.**

### **`sourcetype=web_traffic client_ip="<REDACTED>" AND user_agent IN ("*sqlmap*", "*Havij*") | table _time, path, status`**

Filters by malicious tools:

* `sqlmap`
* `Havij`

These are **SQL injection tools**.

Outputs:

* Time
* Targeted path
* Response status

**Use case:**
Detect SQL injection attempts from that IP.

---

# ✅ **9.**

### **`sourcetype=web_traffic client_ip="<REDACTED>" AND path IN ("*backup.zip*", "*logs.tar.gz*") | table _time path, user_agent`**

Finds access attempts to downloadable/archive files.

Attackers look for:

* Backups
* Logs
* Sensitive exports

Shows:

* timestamp
* path attempted
* user agent

**Use case:**
Detect attempts to download sensitive backup files.

---

# ✅ **10.**

### **`sourcetype=web_traffic client_ip="<REDACTED>" AND path IN ("*bunnylock.bin*", "*shell.php?cmd=*") | table _time, path, user_agent, status`**

Looks for:

* Ransomware dropper files (`bunnylock.bin`)
* Remote shell execution attempts (`shell.php?cmd=...`)

**Use case:**
Detect malware delivery or remote command execution attempts.

---

# 🔥 **Firewall Queries**

## **11.**

### **`sourcetype=firewall_logs src_ip="10.10.1.5" AND dest_ip="<REDACTED>" AND action="ALLOWED" | table _time, action, protocol, src_ip, dest_ip, dest_port, reason`**

Filters firewall logs:

* Source: `10.10.1.5`
* Destination: `<REDACTED>`
* Only allowed actions

Displays relevant fields.

**Use case:**
Check what outbound or inbound traffic was permitted.

---

# **12.**

### **`sourcetype=firewall_logs src_ip="10.10.1.5" AND dest_ip="<REDACTED>" AND action="ALLOWED" | stats sum(bytes_transferred) by src_ip`**

Same filtering, but aggregates traffic:

* Calculates total `bytes_transferred`
* Groups by `src_ip`

**Use case:**
Measure how much data a host sent—useful for:

* Data exfiltration detection
* Bandwidth analysis

---

# ✅ Summary Table

| Query Type                  | Purpose                           |
| --------------------------- | --------------------------------- |
| `timechart`                 | Traffic trends over time          |
| `stats count`               | Frequency analysis                |
| `sort` / `head`             | Top offenders                     |
| Directory traversal filters | Find hacking attempts             |
| SQLmap/Havij                | Detect SQL injection tools        |
| Backup probes               | Check for data theft attempts     |
| Remote shell / malware      | Detect exploitation attempts      |
| Firewall logs               | Investigate allowed network flows |

---

If you want, I can also provide:

🔹 A **cheat sheet** of common SPL commands
🔹 **Improved, secure versions** of your queries (with parentheses fixes)
🔹 A **dashboard** that visualizes all these attacks

Just tell me!
