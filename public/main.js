const table = document.getElementById('table');
const editBtn = document.getElementById('editBtn');
if (table) {
  table.addEventListener('click', async (e) => {
    if (e.target.dataset.id) {
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
    if (e.target.dataset.iddel) {
      e.preventDefault();
      const orderId = e.target.dataset.iddel;
      console.log(orderId);
      const response = await fetch('/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        const tbody = e.target.closest('tbody');
        const raw = e.target.closest(`#b${orderId}`);
        const tableDiv = e.target.closest('.tableDiv');
        // console.dir(tbody);
        raw.remove();
        if (tbody.innerText === '') {
          tableDiv.innerHTML = '<H1 class="text-info">Пока нет доступных заказов</H1>';
        }
      }
    }
  // if (e.target.dataset.ided) {
  //   // e.preventDefault();
  //   console.log('hello');
  //   // const response = await fetch('/edit');
  // }
  });
}
if (editBtn) {
  editBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const idOrder = e.target.dataset.id;
    const editIdOrder = +idOrder.split('').slice(1).join('');
    console.log(e.target.closest('#title'));

    const title = document.getElementById('titleEdit').value;

    const picture = document.getElementById('pictureEdit').value;
    const original_price = document.getElementById('original_priceEdit').value;
    const discount_price = document.getElementById('discount_priceEdit').value;

    const response = await fetch('/:id/edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editIdOrder, title, picture, original_price, discount_price,
      }),
    });
    window.location.href = 'http://localhost:3000';
  });
}

if (table) {
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
}