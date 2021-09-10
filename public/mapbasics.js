const button = document.getElementById('position');
let arr;
const tableDiv = document.querySelector('.tableDiv');

tableDiv.addEventListener('click', async (e) => {
  if (e.target.tagName === 'BUTTON') {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        arr = [position.coords.latitude, position.coords.longitude];
      });
    }
    await fetchMap2();
  }
});
async function fetchMap2() {
  const response = await fetch('/marks');
  let result = false;
  if (response.ok) {
    let myMap;
    await ymaps.ready(init);
    async function init() {
      const dataFromBack = await response.json();
      for (i = 0; i < dataFromBack.length; i++) {
        const arr = dataFromBack[i].courier_location
        // .split();
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
              window.location.href = 'https://delivery-kebab.herokuapp.com/';
              result = true;
            }
          }
        });
      }
    }
  }
}
/// //////////////////////вторая функиция с картами
async function fetchMap() {
  const response = await fetch('/marks');
  if (response.ok) {
    let myMap;
    await ymaps.ready(init);
    async function init() {
      const dataFromBack = await response.json();
      for (i = 0; i < dataFromBack.length; i++) {
        const arr = dataFromBack[i].courier_location
        .split(',');
        dataFromBack[i].courier_location = arr.map((el) => Number(el));
      }
      myMap = await new ymaps.Map('map', {
        center: arr,
        zoom: 14,
      });
      myGeoObject = new ymaps.GeoObject({
        // Описание геометрии.
        geometry: {
          type: 'Point',
          coordinates: arr,
        },
        // Свойства.
        properties: {
          // Контент метки.
          iconContent: 'Вы',
        },
      }, {
        // Опции.
        // Иконка метки будет растягиваться под размер ее содержимого.
        preset: 'islands#blackStretchyIcon',
        // Метку можно перемещать.
        draggable: false,
      });
      for (i = 0; i < dataFromBack.length; i++) {
        order = new ymaps.GeoObject({
          geometry: {
            type: 'Point',
            coordinates: await dataFromBack[i].courier_location,
          },
          properties: {
            iconContent: dataFromBack[i].title,
          },
        }, {
          preset: 'islands#blackStretchyIcon',
        });
        myMap.geoObjects.add(order);
      }
      myMap.geoObjects.add(myGeoObject);
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
            const response = await fetch('/order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(objMulRoutes),
            });
            if (response.ok) {
              return true;
            }
          }
        });
      }
    }
  }
}
/// /////////////////событие, которое загружает карту/////////
window.addEventListener('load', async (e) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      arr = [position.coords.latitude, position.coords.longitude];
    });
  }
  await fetchMap();
});
