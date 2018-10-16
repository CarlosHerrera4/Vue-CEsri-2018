require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/SceneLayer",

    "esri/symbols/PointSymbol3D",
    "esri/symbols/IconSymbol3DLayer",

    "esri/core/watchUtils",
    "vue"
], function (
    Map, SceneView, SceneLayer, PointSymbol3D, IconSymbol3DLayer,
    watchUtils,
    Vue
) {

    const map = new Map({
        basemap: "streets-night-vector"
    });

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
        "<div class='card' style='width: 18rem;'>",
            // "<img class='card-img-top' src='{{ event.place.city.photo }}' alt='Card image cap'>",
            "<div class='card-body'>",
                "<h5 class='card-title'>{{ event.name }}</h5>",
               " <p class='card-text'>{{ event.description }}</p>",
                "<a href='#' v-on:click='goTo' class='btn btn-primary'>Ir al sitio</a>",
                // "<a href='#' v-on:click='showModal' data-toggle='modal' data-target='hola' class='btn btn-primary'>Más información</a>",
            "</div>",
        "</div>"

        // "<div class='modal fade' v-bind:id='{{ event.id }}' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>",
        //     "<div class='modal-dialog' role='document'>",
        //         "<div class='modal-content'>",
        //         "<div class='modal-header'>",
        //             "<h5 class='modal-title' id='exampleModalLabel'>Modal title</h5>",
        //             "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>",
        //             "<span aria-hidden='true'>&times;</span>",
        //             "</button>",
        //         "</div>",
        //         "<div class='modal-body'>",
        //         "</div>",
        //         "<div class='modal-footer'>",
        //             "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>",
        //             "<button type='button' class='btn btn-primary'>Save changes</button>",
        //         "</div>",
        //         "</div>",
        //     "</div>",
        // "</div>",

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

        }
    });
   

    view.when(function () {
        var pointSymbol3D = new PointSymbol3D({
            symbolLayers: [new IconSymbol3DLayer({
                outline: {
                    color: [56, 168, 0, 1]
                }
            })]
        });

        const _info = new Vue({
            el: '#container',
            data: {
                events: data
            }
        });

    });
});