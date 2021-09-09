const button = document.getElementById('position');
let arr;
let myMap;

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

async function init() {
  myMap = new ymaps.Map('map', {

    center: arr,
    zoom: 14,
  });

  // const response = await fetch('/marks');

  // if (response.ok) {
  //   const dataFromBack = await response.json()
  //   console.log(dataFromBack)
  // }

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

  myMap.geoObjects.add(myGeoObject);
}

window.addEventListener('load', (e) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      arr = [position.coords.latitude, position.coords.longitude];
      console.log(position.coords.latitude, position.coords.longitude);
    });
  }
});
