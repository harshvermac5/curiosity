---
title: Git Github Setup
description: Short summary of Git Github Setup
layout: note
---

Absolutely! Let’s go **step by step** to configure Git on Linux and connect it to GitHub so you can push code from the terminal. I’ll make it clear and thorough.

---

## **1. Install Git**

First, check if Git is installed:

```bash
git --version
```

If it’s not installed, install it using your package manager:

* **Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install git
```

* **Fedora:**

```bash
sudo dnf install git
```

* **Arch Linux:**

```bash
sudo pacman -S git
```

---

## **2. Configure Git**

Set your **username** and **email** (these will show up in your commits):

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

Check your config:

```bash
git config --list
```

---

## **3. Generate SSH Key (Recommended)**

SSH keys are more secure than HTTPS for pushing code.

1. Generate a new SSH key:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

* Press Enter to accept default file location (`~/.ssh/id_ed25519`)
* Enter a passphrase (optional but recommended)

2. Start the SSH agent:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

3. Copy your SSH public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

---

## **4. Add SSH Key to GitHub**

1. Go to [GitHub SSH settings](https://github.com/settings/ssh/new)
2. Click **New SSH key**
3. Paste your public key
4. Give it a title (like `Linux Laptop`)
5. Click **Add SSH key**

Test the connection:

```bash
ssh -T git@github.com
```

You should see something like:

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## **5. Initialize Git Repository**

Navigate to your project folder:

```bash
cd /path/to/your/project
```

Initialize Git:

```bash
git init
```

Add files and commit:

```bash
git add .
git commit -m "Initial commit"
```

---

## **6. Connect to GitHub Repository**

1. Create a new repository on GitHub (no need to add README if you already have files locally).
2. Copy the SSH URL, e.g.:

```
git@github.com:username/repo-name.git
```

3. Add remote and push:

```bash
git remote add origin git@github.com:username/repo-name.git
git branch -M main
git push -u origin main
```

---

✅ Now your Git is configured, your project is connected to GitHub, and you can push future changes using:

```bash
git add .
git commit -m "Your message"
git push
```

---

If you want, I can also show a **shortcut setup that avoids typing SSH commands every time** and makes pushing super fast on Linux.

Do you want me to do that?
