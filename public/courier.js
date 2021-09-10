const tableCour = document.getElementById('tableCour');
const orderForm = document.forms.accForm;

let courier_location;

window.addEventListener('load', async (e) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      courier_location = `${position.coords.latitude}, ${position.coords.longitude}`;
    });
  }
});

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dataFromForm = Object.fromEntries(new FormData(e.target));
  dataFromForm.courier_location = courier_location;
  const response = await fetch('/courier', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(dataFromForm),
  });
  if (response.ok) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        arr = [position.coords.latitude, position.coords.longitude];
      });
    }
    await fetchMap2();
  }
});

if (tableCour) {
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
}

async function fetchMap2() {
  const response = await fetch('/marks');
  let result = false;
  if (response.ok) {
    let myMap;
    await ymaps.ready(init);

    async function init() {
      const dataFromBack = await response.json();

      for (i = 0; i < dataFromBack.length; i++) {
        const arr = dataFromBack[i].courier_location.split(',');
        dataFromBack[i].courier_location = arr.map((el) => Number(el));
      }
      /// //////////////////построение маршрута и вычисление расстояния/////////////////////
      const objMulRoutes = {};
      for await (object of dataFromBack) {
        // const id = await dataFromBack.id
        const obj = {};
        obj.id = await object.id;
        const multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: [
            arr,
            object.courier_location,
          ],
        });

        const thenum = await multiRoute.model.events.add('requestsuccess', async (length) => {
          const distance = await multiRoute.getActiveRoute().properties.get('distance').text;

          obj[Math.random()] = await distance;
          objMulRoutes[Math.random()] = await obj;
          if (Object.keys(objMulRoutes).length === dataFromBack.length) {
            console.log(objMulRoutes);
            const response = await fetch('/order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(objMulRoutes),
            });
            if (response.ok) {
              window.location.href = 'http://localhost:3000/';
              result = true;
            }
          }
        });
      }
    }
  }
}
