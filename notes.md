---
layout: default
title: Notes
---
<div class="card-grid">
  {% for note in site.notes %}
    <a href="{{ note.url }}" class="card">
      <h3>{{ note.title }}</h3>
      <p>{{ note.description }}</p>
    </a>
  {% endfor %}
</div>

