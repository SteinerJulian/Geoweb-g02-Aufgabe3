import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import Stamen from 'ol/source/stamen';
import VectorLayer from 'ol/layer/vector';
import Vector from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson';
import Style from 'ol/style/style';
import Text from 'ol/style/text';
import Stroke from 'ol/style/stroke';
import proj from 'ol/proj';
import Map from 'ol/map';
//import 'javascript-autocomplete/auto-complete.css';
//import AutoComplete from 'javascript-autocomplete';


import {
  apply
} from 'ol-mapbox-style';

import 'ol/ol.css';

apply('map', 'style.json');

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://photon.komoot.de/api/?q=Wien+Karlsplatz+13');
xhr.onload = function() {
  var json = JSON.parse(xhr.responseText);
  console.log(json);
};
xhr.send();

const map = new Map({
  target: 'map',
  view: new View({
    center: proj.fromLonLat([16.37, 48.2]),
    zoom: 13
  })
});
map.addLayer(new TileLayer({
  source: new Stamen({
    layer: 'watercolor'
  })
}));

const layer = new VectorLayer({
  source: new Vector({
    url: 'data/map.geojson',
    format: new GeoJSON()
  })
});
map.addLayer(layer);

layer.setStyle(function(feature) {
  return new Style({
    text: new Text({
      text: feature.get('name'),
      font: 'Bold 14pt Verdana',
      stroke: new Stroke({
        color: 'white',
        width: 3
      })
    })
  });
});

var searchResult = new VectorLayer({
  zIndex: 1
});
map.addLayer(searchResult);

//new AutoComplete({
//  selector: 'input[name="q"]',
//  source: function(term, response) {
//    var source = new VectorSource({
//      format: new GeoJSON(),
//      url: 'https://photon.komoot.de/api/?q=' + term
  //  });
    //source.on('change', function() {
  //    var texts = source.getFeatures().map(function(feature) {
  //      var properties = feature.getProperties();
  //      return (properties.city || properties.name || '') + ', ' +
  //        (properties.street || '') + ' ' +
  //        (properties.housenumber || '');
  //    });
  //    response(texts);
  //    map.getView().fit(source.getExtent(), {
  //      maxZoom: 19,
  //      duration: 250
//      });
//    });
//    searchResult.setSource(source);
  //}
// });
