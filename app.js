let currentCountryLayer = null;   // Holder styr på det aktive laget for land
let currentContinentLayer = null; // Holder styr på det aktive laget for kontinent
let currentMaskLayer = null;      // Holder styr på maskelaget (mørklegging)
let activeSelectedCountry = null; // Lagrer det aktive landet for isolasjonsknappen
let showBorders = true;
let worldGeoJsonData = null;      // Lagrer global GeoJSON i minnet
let geoJsonData = null;
let isOpeningGlobe = false; // Hindrer at tilbakemeldinger fra iframe lukker vinduet med en gang

const TILE_LAYERS = {
  standard: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
  }),
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
  }),
  topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; OpenStreetMap contributors | Style: &copy; OpenTopoMap',
    maxZoom: 17
  })
};

const CONTINENT_MAP = {
  'europe': { names: ['europa', 'europe'], lat: 56.5, lng: 18.0, zoom: 4.3 },
  'asia': { names: ['asia'], lat: 45.0, lng: 95.0, zoom: 3.3 },
  'africa': { names: ['afrika', 'africa'], lat: 2.0, lng: 18.0, zoom: 3.8 },
  'north-america': { names: ['nord-amerika', 'north america', 'north-america'], lat: 48.0, lng: -100.0, zoom: 3.5 },
  'south-america': { names: ['sør-amerika', 'south america', 'south-america'], lat: -26.0, lng: -60.0, zoom: 3.8 },
  'oceania': { names: ['oseania', 'oceania', 'australia'], lat: -23.5, lng: 152.0, zoom: 3.9 },
  'antarctica': { names: ['antarktis', 'antarctica'], lat: -82.8628, lng: 135.0000, zoom: 2 }
};

let map;
let currentTileLayer;
let markersLayer = L.layerGroup();
let countriesData = [];

// Ytre grenser for verden [lng, lat]
const WORLD_OUTER_BOUNDS = [
  [-180, 90],
  [180, 90],
  [180, -90],
  [-180, -90],
  [-180, 90]
];

// Bounding Polygon for Europeisk Tyrkia (Øst-Thrakia)
const EUROPE_TURKEY_BBOX = turf.polygon([[
  [25.0, 40.0],
  [29.2, 40.0],
  [29.2, 42.2],
  [25.0, 42.2],
  [25.0, 40.0]
]]);

// Fullstendig ISO3 til ISO2 kartlegging for alle land i verden
const ISO3_TO_ISO2_MAP = {
  'afg': 'af', 'alb': 'al', 'dza': 'dz', 'and': 'ad', 'ago': 'ao', 'atg': 'ag', 'arg': 'ar', 'arm': 'am', 'aus': 'au', 'aut': 'at',
  'aze': 'az', 'bsm': 'bs', 'bhr': 'bh', 'bgd': 'bd', 'brb': 'bb', 'blr': 'by', 'bel': 'be', 'blz': 'bz', 'ben': 'bj', 'btn': 'bt',
  'bol': 'bo', 'bih': 'ba', 'bwa': 'bw', 'bra': 'br', 'brn': 'bn', 'bgr': 'bg', 'bfa': 'bf', 'bdi': 'bi', 'khm': 'kh', 'cmr': 'cm',
  'can': 'ca', 'cpv': 'cv', 'caf': 'cf', 'tcd': 'td', 'chl': 'cl', 'chn': 'cn', 'col': 'co', 'com': 'km', 'cog': 'cg', 'cod': 'cd',
  'cri': 'cr', 'civ': 'ci', 'hrv': 'hr', 'cub': 'cu', 'cyp': 'cy', 'cze': 'cz', 'dnk': 'dk', 'dji': 'dj', 'dma': 'dm', 'dom': 'do',
  'ecu': 'ec', 'egy': 'eg', 'slv': 'sv', 'gnq': 'gq', 'eri': 'er', 'est': 'ee', 'swz': 'sz', 'eth': 'et', 'fji': 'fj', 'fin': 'fi',
  'fra': 'fr', 'gab': 'ga', 'gmb': 'gm', 'geo': 'ge', 'deu': 'de', 'gha': 'gh', 'grc': 'gr', 'grd': 'gd', 'gtm': 'gt', 'gin': 'gn',
  'gnb': 'gw', 'guy': 'gy', 'hti': 'ht', 'hnd': 'hn', 'hun': 'hu', 'isl': 'is', 'ind': 'in', 'idn': 'id', 'irn': 'ir', 'irq': 'iq',
  'irl': 'ie', 'isr': 'il', 'ita': 'it', 'jam': 'jm', 'jpn': 'jp', 'jor': 'jo', 'kaz': 'kz', 'ken': 'ke', 'kir': 'ki', 'prk': 'kp',
  'kor': 'kr', 'kwt': 'kw', 'kgz': 'kg', 'lao': 'la', 'lva': 'lv', 'lbn': 'lb', 'lso': 'ls', 'lbr': 'lr', 'lby': 'ly', 'lie': 'li',
  'ltu': 'lt', 'lux': 'lu', 'mdg': 'mg', 'mwi': 'mw', 'mys': 'my', 'mdv': 'mv', 'mli': 'ml', 'mlt': 'mt', 'mhl': 'mh', 'mrt': 'mr',
  'mus': 'mu', 'mex': 'mx', 'fsm': 'fm', 'mda': 'md', 'mco': 'mc', 'mng': 'mn', 'mne': 'me', 'mar': 'ma', 'moz': 'mz', 'mmr': 'mm',
  'nam': 'na', 'nru': 'nr', 'npl': 'np', 'nld': 'nl', 'nzl': 'nz', 'nic': 'ni', 'ner': 'ne', 'nga': 'ng', 'mkd': 'mk', 'nor': 'no',
  'omn': 'om', 'pak': 'pk', 'plw': 'pw', 'pan': 'pa', 'png': 'pg', 'pry': 'py', 'per': 'pe', 'phl': 'ph', 'pol': 'pl', 'prt': 'pt',
  'qat': 'qa', 'rou': 'ro', 'rus': 'ru', 'rwa': 'rw', 'kna': 'kn', 'lca': 'lc', 'vct': 'vc', 'wsm': 'ws', 'smr': 'sm', 'stp': 'st',
  'sau': 'sa', 'sen': 'sn', 'srb': 'rs', 'syc': 'sc', 'sle': 'sl', 'sgp': 'sg', 'svk': 'sk', 'svn': 'si', 'slb': 'sb', 'som': 'so',
  'zaf': 'za', 'ssd': 'ss', 'esp': 'es', 'lka': 'lk', 'sdn': 'sd', 'sur': 'sr', 'swe': 'se', 'che': 'ch', 'syr': 'sy', 'twn': 'tw',
  'tjk': 'tj', 'tza': 'tz', 'tha': 'th', 'tls': 'tl', 'tgo': 'tg', 'ton': 'to', 'tto': 'tt', 'tun': 'tn', 'tur': 'tr', 'tkm': 'tm',
  'tuv': 'tv', 'uga': 'ug', 'ukr': 'ua', 'are': 'ae', 'gbr': 'gb', 'usa': 'us', 'ury': 'uy', 'uzb': 'uz', 'vut': 'vu', 'ven': 've',
  'vnm': 'vn', 'yem': 'ye', 'zmb': 'zm', 'zwe': 'zw'
};

