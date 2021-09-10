const tableCour = document.getElementById('tableCour');
const orderForm = document.forms.accForm;

let courier_location;

window.addEventListener('load', async (e) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      courier_location = `${position.coords.latitude}, ${position.coords.longitude}`;
    })
  }

})

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dataFromForm = Object.fromEntries(new FormData(e.target));
  dataFromForm.courier_location = courier_location;
  const response = await fetch('/courier', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(dataFromForm)
  });
  if (response.ok) {
    window.location.href = 'http://localhost:3000/';
  }
})

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
