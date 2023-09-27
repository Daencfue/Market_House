function iniciarMap() {
    var coordSantiago = { lat: -33.4489, lng: -70.6693 }; // Coordenadas de Santiago de Chile
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11, // Zoom adecuado para ver las comunas
        center: coordSantiago // Centro del mapa en Santiago de Chile
    });

    // Array de objetos con las coordenadas y nombres de las comunas
    var comunas = [
        { nombre: 'Cerrillos', lat: -33.4981, lng: -70.7091 },
        { nombre: 'Cerro Navia', lat: -33.4186, lng: -70.7356 },
        { nombre: 'Conchalí', lat: -33.3809, lng: -70.6716 },
        // Agrega el resto de las comunas aquí con sus coordenadas
    ];

    for (var i = 0; i < comunas.length; i++) {
        (function () {
            var comuna = comunas[i];
            var marker = new google.maps.Marker({
                position: { lat: comuna.lat, lng: comuna.lng },
                map: map,
                title: comuna.nombre // Muestra el nombre de la comuna al hacer clic en el marcador
            });

            // Crea un contenido personalizado para el infoWindow
            var contenidoInfoWindow = '<h3>' + comuna.nombre + '</h3>' +
                '<p>Información adicional sobre ' + comuna.nombre + '</p>';

            // Crea el infoWindow y asócialo con el marcador
            var infoWindow = new google.maps.InfoWindow({
                content: contenidoInfoWindow
            });

            // Agrega un evento de clic al marcador para mostrar el infoWindow
            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
        })();
    }
 }