// Robust funksjon for å hente ut ISO2-kode uansett datagrunnlag
function getIso2Code(country) {
  if (!country) return '';
  if (country.iso2 && typeof country.iso2 === 'string' && country.iso2.length === 2) {
    return country.iso2.toLowerCase();
  }
  const iso3 = (country.iso3 || '').toLowerCase();
  if (ISO3_TO_ISO2_MAP[iso3]) {
    return ISO3_TO_ISO2_MAP[iso3];
  }
  return iso3.length === 2 ? iso3 : '';
}

// Safe Klippefunksjon for Tyrkia/mindre land
function safeIntersect(poly1, poly2) {
  try {
    if (typeof turf.intersect === 'function') {
      return turf.intersect(turf.featureCollection([poly1, poly2])) || turf.intersect(poly1, poly2);
    }
  } catch (e) {
    try {
      return turf.intersect(poly1, poly2);
    } catch (err) {
      console.error("Turf intersect feilet:", err);
    }
  }
  return null;
}

function safeDifference(poly1, poly2) {
  try {
    if (typeof turf.difference === 'function') {
      return turf.difference(turf.featureCollection([poly1, poly2])) || turf.difference(poly1, poly2);
    }
  } catch (e) {
    try {
      return turf.difference(poly1, poly2);
    } catch (err) {
      console.error("Turf difference feilet:", err);
    }
  }
  return null;
}

// Fjern og nullstill aktive vektorlag på kartet
function clearActiveLayers() {
  if (currentCountryLayer && map.hasLayer(currentCountryLayer)) {
    map.removeLayer(currentCountryLayer);
  }
  if (currentContinentLayer && map.hasLayer(currentContinentLayer)) {
    map.removeLayer(currentContinentLayer);
  }
  if (currentMaskLayer && map.hasLayer(currentMaskLayer)) {
    map.removeLayer(currentMaskLayer);
  }
  currentCountryLayer = null;
  currentContinentLayer = null;
  currentMaskLayer = null;
  activeSelectedCountry = null;
}

async function loadWorldGeoJson() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson?v=' + Date.now());
    if (!response.ok) throw new Error('Kunne ikke laste GeoJSON');
    
    const data = await response.json();
    worldGeoJsonData = data;
    geoJsonData = data;
  } catch (error) {
    console.error('Feil ved lasting av global GeoJSON:', error);
  }
}

function initMap() {
  if (typeof alleLand !== 'undefined') {
    countriesData = alleLand;
  } else if (typeof LOCAL_COUNTRIES !== 'undefined') {
    countriesData = LOCAL_COUNTRIES;
  }

  map = L.map('map', {
    center: [54, 15],
    zoom: 4,
    zoomControl: false,
    worldCopyJump: true
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  currentTileLayer = TILE_LAYERS.standard;
  currentTileLayer.addTo(map);
  markersLayer.addTo(map);

  populateCountryDropdown(countriesData);
  renderCountryMarkers(countriesData);
  
  clearActiveLayers();
}

function populateCountryDropdown(countries) {
  const select = document.getElementById('countrySelect');
  if (!select) return;

  select.innerHTML = '<option value="">Velg et land fra listen...</option>';
  const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name, 'no'));

  sorted.forEach(c => {
    const option = document.createElement('option');
    option.value = c.name;
    const iso2 = getIso2Code(c);
    const flagSymbol = c.flag || (iso2 ? iso2.toUpperCase() : '');
    option.textContent = `${flagSymbol} ${c.name}`.trim();
    select.appendChild(option);
  });
}

