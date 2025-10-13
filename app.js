  // Tag selection effect
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        tags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
      });
    });