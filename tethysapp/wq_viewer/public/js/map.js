/*****************************************************************************
 * FILE:    MAP JS
 * DATE:    30 October 2017
 * AUTHOR: Sarva Pulla
 * COPYRIGHT: (c) SERVIR GLOBAL 2017
 * LICENSE: BSD 2-Clause
 *****************************************************************************/

/*****************************************************************************
 *                      LIBRARY WRAPPER
 *****************************************************************************/

var LIBRARY_OBJECT = (function() {
    // Wrap the library in a package function
    "use strict"; // And enable strict mode for this library

    /************************************************************************
     *                      MODULE LEVEL / GLOBAL VARIABLES
     *************************************************************************/
    var map,
        public_interface,
        product,
        start_time,
        end_time,
        userPolygon,
        drawing_polygon;

    /************************************************************************
     *                    PRIVATE FUNCTION DECLARATIONS
     *************************************************************************/

    var init_all,
        init_events,
        init_vars,
        init_map;

    /************************************************************************
     *                    PRIVATE FUNCTION IMPLEMENTATIONS
     *************************************************************************/

    init_vars = function(){
        // wq_mapid = $('#layers').attr('data-water-mapid');
        // wq_token = $('#layers').attr('data-water-token');
        // var $layers_element = $('#layers');
        // $loading = $('#spinner');
        // var $var_element = $("#variable");
        // // variable_data = $var_element.attr('data-variable-info');
        // // variable_data = JSON.parse(variable_data);
        // gs_wms_url = $var_element.attr('data-geoserver-url');
        // // wms_url = JSON.parse(wms_url);
        // gs_wms_workspace = $var_element.attr('data-geoserver-workspace');
        // jason2_store = $var_element.attr('data-jason2-store');
        // saral_store = $var_element.attr('data-saral-store');
        //
        // $chartModal = $("#chart-modal");

    };

    init_map = function(){

        map = L.map('map',{
          center: [-0.5,35],
          zoom: 8,
          minZoom:2,
          maxZoom: 16,
          maxBounds: [
           [-120, -220],
           [120, 220]
         ],
        });

        // Initialise the FeatureGroup to store editable layers
        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);

        var drawPluginOptions = {
          draw: {
            polygon: {
              allowIntersection: false, // Restricts shapes to simple polygons
              drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
              },
              shapeOptions: {
                color: '#97009c'
              }
            },
            // disable toolbar item by setting it to false
            polyline: false,
            circle: false, // Turns off this drawing tool
            circlemarker: false,
            rectangle: true,
            marker: false,
            },
          edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: false
          }
        };

        // Initialise the draw control and pass it the FeatureGroup of editable layers
        var drawControl = new L.Control.Draw(drawPluginOptions);
        map.addControl(drawControl);

        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);

        map.on('draw:created', function(e) {
          editableLayers.clearLayers();
          var type = e.layerType,
            layer = e.layer;

          if (type === 'marker') {
            layer.bindPopup('A popup!');
          }
          userPolygon = layer.toGeoJSON();
          drawing_polygon = JSON.stringify(userPolygon.geometry.coordinates[0]);


          editableLayers.addLayer(layer);
        });

          var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
                attribution: '©OpenStreetMap, ©CartoDB'
              }).addTo(map);
            };

    init_events = function() {

    };

    init_all = function(){
        init_vars();
        init_map();
        init_events();
    };


    /************************************************************************
     *                        DEFINE PUBLIC INTERFACE
     *************************************************************************/
    /*
     * Library object that contains public facing functions of the package.
     * This is the object that is returned by the library wrapper function.
     * See below.
     * NOTE: The functions in the public interface have access to the private
     * functions of the library because of JavaScript function scope.
     */
    public_interface = {

    };

    /************************************************************************
     *                  INITIALIZATION / CONSTRUCTOR
     *************************************************************************/

    // Initialization: jQuery function that gets called when
    // the DOM tree finishes loading

    $(function() {
        init_all();

        // function to get parameters from user and update mapid and token
        $('[name="update-button"]').on("click",function(){
          product = $("#product_selection").val()
          start_time = $("#time_start").val()
          end_time = $("#time_end").val()
          console.log(product,start_time,end_time)
        });

        // funtion to get parameters from users and request timeseries
        $('[name="timeseries-button"]').on("click",function(){
          product = $("#product_selection").val()
          start_time = $("#time_start").val()
          end_time = $("#time_end").val()
          console.log(drawing_polygon)
        });
    });

    return public_interface;

}()); // End of package wrapper
// NOTE: that the call operator (open-closed parenthesis) is used to invoke the library wrapper
// function immediately after being parsed.