function findCountryFeature(country) {
  const gData = geoJsonData || worldGeoJsonData;
  if (!gData || !gData.features) return null;

  const keys = new Set();
  if (country.iso3) keys.add(country.iso3.trim().toLowerCase());
  if (country.name) keys.add(country.name.trim().toLowerCase());
  if (Array.isArray(country.matchKeys)) {
    country.matchKeys.forEach(k => k && keys.add(k.toString().trim().toLowerCase()));
  }

  const isFrenchGuiana = country.iso3 === "GUF" || 
                         keys.has("guf") || 
                         keys.has("french guiana") || 
                         keys.has("fransk guyana");

  const isFrance = !isFrenchGuiana && (
    country.iso3 === "FRA" || 
    keys.has("fra") || 
    keys.has("france") || 
    keys.has("frankrike")
  );

  function polyContainsSouthAmerica(polyCoords) {
    let coords = polyCoords;
    while (Array.isArray(coords) && Array.isArray(coords[0]) && typeof coords[0][0] !== 'number') {
      coords = coords[0];
    }
    for (let i = 0; i < coords.length; i++) {
      const pt = coords[i];
      if (Array.isArray(pt) && pt.length >= 2) {
        const lng = pt[0];
        const lat = pt[1];
        if (lng >= -56.5 && lng <= -50.0 && lat >= 1.5 && lat <= 6.5) {
          return true;
        }
      }
    }
    return false;
  }

  const matchedFeatures = [];

  gData.features.forEach(f => {
    const p = f.properties || {};
    const fId = (f.id || '').toString().trim().toLowerCase();

    const geoValues = [
      fId, p.ADM0_A3, p.adm0_a3, p.ISO_A3, p.iso_a3, p.ISO_A2, p.iso_a2,
      p.NAME, p.name, p.NAME_LONG, p.formal_en, p.BRK_NAME, p.brk_name, p.SUBUNIT, p.subunit,
      p.GU_A3, p.SOV_A3, p.ADMIN, p.admin
    ].filter(Boolean).map(v => v.toString().trim().toLowerCase());

    let hasMatch = geoValues.some(val => keys.has(val));
    if (isFrenchGuiana && geoValues.some(val => val === "fra" || val === "france")) {
      hasMatch = true;
    }

    if (hasMatch) {
      if (f.geometry && f.geometry.type === "MultiPolygon") {
        const polys = f.geometry.coordinates.filter(poly => {
          const inSA = polyContainsSouthAmerica(poly);
          return isFrenchGuiana ? inSA : (isFrance ? !inSA : true);
        });

        if (polys.length > 0) {
          matchedFeatures.push({
            type: "Feature",
            properties: f.properties,
            geometry: { type: "MultiPolygon", coordinates: polys }
          });
        }
      } else if (f.geometry && f.geometry.type === "Polygon") {
        const inSA = polyContainsSouthAmerica(f.geometry.coordinates);
        if ((isFrenchGuiana && inSA) || (isFrance && !inSA) || (!isFrenchGuiana && !isFrance)) {
          matchedFeatures.push(f);
        }
      } else {
        matchedFeatures.push(f);
      }
    }
  });

  if (matchedFeatures.length === 0) return null;
  if (matchedFeatures.length === 1) return matchedFeatures[0];

  return {
    type: "Feature",
    properties: { name: country.name, iso_a3: country.iso3 },
    geometry: {
      type: "GeometryCollection",
      geometries: matchedFeatures.map(f => f.geometry)
    }
  };
}

