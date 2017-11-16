import 'ol/ol.css';
import 'javascript-autocomplete/auto-complete.css';
import proj from 'ol/proj';
import GeoJSON from 'ol/format/geojson';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import { apply } from 'ol-mapbox-style';
import AutoComplete from 'javascript-autocomplete';

var map = apply(
  'map',
  'https://gist.githubusercontent.com/anonymous/efb8d2ab014796b45817954ed4e188ba/raw/4e15466382a261a6e7da9cecfc34c5dc05f28525/style.json'
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
