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
        $loading,
        sensor,
        product,
        start_time,
        end_time,
        userPolygon,
        drawing_polygon,
        wq_layer,
        $chartModal,
        chart;

    /************************************************************************
     *                    PRIVATE FUNCTION DECLARATIONS
     *************************************************************************/

    var init_all,
        init_events,
        init_vars,
        init_map,
        map_request,
        timeseries_request,
        download_request,
        plot_data;

    /************************************************************************
     *                    PRIVATE FUNCTION IMPLEMENTATIONS
     *************************************************************************/

    init_vars = function(){
        $loading = $('#loader');
        $chartModal = $("#chart-modal");
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
            rectangle: {
              shapeOptions: {
                color:'#97009c',
              }
            },
            marker: true,
          },
          edit: {
            featureGroup: editableLayers, //REQUIRED!!
            edit: false,
            remove: false,
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

          userPolygon = layer.toGeoJSON();


          if (type === 'marker') {
            drawing_polygon = JSON.stringify(userPolygon.geometry.coordinates);
            layer.bindPopup(drawing_polygon.toString().replace('[','').replace(']',''));
          }
          else {
            drawing_polygon = JSON.stringify(userPolygon.geometry.coordinates[0]);
          }


          editableLayers.addLayer(layer);
        });

        map.on('draw:deleted', function(e) {
          editableLayers.clearLayers();
        });

        var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
          attribution: '©OpenStreetMap, ©CartoDB'
        }).addTo(map);

        wq_layer = L.tileLayer('',{attribution:
          '<a href="https://earthengine.google.com" target="_">' +
          'Google Earth Engine</a>;'}).addTo(map)


        sensor = $("#sensor_selection").val()
        product = $("#product_selection").val()
        start_time = $("#time_start").val()
        end_time = $("#time_end").val()

        map_request({'sensor':sensor,'product':product,'start_time':start_time,'end_time':end_time},wq_layer)
    };

    init_events = function() {

      map_request = function(data_dict,layer){
        $loading.css('display',"inline-block");
        var xhr = $.ajax({
            type: "POST",
            url: 'get_map/',
            dataType: "json",
            data: data_dict
        });
          xhr.done(function(data) {
            if("success" in data) {
              layer.setUrl(data.url)
              $loading.css('display','none');
            }else{
              $loading.css('display','none');
              alert('Opps, there was a problem processing the request. Please see the following error: '+data.error);
            }
          });
        return
      }

      timeseries_request = function(data_dict){
        $loading.css('display',"inline-block");
        console.log(data_dict)
        var xhr = $.ajax({
            type: "POST",
            url: 'get_timeseries/',
            dataType: "json",
            data: data_dict
        });
          xhr.done(function(data) {
            if("success" in data) {
              $loading.css('display','none');
              // console.log(data)
              $("#plotter").removeClass('hidden');
              $chartModal.modal('show');
              plot_data(data)
            }else{
              $loading.css('display','none');
              alert('Opps, there was a problem processing the request. Please see the following error: '+data.error);
            }
          });
        return
      }

      plot_data = function(data){
        // if(data.values.length > 0){
          chart = Highcharts.stockChart('plotter',{
              chart: {
                  // type:'spline',
                  zoomType: 'x',
                  height: 350,
              },
              title: {
                  text:" ",
                  style: {
                      fontSize: '14px'
                  }
              },
              tooltip: {
                  pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                  valueDecimals: 2,
                  split: true
              },
              xAxis: {
                  type: 'datetime',
                  dateTimeLabelFormats: { // don't display the dummy year
                      month: '%e. %b',
                      year: '%b'
                  },
                  title: {
                      text: 'Date'
                  }
              },
              yAxis: {
                  title: {
                      text: data.label
                  }

              },
              exporting: {
                  enabled: true
              },
              series: data.values,
              credits:{
                enabled: false
              }
          });
        // }
        // else{
        //     $('.warning').html('<b>Sorry! There are no data values for the selected points. Please try another site.</b>');
        //     // $loading.addClass('hidden');
        //     $loading.css('display','none');
        //     $("#plotter").addClass('hidden');
        // }
      }

      download_request = function(data_dict){
        $loading.css('display',"inline-block");
        console.log(data_dict)
        var xhr = $.ajax({
            type: "POST",
            url: 'get_download/',
            dataType: "json",
            data: data_dict
        });
          xhr.done(function(data) {
            if("success" in data) {
              $loading.css('display','none');
              window.open(data.url,'_blank')
            }else{
              $loading.css('display','none');
              alert('Opps, there was a problem processing the request. Please see the following error: '+data.error);
            }
          });
        return


        return null
      }

    };

    init_all = function(){
        init_events();
        init_vars();
        init_map();
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

        // function to get product parameter from user and update mapid and token
        $("#product_selection").on("change",function(){
          product = $("#product_selection").val()
          map_request({'sensor':sensor,'product':product,'start_time':start_time,'end_time':end_time},wq_layer)
        });

        // function to get start time parameter from user and update mapid and token
        $("#time_start").on("change",function(){
          start_time = $("#time_start").val()
          map_request({'sensor':sensor,'product':product,'start_time':start_time,'end_time':end_time},wq_layer)
        });

        // function to get end time parameter from user and update mapid and token
        $("#time_end").on("change",function(){
          end_time = $("#time_end").val()
          map_request({'sensor':sensor,'product':product,'start_time':start_time,'end_time':end_time},wq_layer)
        });

        // funtion to get parameters from users and request timeseries
        $('[name="timeseries-button"]').on("click",function(){
          if (drawing_polygon){
            timeseries_request({'sensor':sensor,'product':product,'start_time':start_time,'end_time':end_time,'coords':drawing_polygon,'scale':map.getZoom()})
          }
          else {
            alert('Opps, we need a geometry to calculate the time series. Please provide a geometry on the map and try again.')
          }
        });

        // funtion to get parameters from users and request download
        $('[name="download-button"]').on("click",function(){
          if (drawing_polygon){
            download_request({'sensor':sensor,'product':product,'start_time':start_time,'end_time':end_time,'coords':drawing_polygon,'scale':map.getZoom()})
          }
          else {
            alert('Opps, we need a polygon to calculate the time series. Please provide a geometry on the map and try again.')
          }
        });
    });

    return public_interface;

}()); // End of package wrapper
// NOTE: that the call operator (open-closed parenthesis) is used to invoke the library wrapper
// function immediately after being parsed.
