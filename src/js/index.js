import menu from './components/menu.js'
import quotesTemp from './components/quotesTemp.js'
import tempExt from './components/temperatureExtrem.js'
import formatDate from './components/formatDate.js'
import tempMed from './components/temperatureMed.js'
import forceLayout from './components/forceLayout.js'
import recordsMax from './components/recordsMax.js'
import recordsMin from './components/recordsMin.js'
import tropicalCities from './components/tropicalCities.js'
import directionalDot from './components/directionalDots.js'
import scatterTemp from './components/scatterTemp.js'
import tropicalTotal from './components/tropicalTotal.js'
import frostyTotal from './components/frostyTotal.js'
import frostyCities from './components/frostyCities.js'
/*import heatWave from './components/heatWave.js'*/

const maxmin = ['max', 'min']
const csvForce = ['csv/total-records-max.csv', 'csv/total-records-min.csv']
const records = ['maxima', 'minima']
const colorMax = d3.scaleOrdinal([
  '#f6d2d5',
  '#f0b7bc',
  '#ea969d',
  '#e16973',
  '#cc0011',
  '#a2000d',
  '#b8000f'
])
const colorMin = d3.scaleOrdinal([
  '#004d84',
  '#005da0',
  '#006bb7',
  '#0077cc',
  '#4a9eda',
  '#7db9e5',
  '#a5cfed'
])
const colores = [colorMax, colorMin]

menu()
tempExt()
formatDate()
tempMed()
recordsMax()
recordsMin()
tropicalTotal()
frostyTotal()
scatterTemp()
directionalDot(maxmin[0])
directionalDot(maxmin[1])
tropicalCities()
frostyCities()

setInterval(() => {
  quotesTemp()
}, 3000)

forceLayout(csvForce[0], records[0], colores[0])
forceLayout(csvForce[1], records[1], colores[1])

const slimCity = new SlimSelect({
  select: '#select-city',
  searchPlaceholder: 'Busca tu ciudad'
})

const slimScatter = new SlimSelect({
  select: '#select-scatter-city',
  searchPlaceholder: 'Busca tu ciudad'
})

new SlimSelect({
  select: '#select-ext',
  searchPlaceholder: 'Selecciona temperatura'
})

new SlimSelect({
  select: '#select-month-max',
  searchPlaceholder: 'Selecciona un mes'
})

new SlimSelect({
  select: '#select-month-min',
  searchPlaceholder: 'Selecciona un mes'
})

const slimTropical = new SlimSelect({
  select: '#select-city-tropical',
  searchPlaceholder: 'Busca tu ciudad'
})

const slimRecordsMax = new SlimSelect({
  select: '#select-cities-records-max',
  searchPlaceholder: 'Selecciona una ciudad'
})

const slimRecordsMin = new SlimSelect({
  select: '#select-cities-records-min',
  searchPlaceholder: 'Selecciona una ciudad'
})

const slimFrosty = new SlimSelect({
  select: '#select-city-frosty',
  searchPlaceholder: 'Selecciona una ciudad'
})

const EXCLUDED_GLOBAL_CITIES = []

const citySlims = {
  'select-city': slimCity,
  'select-scatter-city': slimScatter,
  'select-city-tropical': slimTropical,
  'select-cities-records-max': slimRecordsMax,
  'select-cities-records-min': slimRecordsMin,
  'select-city-frosty': slimFrosty
}

new SlimSelect({
  select: '#select-global-city',
  searchPlaceholder: 'Busca tu ciudad',
  placeholder: 'Selecciona una ciudad',
  onChange: info => {
    const city = info.value
    if (!city) return
    Object.keys(citySlims).forEach(id => {
      const native = document.getElementById(id)
      if (native && native.querySelector(`option[value="${city}"]`)) {
        citySlims[id].set(city)
      }
    })
  }
})

d3.csv('csv/stations.csv').then(data => {
  const globalSelect = document.getElementById('select-global-city')
  data
    .map(d => d.Name)
    .filter(name => EXCLUDED_GLOBAL_CITIES.indexOf(name) === -1)
    .forEach(name => {
      const option = document.createElement('option')
      option.value = name
      option.text = name
      globalSelect.appendChild(option)
    })
})
