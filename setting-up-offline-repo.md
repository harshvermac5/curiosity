To **download a package with all its dependencies (without installing them)** using `apt`, use one of the following methods depending on your needs.

---

## Option 1: Use `apt-get download` + `apt-rdepends` (most common)

This downloads the `.deb` files for a package **and all its dependencies** into the current directory.

### 1. Install the helper tool

```bash
sudo apt update
sudo apt install apt-rdepends
```

### 2. Download package + dependencies

```bash
apt-rdepends <package-name> \
  | grep -v "^ " \
  | xargs apt-get download
```

✅ Result:

* All `.deb` files are downloaded
* Nothing is installed
* Works well for offline installs

---

## Option 2: Use `apt-get install --download-only`

If you’re okay with using the system dependency resolver and just want the packages cached:

```bash
sudo apt-get install --download-only <package-name>
```

📍 Files are stored in:

```bash
/var/cache/apt/archives/
```

❌ This does **not** put files in the current directory
❌ Requires root
❌ Uses system state (may skip already-installed deps)

---

## Option 3: Download for a specific architecture or release

```bash
apt-get download <package>:amd64
```

Or for a different release:

```bash
apt-get download -t bookworm <package>
```

---

## Option 4: Fully offline system preparation (recommended for air-gapped systems)

```bash
mkdir pkgs && cd pkgs
apt-rdepends <package-name> \
  | grep -v "^ " \
  | sort -u \
  | xargs apt-get download
```

Then install offline:

```bash
sudo dpkg -i *.deb
sudo apt -f install
```

---

## Notes & Gotchas

* `apt-get download` does **not** require root
* Virtual packages won’t download (they map to real ones)
* Some recommends/suggests may not be included unless explicitly required

---

If you want:

* **All recommended packages**
* **A specific Ubuntu/Debian version**
* **A Docker-friendly or chroot-based solution**

tell me your distro and use case 👍


To point your **`/dev/sdb1` USB pendrive as a local APT repository**, follow these steps (works on Debian/Ubuntu and derivatives).

---

## 1. Mount the pendrive

Identify and mount it (adjust mount point if you want):

```bash
sudo mkdir -p /mnt/usbrepo
sudo mount /dev/sdb1 /mnt/usbrepo
```

(Optional: make it persistent via `/etc/fstab` later.)

---

## 2. Prepare the repository structure on the USB

APT expects metadata. The simplest layout is:

```text
/mnt/usbrepo/
 ├── dists/
 │   └── stable/
 │       └── main/
 │           └── binary-amd64/
 │               └── Packages.gz
 └── pool/
     └── main/
         └── *.deb
```

### Copy your `.deb` files

```bash
mkdir -p /mnt/usbrepo/pool/main
cp *.deb /mnt/usbrepo/pool/main/
```

---

## 3. Generate APT metadata

Install required tools (only once):

```bash
sudo apt install dpkg-dev
```

Create the `Packages.gz` file:

```bash
mkdir -p /mnt/usbrepo/dists/stable/main/binary-amd64

cd /mnt/usbrepo
dpkg-scanpackages pool /dev/null \
  | gzip -9c > dists/stable/main/binary-amd64/Packages.gz
```

---

## 4. Add the USB repo to APT sources

### Option A: Using `sources.list.d` (recommended)

```bash
sudo nano /etc/apt/sources.list.d/usbrepo.list
```

Add:

```text
deb [trusted=yes] file:/mnt/usbrepo stable main
```

✅ `trusted=yes` avoids GPG signing (safe for personal/offline use)

---

## 5. Update and use the repo

```bash
sudo apt update
```

Now install packages normally:

```bash
sudo apt install <package-name>
```

APT will resolve dependencies from your USB repo.

---

## 6. (Optional) Persistent mount via `/etc/fstab`

Find UUID:

```bash
blkid /dev/sdb1
```

Add to `/etc/fstab`:

```text
UUID=xxxx-xxxx  /mnt/usbrepo  auto  defaults,nofail  0  0
```

---

## Minimal / Quick Alternative (no repo metadata)

If you don’t need dependency resolution:

```bash
sudo dpkg -i /mnt/usbrepo/*.deb
sudo apt -f install
```

⚠️ This still needs another repo for missing dependencies.

---

## Common Problems

**APT says “Release file not found”**

* That’s OK for local repos; `trusted=yes` fixes it

**Architecture mismatch**

* Ensure `binary-amd64` matches your system (`amd64`, `arm64`, etc.)

**Missing dependencies**

* Make sure *all dependency `.deb` files* are on the USB

---

If you want:

* **Signed local repo**
* **Multiple distributions (bookworm/jammy)**
* **Multi-arch USB repo**
* **Auto-sync from an online mirror**

tell me your distro/version and I’ll tailor it exactly.
