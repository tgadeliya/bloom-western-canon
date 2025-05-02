function toggleWorks(el) {
  const works = el.querySelector('.works');
  if (works) {
    works.style.display = works.style.display === 'block' ? 'none' : 'block';
  }
}
