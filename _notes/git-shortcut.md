---
title: Git Shortcut
description: Short summary of Git Shortcut
layout: note
---

Great 👍 Let’s make **Git + GitHub pushing as fast and painless as possible on Linux**.

Below are **practical shortcuts and quality-of-life setups** most developers use.

---

## 🚀 1. SSH Config Shortcut (No More Long Commands)

Create or edit your SSH config file:

```bash
nano ~/.ssh/config
```

Add this:

```text
Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

Save and exit (`CTRL+O`, `Enter`, `CTRL+X`).

### ✅ Result

Now you can use this **shorter remote URL**:

```bash
git remote add origin github:username/repo-name.git
```

No need to remember `git@github.com:...` anymore.

---

## ⚡ 2. Git Aliases (Huge Time Saver)

Set common Git commands as **short aliases**:

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.cm commit -m
git config --global alias.br branch
git config --global alias.ps push
git config --global alias.pl pull
```

### Examples:

```bash
git st
git add .
git cm "Fix login bug"
git ps
```

🔥 Much faster.

---

## 🧠 3. Auto-Set Upstream on First Push (One-Time Setup)

So you don’t need `-u origin main` every time:

```bash
git config --global push.default current
```

Now this works automatically:

```bash
git push
```

---

## 🔐 4. Avoid Re-Entering SSH Passphrase

If you set a passphrase for your SSH key (recommended), enable auto-loading on login:

### Add this to `~/.bashrc` or `~/.zshrc`:

```bash
eval "$(ssh-agent -s)" >/dev/null
ssh-add ~/.ssh/id_ed25519 >/dev/null 2>&1
```

Reload:

```bash
source ~/.bashrc
```

✅ SSH key loads automatically when you open a terminal.

---

## 📁 5. Default Git Branch = `main`

Avoid renaming every repo:

```bash
git config --global init.defaultBranch main
```

Now every `git init` uses `main`.

---

## 🧼 6. Better Git Log (Readable & Pretty)

Set a clean log format:

```bash
git config --global alias.lg "log --oneline --graph --decorate --all"
```

Use it:

```bash
git lg
```

📈 Perfect for understanding branches.

---

## 🧪 7. One-Command New Repo Workflow

From now on, your workflow is:

```bash
git init
git add .
git cm "Initial commit"
git remote add origin github:username/repo-name.git
git push
```

That’s it. ⚡

---

## ✅ Final Check (Optional)

Verify everything is working:

```bash
ssh -T github
git config --global --list
```

---

If you want, I can also:

* 🔄 Show **GitHub CLI (`gh`)** setup (even faster)
* 🌿 Teach **branching & PR workflow**
* 🧪 Explain **undo mistakes safely**
* 🐳 Set this up for **Docker / CI pipelines**

Just tell me what you want next.
