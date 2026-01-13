---
title: Venv Python
description: Short summary of Venv Python
layout: note
---

A **virtual environment (venv)** lets you isolate Python packages for each project so they don’t conflict with others. Here’s a clear, beginner-friendly guide.

---

## 1️⃣ Create a virtual environment

Open your terminal / command prompt and go to your project folder:

```bash
cd path/to/your/project
```

Create the venv:

### Windows

```bash
python -m venv venv
```

### macOS / Linux

```bash
python3 -m venv venv
```

This creates a folder called `venv/` containing a private Python installation.

---

## 2️⃣ Activate the virtual environment

### Windows (Command Prompt / PowerShell)

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

✅ When activated, you’ll see `(venv)` at the start of your terminal line.

---

## 3️⃣ Install packages inside the venv

Once activated, use `pip` as usual:

```bash
pip install requests
```

The package is installed **only in this venv**, not globally.

To see installed packages:

```bash
pip list
```

---

## 4️⃣ Use Python in the venv

Run Python normally:

```bash
python
```

or run your script:

```bash
python main.py
```

It will automatically use the venv’s Python and packages.

---

## 5️⃣ Deactivate the virtual environment

When you’re done:

```bash
deactivate
```

This returns you to your system Python.

---

## 6️⃣ (Recommended) Save dependencies

To record installed packages:

```bash
pip freeze > requirements.txt
```

Later, someone else (or you on another machine) can recreate them:

```bash
pip install -r requirements.txt
```

---

## 7️⃣ Typical project structure

```
my_project/
│── venv/
│── main.py
│── requirements.txt
```

> ⚠️ Don’t commit `venv/` to Git. Add it to `.gitignore`.

---

## Common mistakes to avoid

* ❌ Forgetting to activate the venv before installing packages
* ❌ Using global `pip` instead of venv `pip`
* ❌ Committing the `venv/` folder to version control

---

If you want, I can also explain:

* How venv works **under the hood**
* How to use venv with **VS Code**
* Difference between **venv, virtualenv, pipenv, and conda**

Just tell me 👍

