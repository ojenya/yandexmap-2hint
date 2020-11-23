let myMap;
let placemarkCollections = {};
let placemarkList = {};

// Список городов и магазинов в них
let shopList = [
    {
        'cityName': 'Санкт-Петербург',
        'shops': [
            {'coordinates': [59.932039520598174,30.36075688433275], 'name': 'Восстания 1'},
            {'coordinates': [60.03376800489142,30.41733655158995], 'name': 'Гражданский 114/1'},
            {'coordinates': [59.8767590254867,30.44311104232784], 'name': 'Бабушкина 71'}
        ]
    },
    {
        'cityName': 'Москва',
        'shops': [
            {'coordinates': [55.72532368326033, 37.748675112058876], 'name': 'Рязанский проспект, 6Ас21'},
            {'coordinates': [55.701677873469, 37.57358050756649], 'name': 'Ленинский проспект, 47с2'}
        ]
    }
];

ymaps.ready(init);

function init() {

    // Создаем карту
    myMap = new ymaps.Map("map", {
        center: [56, 37],
        zoom: 10,
        controls: [
            'zoomControl'
        ],
        zoomMargin: [20]
    });

    for (let i = 0; i < shopList.length; i++) {

        // Добавляем название города в выпадающий список
        $('select#cities').append('<option value="' + i + '">' + shopList[i].cityName + '</option>');

        // Создаём коллекцию меток для города
        let cityCollection = new ymaps.GeoObjectCollection();

        for (let c = 0; c < shopList[i].shops.length; c++) {
            let shopInfo = shopList[i].shops[c];

            let shopPlacemark = new ymaps.Placemark(
                shopInfo.coordinates,
                {
                    hintContent: shopInfo.name,
                    balloonContent: shopInfo.name,
                    
                },
                {
                    iconLayout: 'default#image',
                    iconImageHref: 'marker.svg',
                    iconImageSize: [35, 63],

                }
            );

            if (!placemarkList[i]) placemarkList[i] = {};
            placemarkList[i][c] = shopPlacemark;

            // Добавляем метку в коллекцию
            cityCollection.add(shopPlacemark);

        }

        placemarkCollections[i] = cityCollection;

        // Добавляем коллекцию на карту
        myMap.geoObjects.add(cityCollection);

    }

    $('select#cities').trigger('change');
}


// Переключение города
$(document).on('change', $('select#city'), function () {
    let cityId = $('select#cities').val();

    // Масштабируем и выравниваем карту так, чтобы были видны метки для выбранного города
    myMap.setBounds(placemarkCollections[cityId].getBounds(), {checkZoomRange:true}).then(function(){
        if(myMap.getZoom() > 15) myMap.setZoom(15); // Если значение zoom превышает 15, то устанавливаем 15.
    });

    $('#shops').html('');
    for (let c = 0; c < shopList[cityId].shops.length; c++) {
        $('#shops').append('<li value="' + c + '">' + shopList[cityId].shops[c].name + '</li>');
    }

});

// Клик на адрес
$(document).on('click', '#shops li', function () {

    let cityId = $('select#cities').val();
    let shopId = $(this).val();

    placemarkList[cityId][shopId].events.fire('click');
});