`rsync` is a powerful command-line tool for copying and syncing files between directories or machines, efficiently transferring only the differences.

Below is a practical, step-by-step guide from basic to advanced usage.

---

## Basic syntax

```bash
rsync [options] source destination
```

---

## 1. Copy files locally

Copy a directory to another location:

```bash
rsync -av source_dir/ destination_dir/
```

**Common options explained**

* `-a` → *archive mode* (recursive, preserves permissions, timestamps, symlinks)
* `-v` → verbose output
* `-z` → compress data during transfer (useful over network)
* `--progress` → show progress

Example:

```bash
rsync -av --progress ~/Documents/ ~/Backup/Documents/
```

---

## 2. Copy files to a remote server (over SSH)

```bash
rsync -avz source_dir/ user@server:/path/to/destination/
```

Example:

```bash
rsync -avz ~/Projects/ alice@192.168.1.10:/home/alice/Projects/
```

---

## 3. Copy files **from** a remote server

```bash
rsync -avz user@server:/path/to/source/ local_dir/
```

---

## 4. Dry run (very important!)

See what **would happen** without copying anything:

```bash
rsync -av --dry-run source_dir/ destination_dir/
```

Always use this before destructive operations.

---

## 5. Delete files that no longer exist in source

Mirror source to destination:

```bash
rsync -av --delete source_dir/ destination_dir/
```

⚠️ This will remove extra files in the destination.

---

## 6. Exclude files or directories

Exclude patterns:

```bash
rsync -av --exclude='*.log' --exclude='node_modules/' source/ dest/
```

Use an exclude file:

```bash
rsync -av --exclude-from=exclude.txt source/ dest/
```

---

## 7. Preserve permissions and ownership (requires sudo)

```bash
sudo rsync -aAX source/ dest/
```

* `-A` → ACLs
* `-X` → extended attributes

Useful for system backups.

---

## 8. Sync only updated files

(default behavior, but explicit):

```bash
rsync -av --ignore-existing source/ dest/
```

---

## 9. Use a specific SSH key or port

```bash
rsync -av -e "ssh -i ~/.ssh/mykey -p 2222" source/ user@server:/dest/
```

---

## 10. Common mistakes to avoid

### Trailing slash matters!

```bash
rsync -av dir/ dest/   # copies contents of dir
rsync -av dir dest/    # copies dir itself
```

---

## 11. Backup example (recommended command)

```bash
rsync -avz --delete --progress \
  --exclude='.cache/' \
  --exclude='Downloads/' \
  ~/ /mnt/backup/home/
```

---

## When should you use rsync?

✅ Backups
✅ Deploying code
✅ Syncing servers
✅ Migrating data
✅ Large file transfers

---

If you want, tell me:

* local → local, or local → remote?
* backup or one-time copy?
* OS (Linux, macOS, Windows/WSL)?

I can tailor the exact command for your use case.

