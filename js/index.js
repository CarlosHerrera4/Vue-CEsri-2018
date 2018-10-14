require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/SceneLayer",
    "esri/core/watchUtils",
    "vue"
], function (
    Map, SceneView, SceneLayer,
    watchUtils,
    Vue
) {
    debugger

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

    // Create a Vue component
    Vue.component("camera-info", {
        props: ["camera"],
        template: [
            "<div>",
            "<h2>Camera Details</h2>",
            "<p><strong>Heading</strong>: {{ camera.heading.toFixed(3) }}</p>",
            "<p><strong>Tilt</strong>: {{ camera.tilt.toFixed(3) }}</p>",
            "<p><strong>Latitude</strong>: {{ camera.position.latitude.toFixed(3) }}</p>",
            "<p><strong>Longitude</strong>: {{ camera.position.longitude.toFixed(3) }}</p>",
            "<button v-on:click='reset'>Reset Camera</button>",
            "</div>"
        ].join(""),
        methods: {
            reset: function () {
                var camera = this.camera.clone();
                camera.set(initialCamera);
                view.goTo(camera);
            }
        }
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

        const info = new Vue({
            el: "#info",
            data: {
                camera: view.camera
            }
        });
        view.ui.add(info.$el, "top-right");
        watchUtils.watch(view, "camera", function () {
            info.camera = view.camera;
        });
    });
});