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

import { apply } from 'ol-mapbox-style';

import 'ol/ol.css';

var map = apply(
  'map',
  'data/map.geojson'
);

var searchResult = new VectorLayer({
  zIndex: 1
});
map.addLayer(searchResult);

new AutoComplete({
  selector: 'input[name="q"]',
  source: function (term, response) {
    var source = new VectorSource({
      format: new GeoJSON(),
      url: 'https://photon.komoot.de/api/?q=' + term
    });
    source.on('change', function() {
      var texts = source.getFeatures().map(function (feature) {
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
