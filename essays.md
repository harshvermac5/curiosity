---
layout: default
title: Essays
---

<div class="card-grid">
  {% for essay in site.essays %}
    <a href="{{ site.baseurl }}{{ note.url }}" class="card">
      <h3>{{ essay.title }}</h3>
      <p>{{ essay.description }}</p>
    </a>
  {% endfor %}
</div>
