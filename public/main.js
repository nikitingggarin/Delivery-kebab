const table = document.getElementById('table');

table.addEventListener('click', async (e) => {
  if (e.target.tagName === 'BUTTON') {
    e.preventDefault();

    const orderId = e.target.dataset.id;

    const response = await fetch('/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    // const email = await response.json();
    // console.log(email);
    if (response.ok) {
      const tbody = e.target.closest('tbody');
      const raw = e.target.closest(`#b${orderId}`);
      const tableDiv = e.target.closest('.tableDiv');
      // console.dir(tbody);
      raw.remove();
      if (tbody.innerText === '') {
        tableDiv.innerHTML = '<H1 class="text-info">Пока нет доступных заказов</H1>';
      }
      // window.location.href = 'http://localhost:3000';
    }
  }
});
