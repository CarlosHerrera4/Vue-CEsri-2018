require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/core/watchUtils",
    "vue"
], function (
    Map, SceneView,
    watchUtils,
    Vue
) {
    debugger

    const map = new Map({
        basemap: "hybrid",
        ground: "world-elevation"
    });

    const initialCamera = {
        position: [7.654, 45.919, 5184],
        tilt: 80,
        heading: 0
    };

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
        // template: '#blog-card',
        template: [

        "<div class='card' style='width: 18rem;'>",
            "<img class='card-img-top' src='...' alt='Card image cap'>",
            "<div class='card-body'>",
                "<h5 class='card-title'>{{ event.name }}</h5>",
               " <p class='card-text'>Some quick example text to build on the card title and make up the bulk of the card's content.</p>",
                "<a href='#' class='btn btn-primary'>Go somewhere</a>",
            "</div>",
        "</div>"
            
        ].join(""),
        props: {
            event: Object
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