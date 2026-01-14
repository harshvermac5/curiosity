import os

# Folder containing your notes
CONTEXT_FOLDER = input("Please enter name of your desired folder: ")

# Default front matter template
FRONT_MATTER_TEMPLATE = """---
title: {title}
description: {description}
layout: note
---
"""

# Loop through all Markdown files in the folder
for filename in os.listdir(CONTEXT_FOLDER):
    if filename.endswith(".md"):
        file_path = os.path.join(CONTEXT_FOLDER, filename)
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Skip files that already have front matter
        if content.startswith("---"):
            print(f"Skipping {filename}: already has front matter")
            continue
        
        # Generate title from file name (replace hyphens/underscores with spaces, capitalize)
        title = os.path.splitext(filename)[0].replace("-", " ").replace("_", " ").title()
        description = "Short summary of " + title
        
        front_matter = FRONT_MATTER_TEMPLATE.format(title=title, description=description)
        
        # Write new content with front matter at the top
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(front_matter + "\n" + content)
        
        print(f"Added front matter to {filename}")

