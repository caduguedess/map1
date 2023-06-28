	const map = L.map('map').setView([-12, 17], 5);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	// control that shows state info on hover
	const info = L.control();

	info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update(1);
  return this._div;
};

info.update = function (tipo, props) {
  if (tipo == 1) {
    const contents = props ? 
      'Província: <b>' + props.STATE_NAME + '</b><br>Clique em uma província' : 'Passe o mouse sobre uma província';
    this._div.innerHTML = `<h4>Províncias</h4>${contents}`;
    }
  else {
    const contents = props ? `<b>${props.VARNAME} Multas na cidade <b>${props.CITY_NAME} ` : 'Passe o mouse sobre uma cidade';
    this._div.innerHTML = `<h4>Cidades</h4>${contents}`;
  }
}; 
info.addTo(map);

function getColor(d) {
  return d > 1000 ? '#800026' :
    d > 500  ? '#BD0026' :
    d > 200  ? '#E31A1C' :
    d > 100  ? '#FC4E2A' :
    d > 50   ? '#FD8D3C' :
    d > 20   ? '#FEB24C' :
    d > 10   ? '#FED976' : '#FFEDA0';
}

function getColorStates(d) {
  if (d.properties.STATE_NAME == 'Bengo') {
    return 'blue'
  }
  return d.properties.ID_0 > 1000 ? '#800026' :
    d.properties.ID_0 > 500  ? '#BD0026' :
    d.properties.ID_0 > 200  ? '#E31A1C' :
    d.properties.ID_0 > 100  ? '#FC4E2A' :
    d.properties.ID_0 > 50   ? '#FD8D3C' :
    d.properties.ID_0 > 20   ? '#FEB24C' :
    d.properties.ID_0 > 10   ? '#FED976' : '#FFEDA0';
}

function getVarStates(estado, cidade) {
  return d > 1000 ? '#800026' :
    d > 500  ? '#BD0026' :
    d > 200  ? '#E31A1C' :
    d > 100  ? '#FC4E2A' :
    d > 50   ? '#FD8D3C' :
    d > 20   ? '#FEB24C' :
    d > 10   ? '#FED976' : '#FFEDA0';
}

function provinciastyle(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'blue',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColorStates(feature)
 };
}


function highlightState(e) {
  const layer = e.target;

  layer.setStyle({
    weight: 5,
    color: 'blue',
    dashArray: '',
    fillColor: 'blue',
    fillOpacity: 0.3
  });

  layer.bringToFront();

  info.update(1, layer.feature.properties);
}

function resetState(e) {
  provinciasLayer.resetStyle(e.target);
  info.update(1);
}

var selectedState = '';

function zoomToState(e) {
  var layer = e.target;
  map.fitBounds(layer.getBounds());
  selectedState = layer.feature.properties.STATE_NAME;
  cidadesLayer.clearLayers();
  cidadesLayer.addData(cidades);
}

function onEachState(feature, layer) {
  layer.on({
    mouseover: highlightState,
    mouseout: resetState,
    click: zoomToState
  });
}

var provinciasLayer = L.geoJson(provincias, {
  style: provinciastyle,
  onEachFeature: onEachState,
}).addTo(map);

function cityStyle(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.VARNAME)
  };
}

function cityFilter(feature) {
  return (feature.properties.STATE_NAME === selectedState);
}

function highlightCity(e) {
  const layer = e.target;

  layer.setStyle({
    weight: 5,
    color: 'blue',
    dashArray: '',
    fillOpacity: 0.7
  });

  layer.bringToFront();

  info.update(2, layer.feature.properties);
}

function zoomToCity(e) {
  map.fitBounds(e.target.getBounds());
}

function resetCity(e) {
  cidadesLayer.resetStyle(e.target);
  info.update();
}

function onEachCity(feature, layer) {
  layer.on({
    mouseover: highlightCity,
    mouseout: resetCity,
    click: zoomToCity
  });
}

var cidadesLayer = L.geoJson(cidades, {
  style: cityStyle,
  onEachFeature: onEachCity,
  filter: cityFilter
}).addTo(map);

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
  const labels = [];
  let from, to;
  for (let i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];
    labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
  }
  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);

const legend2 = L.control({position: 'bottomright'});

legend2.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend2');
  const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
  const labels = [];
  let from, to;
  for (let i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];
    labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
  }
  div.innerHTML = labels.join('<br>');
  return div;
};

legend2.addTo(map);
