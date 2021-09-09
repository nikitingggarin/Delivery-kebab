const tableCour = document.getElementById('tableCour');

tableCour.addEventListener('click', async (e) => {
  if (e.target.tagName === 'BUTTON') {
    e.preventDefault();
    const orderId = e.target.dataset.id;

    const response = await fetch('/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    if (response.ok) {
      const tbody = e.target.closest('tbody');
      const raw = e.target.closest(`#a${orderId}`);
      const tableDiv = e.target.closest('.tableDiv');
      console.dir(raw);
      raw.remove();
      if (tbody.innerText === '') {
        tableDiv.innerHTML = '<H1 class="text-info">Пока нет доступных заказов</H1>';
      }
      // window.location.href = 'http://localhost:3000/courier';
    }
  }
});