function renderCountryMarkers(countries) {
  markersLayer.clearLayers();

  countries.forEach(country => {
    let lat = country.lat;
    let lng = country.lng;

    if (!lat || !lng) {
      const feat = findCountryFeature(country);
      if (feat) {
        const tempLayer = L.geoJSON(feat);
        const center = tempLayer.getBounds().getCenter();
        lat = center.lat;
        lng = center.lng;
      }
    }

    if (!lat || !lng) return;

    const marker = L.marker([lat, lng], { title: country.name });

    const iso2 = getIso2Code(country);
    const flagImgHtml = iso2 
      ? `<img src="https://flagcdn.com/w40/${iso2}.png" class="w-5 h-auto rounded border border-gray-300 shadow-sm inline-block" alt="${country.name}">`
      : (country.flag || '');

    const popupContent = `
      <div class="text-gray-900 font-sans p-1">
        <h3 class="font-bold text-base flex items-center gap-1.5">${flagImgHtml} <span>${country.name}</span></h3>
        <p class="text-xs text-gray-600 mt-0.5"><b>Hovedstad:</b> ${country.capital || 'Ukjent'}</p>
        <p class="text-xs text-gray-600"><b>Befolkning:</b> ${country.population || 'Ukjent'}</p>
        <button onclick="selectCountryByName('${country.name.replace(/'/g, "\\'")}')" class="mt-2 w-full bg-sky-600 hover:bg-sky-700 text-white text-xs py-1 px-2 rounded font-medium transition">
          Vis informasjon
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);
    markersLayer.addLayer(marker);
  });
}

// Faste fokusområder (koordinater + zoom) for land med territorier langt unna fastlandet
const MAINLAND_FOCUS = {
  'FRA': { center: [46.603354, 1.888334], zoom: 5.5 },
  'FRANSKRIKE': { center: [46.603354, 1.888334], zoom: 5.5 },
  'NLD': { center: [52.132633, 5.291266], zoom: 7.2 },
  'GBR': { center: [54.5, -3.5], zoom: 5.8 },
  'USA': { center: [39.8283, -98.5795], zoom: 4.2 },
  'NOR': { center: [65.0, 13.0], zoom: 4.8 },
  'ESP': { center: [40.463667, -3.74922], zoom: 5.8 },
  'PRT': { center: [39.399872, -8.224454], zoom: 6.8 },
  'DNK': { center: [56.26392, 9.501785], zoom: 7.0 },
  'CHL': { center: [-35.675147, -71.542969], zoom: 4.5 },
  'RUS': { center: [62.0, 95.0], zoom: 3.2 }
};

function highlightAndFocusCountry(country) {
  clearActiveLayers();

  const feature = findCountryFeature(country);

  if (feature) {
    currentCountryLayer = L.geoJSON(feature, {
      style: {
        color: '#38bdf8',
        weight: 2.5,
        opacity: 0.9,
        fillColor: '#0284c7',
        fillOpacity: 0.35
      }
    });

    if (showBorders) {
      currentCountryLayer.addTo(map);
    }

    const iso3 = (country.iso3 || '').toUpperCase();
    const nameUpper = (country.name || '').toUpperCase();

    const customFocus = MAINLAND_FOCUS[iso3] || MAINLAND_FOCUS[nameUpper];

    if (customFocus) {
      map.flyTo(customFocus.center, customFocus.zoom, {
        animate: true,
        duration: 1.2
      });
    } else {
      map.fitBounds(currentCountryLayer.getBounds(), {
        padding: [10, 10],
        maxZoom: 6,
        animate: true,
        duration: 1.2
      });
    }
  } else if (country.lat && country.lng) {
    map.flyTo([country.lat, country.lng], 5, {
      animate: true,
      duration: 1.2
    });
  }
}

function filterRussiaByUral(feature, isEurope) {
  if (!feature || !feature.geometry) return feature;

  try {
    const europeClipperPoly = turf.polygon([[
      [-30.0, 30.0],
      [27.5, 40.5],
      [37.5, 44.0],
      [40.0, 43.3],
      [44.0, 42.0],
      [48.5, 41.2],
      [50.0, 44.5],
      [50.8, 46.5],
      [58.5, 50.8],
      [60.0, 55.0],
      [60.0, 63.5],
      [62.5, 65.5],
      [65.5, 67.0],
      [66.2, 68.8],
      [65.0, 70.0],
      [70.0, 77.0],
      [70.0, 85.0],
      [-30.0, 85.0],
      [-30.0, 30.0]
    ]]);

    const asiaClipperPoly = turf.polygon([[
      [27.5, 40.5],
      [37.5, 44.0],
      [40.0, 43.3],
      [44.0, 42.0],
      [48.5, 41.2],
      [50.0, 44.5],
      [50.8, 46.5],
      [58.5, 50.8],
      [60.0, 55.0],
      [60.0, 63.5],
      [62.5, 65.5],
      [65.5, 67.0],
      [66.2, 68.8],
      [65.0, 70.0],
      [70.0, 77.0],
      [70.0, 85.0],
      [180.0, 85.0],
      [180.0, 30.0],
      [27.5, 30.0],
      [27.5, 40.5]
    ]]);

    const clipper = isEurope ? europeClipperPoly : asiaClipperPoly;

    let cleanFeature = turf.cleanCoords(feature);
    cleanFeature = turf.rewind(cleanFeature, { mutate: true });

    const clipped = safeIntersect(cleanFeature, clipper);
    return clipped || null;

  } catch (e) {
    console.warn("Feil ved Kaukasus/Ural-klipping av Russland:", e);
    return feature;
  }
}

function filterTurkeyByBosporus(feature, isEurope) {
  if (!feature || !feature.geometry) return feature;
  try {
    let cleanFeature = turf.cleanCoords(feature);
    cleanFeature = turf.rewind(cleanFeature, { mutate: true });

    let result = isEurope 
      ? safeIntersect(cleanFeature, EUROPE_TURKEY_BBOX)
      : safeDifference(cleanFeature, EUROPE_TURKEY_BBOX);

    return result || feature;
  } catch (e) {
    console.warn("Turf-klipping av Tyrkia feilet:", e);
    return feature;
  }
}

// Funksjon som bygger og viser flagglisten for et kontinent
function renderContinentFlagsBar(matchingCountries) {
  const bar = document.getElementById('continentFlagsBar');
  if (!bar) return;

  const sorted = [...matchingCountries].sort((a, b) => a.name.localeCompare(b.name, 'no'));

  let html = '';
  sorted.forEach(country => {
    const iso2 = getIso2Code(country);
    if (!iso2) return;

    // Generer unik ID basert på landets ISO3 eller navn
    const btnId = `flag-btn-${(country.iso3 || country.name).replace(/[^a-zA-Z0-9]/g, '')}`;

    html += `
      <button 
        id="${btnId}"
        onclick="selectCountryByName('${country.name.replace(/'/g, "\\'")}')" 
        title="${country.name}"
        class="continent-flag-btn group relative flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-700/70 transition text-left"
      >
        <img 
          src="https://flagcdn.com/w40/${iso2}.png" 
          alt="${country.name}" 
          class="w-8 h-auto rounded border border-slate-500/50 shadow-sm group-hover:scale-110 transition-transform"
        >
        <span class="text-xs font-medium text-slate-200 hidden group-hover:inline-block whitespace-nowrap bg-slate-800 px-2 py-1 rounded shadow-lg absolute left-12 z-50">
          ${country.name}
        </span>
      </button>
    `;
  });

  bar.innerHTML = html;
  bar.classList.remove('hidden');

  // Hvis et land allerede er valgt, markerer vi det i den nye flagglisten
  if (activeSelectedCountry) {
    updateActiveFlagStyle(activeSelectedCountry);
  }
}


function updateActiveFlagStyle(country) {
  // Fjern markering fra alle flagg-knapper i stripen
  document.querySelectorAll('.continent-flag-btn').forEach(btn => {
    btn.classList.remove('bg-sky-600', 'ring-2', 'ring-sky-400', 'scale-110');
  });

  if (!country) return;

  // Finn knappen til det valgte landet
  const btnId = `flag-btn-${(country.iso3 || country.name).replace(/[^a-zA-Z0-9]/g, '')}`;
  const activeBtn = document.getElementById(btnId);

  if (activeBtn) {
    // Legg til uthevet bakgrunn, lysende ring og forstørrelse
    activeBtn.classList.add('bg-sky-600', 'ring-2', 'ring-sky-400', 'scale-110');
    
    // Rull automatisk frem til flagget dersom flagglisten har skrollbar
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

// Skjul flagglisten når kartet nullstilles
function hideContinentFlagsBar() {
  const bar = document.getElementById('continentFlagsBar');
  if (bar) bar.classList.add('hidden');
}

// Hjelpefunksjon for å finne kontinent-ID basert på landets kontinent-navn
function getContinentId(continentName) {
  if (!continentName) return null;
  
  const name = continentName.toLowerCase();
  
  if (name.includes('europe') || name.includes('europa')) return 'europe';
  if (name.includes('asia')) return 'asia';
  if (name.includes('africa') || name.includes('afrika')) return 'africa';
  if (name.includes('north america') || name.includes('nord-amerika')) return 'north-america';
  if (name.includes('south america') || name.includes('sør-amerika')) return 'south-america';
  if (name.includes('oceania') || name.includes('oseania') || name.includes('australia')) return 'oceania';
  if (name.includes('antarctica') || name.includes('antarktis')) return 'antarctica';
  
  return null;
}

// Oppdaterer visuell tilstand på kontinentknapper
function updateContinentButtonStyles(activeContinentKey) {
  document.querySelectorAll('.continent-btn').forEach(btn => {
    if (btn.dataset.continent === activeContinentKey) {
      btn.classList.add('ring-2', 'ring-sky-400', 'bg-sky-700');
    } else {
      btn.classList.remove('ring-2', 'ring-sky-400', 'bg-sky-700');
    }
  });
}

function highlightContinent(continentKey) {
  updateContinentButtonStyles(continentKey);
  clearActiveLayers();

  const conf = CONTINENT_MAP[continentKey];
  if (!conf) return;

  const matchingCountries = countriesData.filter(c => {
    const contVal = (c.continent || '').toString().trim().toLowerCase();
    if (continentKey === 'europe') {
      return conf.names.some(n => contVal.includes(n.toLowerCase())) || c.iso3 === 'RUS' || c.iso3 === 'TUR';
    }
    if (continentKey === 'asia') {
      return conf.names.some(n => contVal.includes(n.toLowerCase())) || c.iso3 === 'RUS-ASIA' || c.iso3 === 'TUR';
    }
    return conf.names.some(n => contVal.includes(n.toLowerCase()));
  });

  renderCountryMarkers(matchingCountries);
  renderContinentFlagsBar(matchingCountries);

  let continentFeatures = [];

  matchingCountries.forEach(country => {
    const lookupCountry = (country.iso3 === 'RUS-ASIA') 
      ? { ...country, iso3: 'RUS', matchKeys: ["RUS", "RU", "Russia", "Russland"] }
      : country;

    const feat = findCountryFeature(lookupCountry);

    if (feat) {
      let clonedFeat = JSON.parse(JSON.stringify(feat));
      const iso = (country.iso3 || '').toUpperCase();

      if (continentKey === 'europe') {
        if (iso === 'RUS') {
          clonedFeat = filterRussiaByUral(clonedFeat, true);
        } else if (iso === 'TUR') {
          clonedFeat = filterTurkeyByBosporus(clonedFeat, true);
        }

        if (clonedFeat && clonedFeat.geometry) {
          continentFeatures.push(clonedFeat);
        }
      }
      else if (continentKey === 'asia') {
        if (iso === 'RUS-ASIA' || iso === 'RUS') {
          const asianRussia = filterRussiaByUral(clonedFeat, false);
          if (asianRussia && asianRussia.geometry) {
            continentFeatures.push(asianRussia);
          }
        } else if (iso === 'TUR') {
          const asianTurkey = filterTurkeyByBosporus(clonedFeat, false);
          if (asianTurkey && asianTurkey.geometry) {
            continentFeatures.push(asianTurkey);
          }
        } else {
          if (clonedFeat && clonedFeat.geometry) {
            continentFeatures.push(clonedFeat);
          }
        }
      }
      else {
        if (clonedFeat && clonedFeat.geometry) {
          continentFeatures.push(clonedFeat);
        }
      }
    }
  });

  if (continentFeatures.length > 0) {
    currentContinentLayer = L.geoJSON({
      type: "FeatureCollection",
      features: continentFeatures
    }, {
      style: {
        color: '#0284c7',
        weight: 1.2,
        opacity: 0.8,
        fillColor: '#38bdf8',
        fillOpacity: 0.6
      }
    }).addTo(map);

    if (continentKey === 'europe') {
      map.flyTo([56.5, 18.0], 4.3, { animate: true, duration: 1.2 });
    } else if (continentKey === 'asia') {
      map.flyTo([45.0, 95.0], 3.3, { animate: true, duration: 1.2 });
    } else if (continentKey === 'africa') {
      map.flyTo([2.0, 18.0], 3.8, { animate: true, duration: 1.2 });
    } else if (continentKey === 'north-america') {
      map.flyTo([48.0, -100.0], 3.5, { animate: true, duration: 1.2 });
    } else if (continentKey === 'south-america') {
      map.flyTo([-26.0, -60.0], 3.8, { animate: true, duration: 1.2 });
    } else if (continentKey === 'oceania') {
      map.flyTo([-23.5, 152.0], 3.9, { animate: true, duration: 1.2 });
    } else {
      map.fitBounds(currentContinentLayer.getBounds(), {
        padding: [20, 20],
        animate: true,
        duration: 1.2
      });
    }
  } else {
    map.flyTo([conf.lat, conf.lng], conf.zoom, { duration: 1.5 });
  }
}

function isolateCountry(country) {
  if (currentMaskLayer && map.hasLayer(currentMaskLayer)) {
    map.removeLayer(currentMaskLayer);
    currentMaskLayer = null;
  }

  const feature = findCountryFeature(country);
  if (!feature) return;

  const countryCoords = feature.geometry.coordinates;
  const geometryType = feature.geometry.type;

  let maskGeoJson;

  if (geometryType === 'Polygon') {
    maskGeoJson = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [WORLD_OUTER_BOUNDS, countryCoords[0]]
      }
    };
  } else if (geometryType === 'MultiPolygon') {
    const holes = countryCoords.map(poly => poly[0]);
    maskGeoJson = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [WORLD_OUTER_BOUNDS, ...holes]
      }
    };
  }

  if (maskGeoJson) {
    currentMaskLayer = L.geoJSON(maskGeoJson, {
      style: {
        color: '#0f172a',
        fillColor: '#0f172a',
        fillOpacity: 0.92,
        weight: 0
      }
    }).addTo(map);

    const tempLayer = L.geoJSON(feature);
    map.fitBounds(tempLayer.getBounds(), { padding: [40, 40], animate: true, duration: 1.2 });
  }
}

window.selectCountryByName = function(name) {
  const country = countriesData.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (!country) return;

  // Lukk 3D-jordkloden dersom den er åpen slik at 2D-kartet med landet vises
  const globeOverlay = document.getElementById('globeOverlay');
  if (globeOverlay) {
    globeOverlay.classList.add('hidden');
  }

  activeSelectedCountry = country;

  if (currentMaskLayer && map.hasLayer(currentMaskLayer)) {
    map.removeLayer(currentMaskLayer);
    currentMaskLayer = null;
  }

  // --- FINN KONTINENT OG OPPDRATER FLAGGSTRIPE OG KNAPP ---
  let continentKey = getContinentId(country.continent);
  if (country.iso3 === 'RUS-ASIA') continentKey = 'asia';

  if (continentKey) {
    const conf = CONTINENT_MAP[continentKey];
    if (conf) {
      const matchingCountries = countriesData.filter(c => {
        const contVal = (c.continent || '').toString().trim().toLowerCase();
        if (continentKey === 'europe') {
          return conf.names.some(n => contVal.includes(n.toLowerCase())) || c.iso3 === 'RUS' || c.iso3 === 'TUR';
        }
        if (continentKey === 'asia') {
          return conf.names.some(n => contVal.includes(n.toLowerCase())) || c.iso3 === 'RUS-ASIA' || c.iso3 === 'TUR';
        }
        return conf.names.some(n => contVal.includes(n.toLowerCase()));
      });

      renderContinentFlagsBar(matchingCountries);
    }

    updateContinentButtonStyles(continentKey);
  }


  // MARKER FLAGGET I STRIPEN
  updateActiveFlagStyle(country);

  highlightAndFocusCountry(country);

  // Vis flaggbilde trygt i sidepanel
  const flagElem = document.getElementById('countryFlag');
  if (flagElem) {
    const iso2 = getIso2Code(country);
    if (iso2) {
      flagElem.innerHTML = `<img src="https://flagcdn.com/w80/${iso2}.png" alt="${country.name}" class="w-10 h-auto rounded border border-gray-600 shadow-sm inline-block" onerror="this.style.display='none'">`;
    } else {
      flagElem.textContent = country.flag || '';
    }
  }

  const nameElem = document.getElementById('countryName');
  if (nameElem) nameElem.textContent = country.name;

  const officialElem = document.getElementById('countryOfficialName');
  if (officialElem) officialElem.textContent = country.officialName || '';

  const capitalElem = document.getElementById('countryCapital');
  if (capitalElem) capitalElem.textContent = country.capital || '-';

  const popElem = document.getElementById('countryPopulation');
  if (popElem) popElem.textContent = country.population || '-';

  const areaElem = document.getElementById('countryArea');
  if (areaElem) areaElem.textContent = country.area || '-';

  const currElem = document.getElementById('countryCurrency');
  if (currElem) currElem.textContent = country.currency || '-';

const wikiBtn = document.getElementById('wikiLink');
if (wikiBtn) {
  wikiBtn.onclick = (e) => {
    e.preventDefault();
    if (country.wiki) {
      openWikiModal(country.wiki, country.name);
    }
  };
}

  // ---------------------------------------------------

const detailsBtn = document.getElementById('countryDetailsBtn');
if (detailsBtn) {
  // 1. Forsøg at finde ISO3 direkte fra forskellige mulige egenskaber
  let iso3 = String(country.iso3 || country.id || country.iso_a3 || country.properties?.ISO_A3 || country.properties?.iso_a3 || '').trim().toUpperCase();
  
  // 2. Hvis ISO3 mangler eller er ugyldig (f.eks. "-99"), find navnet og slå op i isoNameMap
  if (!iso3 || iso3.length !== 3 || iso3 === '-99') {
    // Hent navn fra alle tænkelige steder i objektet
    const possibleName = country.name || country.properties?.name || country.properties?.NAME || country.properties?.ADMIN || '';
    const rawName = String(possibleName).trim().toLowerCase();

    if (window.isoNameMap && window.isoNameMap[rawName]) {
      iso3 = window.isoNameMap[rawName].toUpperCase();
    } else if (window.isoNameMap) {
      // Debug-hjælp i konsollen hvis et navn mangler i kortet
      console.warn("Kunne ikke finde ISO3 i isoNameMap for navnet:", rawName, country);
    }
  }

  // 3. Hent liste over tilgængelige sider (standardiseret til uppercase uden mellemrum)
  const availablePages = (window.availableLandPages || ['NOR']).map(p => String(p).trim().toUpperCase());
  
  // Sjek om dette landet har en side
  const hasPage = iso3 && availablePages.includes(iso3);

  // Debug-udskrift i F12-konsollen for at verificere resultatet
  console.log(`Land: "${country.name || country.properties?.name}" -> Fundet ISO3: "${iso3}" -> Har side: ${hasPage}`);

  // 4. Vis eller skjul knappen
  if (hasPage) {
    const filePath = `Land/${iso3}.html`;
    
    detailsBtn.onclick = (e) => {
      e.preventDefault();
      if (typeof openDetailsModal === 'function') {
        openDetailsModal(filePath, country.name || country.properties?.name || iso3);
      } else {
        window.open(filePath, '_blank');
      }
    };

    detailsBtn.classList.remove('hidden');
    detailsBtn.style.display = 'flex';
  } else {
    detailsBtn.classList.add('hidden');
    detailsBtn.style.display = 'none';
  }
}

  // ---------------------------------------------------

  const card = document.getElementById('countryCard');
  if (card) card.classList.remove('hidden');

  const select = document.getElementById('countrySelect');
  if (select) select.value = country.name;

  if (window.innerWidth < 768) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.add('-translate-x-full');
  }
};


document.addEventListener('DOMContentLoaded', async () => {
  await loadWorldGeoJson();
  initMap();

  const isolateBtn = document.getElementById('isolateCountryBtn');
  if (isolateBtn) {
    isolateBtn.addEventListener('click', () => {
      if (activeSelectedCountry) {
        isolateCountry(activeSelectedCountry);
      }
    });
  }

const globeOverlay = document.getElementById('globeOverlay');
const closeGlobeBtn = document.getElementById('closeGlobeBtn');
const openGlobeBtn = document.getElementById('openGlobeBtn');
const continentFlagsBar = document.getElementById('continentFlagsBar');
const countryCard = document.getElementById('countryCard');
const countrySelect = document.getElementById('countrySelect');
const countrySearch = document.getElementById('countrySearch');

// Lukk 3D-kloden og vis 2D-kartet
if (closeGlobeBtn && globeOverlay) {
  closeGlobeBtn.addEventListener('click', () => {
    globeOverlay.classList.add('hidden');
  });
}



if (openGlobeBtn && globeOverlay) {
  openGlobeBtn.addEventListener('click', (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Sett flagget slik at message-lytteren ikke lukker overlegget
    isOpeningGlobe = true;

    // 1. Vis overlegget umiddelbart
    globeOverlay.classList.remove('hidden');

    // 2. Skjul grensesnittelementer
    if (continentFlagsBar) continentFlagsBar.classList.add('hidden');
    if (countryCard) countryCard.classList.add('hidden');

    // 3. Nullstill søkefelt
    if (countrySelect) countrySelect.value = '';
    if (countrySearch) countrySearch.value = '';

    // 4. Nullstill knapper
    if (typeof updateContinentButtonStyles === 'function') {
      updateContinentButtonStyles(null);
    }

    try {
      const activeClasses = [
        'bg-sky-500', 'bg-sky-600', 'bg-sky-700', 'bg-sky-800',
        'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
        'border-sky-400', 'border-sky-500', 'border-blue-500',
        'ring-2', 'ring-sky-400', 'text-white', 'active', 'selected'
      ];
      document.querySelectorAll('.continent-btn, [data-continent]').forEach(btn => {
        btn.classList.remove(...activeClasses);
        if (!btn.classList.contains('bg-gray-800')) btn.classList.add('bg-gray-800');
        if (!btn.classList.contains('text-gray-300')) btn.classList.add('text-gray-300');
      });
    } catch (err) {
      console.warn('Knappefeil:', err);
    }

    // 5. Send nullstilling til 3D-kloden
    try {
      const globeIframe = document.querySelector('#globeOverlay iframe');
      if (globeIframe && globeIframe.contentWindow) {
        globeIframe.contentWindow.postMessage({ type: 'RESET_GLOBE' }, '*');
      }
    } catch (err) {
      console.warn('postMessage-feil:', err);
    }

    // Slå av flagget igjen etter at åpningssekvensen er over
    setTimeout(() => {
      isOpeningGlobe = false;
    }, 400);
  });
}

  document.querySelectorAll('.tile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.tile;

      document.querySelectorAll('.tile-btn').forEach(b => {
        b.classList.remove('bg-sky-600', 'text-white', 'active');
        b.classList.add('bg-gray-800', 'text-gray-300');
      });

      btn.classList.remove('bg-gray-800', 'text-gray-300');
      btn.classList.add('bg-sky-600', 'text-white', 'active');

      if (map.hasLayer(currentTileLayer)) {
        map.removeLayer(currentTileLayer);
      }
      currentTileLayer = TILE_LAYERS[mode];
      currentTileLayer.addTo(map);
    });
  });

document.querySelectorAll('.continent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cont = btn.dataset.continent;
      
      // 1. Zoom og uthev kontinentet på 2D-kartet
      highlightContinent(cont);

      // 2. Skjul 3D-jordkloden dersom den er aktiv/åpen
      const globeOverlay = document.getElementById('globeOverlay');
      if (globeOverlay) {
        globeOverlay.classList.add('hidden');
      }

      // 3. Nullstill infokort og rullemeny
      const card = document.getElementById('countryCard');
      if (card) card.classList.add('hidden');

      const select = document.getElementById('countrySelect');
      if (select) select.value = "";

      // 4. Lukk sidemenyen på mobil
      if (window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.add('-translate-x-full');
      }
    });
  });

  const resetBtn = document.getElementById('resetWorldBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearActiveLayers();
      hideContinentFlagsBar();
      updateContinentButtonStyles(null);
      renderCountryMarkers(countriesData);
      map.flyTo([20, 0], 2.5, { duration: 1.5 });

      const card = document.getElementById('countryCard');
      if (card) card.classList.add('hidden');

      const select = document.getElementById('countrySelect');
      if (select) select.value = "";
    });
  }

  const selectElem = document.getElementById('countrySelect');
  if (selectElem) {
    selectElem.addEventListener('change', (e) => {
      const selectedName = e.target.value;
      if (selectedName) {
        selectCountryByName(selectedName);
      }
    });
  }

  const searchElem = document.getElementById('countrySearch');
  if (searchElem) {
    searchElem.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = countriesData.filter(c => c.name.toLowerCase().includes(query));
      populateCountryDropdown(filtered);
    });
  }

  const sidebar = document.getElementById('sidebar');
  const openBtn = document.getElementById('openSidebarBtn');
  if (openBtn && sidebar) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
      setTimeout(() => map.invalidateSize(), 300);
    });
  }

  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      setTimeout(() => map.invalidateSize(), 300);
    });
  }

  const toggleMarkers = document.getElementById('toggleMarkers');
  if (toggleMarkers) {
    toggleMarkers.addEventListener('change', (e) => {
      if (e.target.checked) {
        map.addLayer(markersLayer);
      } else {
        map.removeLayer(markersLayer);
      }
    });
  }

const toggleBorders = document.getElementById('toggleBorders');
  if (toggleBorders) {
    toggleBorders.addEventListener('change', (e) => {
      showBorders = e.target.checked;

      // 1. Slå av/på grenser for enkeltland (hvis et land er valgt)
      if (currentCountryLayer) {
        if (showBorders) {
          currentCountryLayer.addTo(map);
        } else {
          map.removeLayer(currentCountryLayer);
        }
      }

      // 2. Slå av/på grenser for kontinent (hvis en verdensdel er valgt)
      if (currentContinentLayer) {
        if (showBorders) {
          currentContinentLayer.addTo(map);
        } else {
          map.removeLayer(currentContinentLayer);
        }
      }

      // 3. Send beskjed til 3D-kloden (iframe) dersom den er aktiv
      const globeIframe = document.querySelector('#globeOverlay iframe');
      if (globeIframe && globeIframe.contentWindow) {
        globeIframe.contentWindow.postMessage({
          type: 'TOGGLE_BORDERS',
          showBorders: showBorders
        }, '*');
      }
    });
  }
});


// Åpne Wikipedia-modal
function openWikiModal(url, countryName) {
  const modal = document.getElementById('wikiModal');
  const iframe = document.getElementById('wikiIframe');
  const title = document.getElementById('wikiModalTitle');
  const extBtn = document.getElementById('wikiExternalBtn');

  // Konverter Wikipedia-lenken til mobilvisning (m.wikipedia.org)
  // Mobilversjonen av Wikipedia passer ofte mye bedre inn i en modal
  let mobileUrl = url;
  if (url.includes('wikipedia.org')) {
    mobileUrl = url.replace('.wikipedia.org', '.m.wikipedia.org');
  }

  if (iframe) iframe.src = mobileUrl;
  if (title) title.innerHTML = `<i class="fa-brands fa-wikipedia-w"></i> Wikipedia: ${countryName}`;
  if (extBtn) extBtn.href = url;

  if (modal) modal.classList.remove('hidden');
}

// Lukk Wikipedia-modal
const closeWikiBtn = document.getElementById('closeWikiModalBtn');
const wikiModal = document.getElementById('wikiModal');

if (closeWikiBtn && wikiModal) {
  closeWikiBtn.addEventListener('click', () => {
    wikiModal.classList.add('hidden');
    const iframe = document.getElementById('wikiIframe');
    if (iframe) iframe.src = 'about:blank'; // Tømmer iframe slik at den ikke bruker minne/lyd i bakgrunnen
  });

  // Lukk modal dersom man klikker utenfor selve brennpunktet (bakgrunnen)
  wikiModal.addEventListener('click', (e) => {
    if (e.target === wikiModal) {
      wikiModal.classList.add('hidden');
      const iframe = document.getElementById('wikiIframe');
      if (iframe) iframe.src = 'about:blank';
    }
  });
}


// Åpne Land Detaljer Modal
function openDetailsModal(url, countryName) {
  const modal = document.getElementById('detailsModal');
  const iframe = document.getElementById('detailsIframe');
  const title = document.getElementById('detailsModalTitle');
  const extBtn = document.getElementById('detailsExternalBtn');

  if (iframe) iframe.src = url;
  if (title) title.innerHTML = `<i class="fa-solid fa-circle-info text-emerald-400"></i> Detaljer: ${countryName}`;
  if (extBtn) extBtn.href = url;

  if (modal) modal.classList.remove('hidden');
}

// Lukk Land Detaljer Modal
const closeDetailsBtn = document.getElementById('closeDetailsModalBtn');
const detailsModal = document.getElementById('detailsModal');

if (closeDetailsBtn && detailsModal) {
  closeDetailsBtn.addEventListener('click', () => {
    detailsModal.classList.add('hidden');
    const iframe = document.getElementById('detailsIframe');
    if (iframe) iframe.src = 'about:blank';
  });

  detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) {
      detailsModal.classList.add('hidden');
      const iframe = document.getElementById('detailsIframe');
      if (iframe) iframe.src = 'about:blank';
    }
  });
}

// Lytt etter meldinger fra iframe-en (jordklode.html)
window.addEventListener('message', (event) => {
    if (!event.data) return;

    // TRINN 1: Brukeren klikket på et land i 3D-kloden
    if (event.data.type === 'COUNTRY_SELECTED' || event.data.type === 'CONTINENT_SELECTED') {
        const { countryName, countryIso, continentKey, center } = event.data;

        let foundCountry = null;

        // 1. Søk først etter ISO3-kode i countriesData
        if (countryIso) {
            foundCountry = countriesData.find(c => c.iso3 === countryIso);
        }

        // 2. Hvis ikke funnet på ISO, søk på engelsk/norsk navn
        if (!foundCountry && countryName) {
            const searchName = countryName.toLowerCase();
            foundCountry = countriesData.find(c => 
                c.name.toLowerCase() === searchName || 
                (c.name_en && c.name_en.toLowerCase() === searchName)
            );
        }

        // 3. Åpne landet på 2D-kartet dersom funnet
        if (foundCountry && typeof selectCountryByName === 'function') {
            selectCountryByName(foundCountry.name);
        } else if (continentKey) {
            if (typeof highlightContinent === 'function') {
                highlightContinent(continentKey);
            }
        }

        // 4. Send melding tilbake til 3D-kloden for å utføre zoom-animasjonen
        const globeIframe = document.querySelector('#globeOverlay iframe');
        if (globeIframe && globeIframe.contentWindow) {
            globeIframe.contentWindow.postMessage({
                type: 'ANIMATE_AND_CLOSE',
                continentKey: continentKey,
                center: center
            }, '*');
        } else {
            document.getElementById('globeOverlay')?.classList.add('hidden');
        }
    }

    // TRINN 2: Zoom-animasjon fullført -> skjul overlegget
    if (event.data.type === 'GLOBE_ZOOM_COMPLETE') {
        // HINDRER SKJULT BLINKING: Dersom knappen akkurat åpnet kloden, ignorer vi lukke-meldingen
        if (typeof isOpeningGlobe !== 'undefined' && isOpeningGlobe) return;

        const globeOverlay = document.getElementById('globeOverlay');
        if (globeOverlay) {
            globeOverlay.classList.add('opacity-0');
            setTimeout(() => {
                globeOverlay.classList.add('hidden');
                globeOverlay.classList.remove('opacity-0');
            }, 300);
        }

        if (window.innerWidth < 768) {
            document.getElementById('sidebar')?.classList.add('-translate-x-full');
        }
    }
});