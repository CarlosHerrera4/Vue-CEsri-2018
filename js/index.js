require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/SceneLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",

    "esri/symbols/PointSymbol3D",
    "esri/symbols/IconSymbol3DLayer",

    "dojo/_base/array",

    "esri/core/watchUtils",
    "vue"
], function (
    Map, SceneView, SceneLayer, GraphicsLayer, Graphic,
    PointSymbol3D, IconSymbol3DLayer,
    array,
    watchUtils,
    Vue
) {

    const map = new Map({
        basemap: "streets-night-vector"
    });
    this.map = map;

    const initialCamera = {
        position: [-3.70, 40.4, 5184],
        tilt: 80,
        heading: 0  
    };

    const layer = new SceneLayer({
        url: "https://tiles.arcgis.com/tiles/g60HdxU2rDSe4oky/arcgis/rest/services/Madrid3DSinT/SceneServer/layers/0"
    });
    // map.add(layer);

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: initialCamera
    });

    const data = this.data;

    // Create Vue component to show cards 
    Vue.component('blog-card', {
        template: [
        "<div class='card' style='width: 18rem;'  v-on:mouseover='functionHover()'>",
            // "<img class='card-img-top' src='{{ event.place.city.photo }}' alt='Card image cap'>",
            "<div class='card-body'>",
                "<h5 class='card-title'>{{ event.name }}</h5>",
               " <p class='card-text'>{{ event.description }}</p>",
                "<a href='#' v-on:click='goTo' class='btn btn-primary'>Ir al sitio</a>",
                // "<a href='#' v-on:click='showModal' data-toggle='modal' data-target='hola' class='btn btn-primary'>Más información</a>",
            "</div>",
        "</div>"

        ].join(""),
        props: {
            event: Object
        },
        methods: {
            goTo: function () {
                const newCamera = {
                    position: [this.event.place.city.longitude, this.event.place.city.latitude, 5184],
                    tilt: 80,
                    heading: 0
                };
                var camera = view.camera.clone();
                camera.set(newCamera);
                view.goTo(camera);
            },

            functionHover: function () {
                console.log("Funciona")
            }

        }
    });
   

    view.when(function () {

        const _info = new Vue({
            el: '#container',
            data: {
                events: data
            }
        });

        const graphicsLayer = new GraphicsLayer();
        this.map.add(graphicsLayer)

        // Add graphics points for event
        array.forEach(this.data, function(data, index) {
            let point = {
                type: "point", // autocasts as new Point()
                x: data.place.city.longitude,
                y: data.place.city.latitude,

                z: 1000
            };
            let markerSymbol = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [226, 119, 40],
                outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 2
                }
            };
            let pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
            });

            let polyline = {
                type: "polyline", // autocasts as new Polyline()
                paths: [
                    [data.place.city.longitude, data.place.city.latitude, 0],
                    [data.place.city.longitude, data.place.city.latitude, 1000]
                ]
            };
            let lineSymbol = {
                type: "simple-line", // autocasts as SimpleLineSymbol()
                color: [226, 119, 40],
                width: 4
            };

            let polylineGraphic = new Graphic({
                geometry: polyline,
                symbol: lineSymbol
            });


            graphicsLayer.add(pointGraphic);
            graphicsLayer.add(polylineGraphic);
        });

    });
});