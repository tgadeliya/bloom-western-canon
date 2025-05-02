function toggleEpoch(epochId) {
    const section = document.querySelector('[id^="' + epochId + '"]');
    if (section) {
      const container = section.closest('.age');
      if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
      }
    }
  }