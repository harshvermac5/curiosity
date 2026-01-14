---
layout: default
title: Notes
---

<div class="card-grid">
  {% for note in site.notes %}
    <a href="{{ site.baseurl }}{{ note.url }}" class="card">
      <h3 class="card-title">{{ note.title }}</h3>
      <p class="card-description">{{ note.description }}</p>
    </a>
  {% endfor %}
</div>

