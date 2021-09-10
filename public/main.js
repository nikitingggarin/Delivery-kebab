const table = document.getElementById('table');
const editBtn = document.getElementById('editBtn');
let myCoords;
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
    console.log(editIdOrder)

    const title = document.getElementById('titleEdit').value;

    const picture = document.getElementById('pictureEdit').value;
    const original_price = document.getElementById('original_priceEdit').value;
    const discount_price = document.getElementById('discount_priceEdit').value;

    const response = await fetch(`/${editIdOrder}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        editIdOrder, title, picture, original_price, discount_price,
      })
    });
    if (response.ok) {
      window.location.href = 'http://localhost:3000'

    }
  })
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

async function fetchMap2() {
  const response = await fetch('/marks');
  let result = false
  if (response.ok) {
    let myMap;
    await ymaps.ready(init);
    async function init() {
      const dataFromBack = await response.json()
      for (i = 0; i < dataFromBack.length; i++) {
        let arr = dataFromBack[i].courier_location.split(',')
        dataFromBack[i].courier_location = arr.map(el => Number(el))
      }
      /////////////////////построение маршрута и вычисление расстояния/////////////////////
      const objMulRoutes = {};
      for await (object of dataFromBack) {
        const obj = {};
        obj.id = await object.id
        let multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: [
            myCoords,
            object.courier_location
          ],
        });
        await multiRoute.model.events.add('requestsuccess', async function (length) {
          const distance = await multiRoute.getActiveRoute().properties.get("distance").text
          obj[Math.random()] = await distance;
          objMulRoutes[Math.random()] = await obj;
          if (Object.keys(objMulRoutes).length === dataFromBack.length) {
            console.log(objMulRoutes)
            const response = await fetch('/order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(objMulRoutes)
            });
            if (response.ok) {
              window.location.href = 'http://localhost:3000/';
              result = true
            }
          }
        })
      }
    }
  }
}
