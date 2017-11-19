import 'ol/ol.css';
import 'javascript-autocomplete/auto-complete.css';
import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZSource from 'ol/source/xyz';
import proj from 'ol/proj';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Style from 'ol/style/style';
import IconStyle from 'ol/style/icon';
import Overlay from 'ol/overlay';
import GeoJSON from 'ol/format/geojson';
import {
  apply
} from 'ol-mapbox-style';
import AutoComplete from 'javascript-autocomplete';


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZSource({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
      })
    })
  ]
})

const position = new VectorSource();
const vector = new VectorLayer({
  source: position
});

var searchResult = new VectorLayer({
  zIndex: 1
});
map.addLayer(searchResult);

new AutoComplete({
  selector: 'input[name="q"]',
  source: function(term, response) {
    var source = new VectorSource({
      format: new GeoJSON(),
      url: 'https://photon.komoot.de/api/?q=' + term
    });
    source.on('change', function() {
      var texts = source.getFeatures().map(function(feature) {
        var properties = feature.getProperties();
        return (properties.city || properties.name || '') + ', ' +
          (properties.street || '') + ' ' +
          (properties.housenumber || '');
      });
      response(texts);
      map.getView().fit(source.getExtent(), {
        maxZoom: 19,
        duration: 250
      });
    });
    searchResult.setSource(source);
  }
});

vector.setStyle(new Style({
  image: new IconStyle({
    src: './data/marker.png'
  })
}));
map.addLayer(vector);

//! geolocation beim erstladen
navigator.geolocation.getCurrentPosition(function(pos) {
  const coords = proj.fromLonLat([pos.coords.longitude, pos.coords.latitude]);
  map.getView().animate({
    center: coords,
    zoom: 13
  });
  position.addFeature(new Feature(new Point(coords)));
});

//! Pop-up bei Klick

var overlay = new Overlay({
  element: document.getElementById('popup-container'),
  positioning: 'bottom-center',
  offset: [0, -10]
});

map.addOverlay(overlay);

map.on('click', function(e) {
  overlay.setPosition();
  var features = map.getFeaturesAtPixel(e.pixel);
  if (features) {
    overlay.getElement().innerHTML = 'Meine Position';
    overlay.setPosition(e.coordinate);
  }
});
