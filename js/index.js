require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/SceneLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",

    "esri/symbols/PointSymbol3D",
    "esri/symbols/IconSymbol3DLayer",

    "esri/core/watchUtils",
    "vue"
], function (
    Map, SceneView, SceneLayer, GraphicsLayer, Graphic,
    PointSymbol3D, IconSymbol3DLayer,
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

    var layer = new SceneLayer({
        url: "https://tiles.arcgis.com/tiles/g60HdxU2rDSe4oky/arcgis/rest/services/Madrid3DSinT/SceneServer/layers/0"
    });
    // map.add(layer);

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: initialCamera
    });

    var data = this.data;

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
            
            showCard: function () {

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
        for (i=0; i< this.data.length; i++) {

            var point = {
                type: "point", // autocasts as new Point()
                x: this.data[i].place.city.longitude,
                y: this.data[i].place.city.latitude,
                z: 1000
            };
            markerSymbol = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [226, 119, 40],
                outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 2
                }
            };
            var pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
            });

            var polyline = {
                type: "polyline", // autocasts as new Polyline()
                paths: [
                    [this.data[i].place.city.longitude, this.data[i].place.city.latitude, 0],
                    [this.data[i].place.city.longitude, this.data[i].place.city.latitude, 1000]
                ]
            };
            lineSymbol = {
                type: "simple-line", // autocasts as SimpleLineSymbol()
                color: [226, 119, 40],
                width: 4
            };

            var polylineGraphic = new Graphic({
                geometry: polyline,
                symbol: lineSymbol
            });


            graphicsLayer.add(pointGraphic);
            graphicsLayer.add(polylineGraphic);
        }

    });
});