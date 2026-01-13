---
title: Ffmpeg Mp4 To Mp3
description: Short summary of Ffmpeg Mp4 To Mp3
layout: note
---

Here are the most common and reliable ways to convert **all `.mp4` files to `.mp3` in a specific folder using FFmpeg**.

---

## Linux / macOS (Bash)

```bash
for f in /path/to/folder/*.mp4; do
  ffmpeg -i "$f" -vn -acodec libmp3lame -ab 192k "${f%.mp4}.mp3"
done
```

### Notes

* `-vn` → removes video
* `192k` → good audio quality (change if needed)
* Output MP3 is created in the **same folder**

---

## Windows (Command Prompt)

```bat
for %f in ("C:\path\to\folder\*.mp4") do ffmpeg -i "%f" -vn -acodec libmp3lame -ab 192k "%~dpnf.mp3"
```

### For a `.bat` file (important difference)

```bat
for %%f in ("C:\path\to\folder\*.mp4") do ffmpeg -i "%%f" -vn -acodec libmp3lame -ab 192k "%%~dpnf.mp3"
```

---

## PowerShell (clean & recommended on Windows)

```powershell
Get-ChildItem "C:\path\to\folder" -Filter *.mp4 | ForEach-Object {
    ffmpeg -i "$($_.FullName)" -vn -acodec libmp3lame -ab 192k "$($_.DirectoryName)\$($_.BaseName).mp3"
}
```

---

## Preserve Original Audio Quality (no re-encoding if possible)

If the audio stream is already MP3/AAC and you just want extraction:

```bash
ffmpeg -i input.mp4 -vn -acodec copy output.mp3
```

⚠️ This works **only if** the audio codec is compatible with MP3.

---

## Bonus: Recursive (all subfolders)

```bash
find /path/to/folder -name "*.mp4" -exec ffmpeg -i {} -vn -ab 192k {}.mp3 \;
```

---

If you want:

* recursive conversion
* different bitrate
* output to another folder
* logging / error handling
* automation script

Tell me your OS and I’ll tailor it exactly for you.
