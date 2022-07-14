function heatWave () {
  const selectCity = d3.select('#select-heat-wave')

  const updateMes = () => {
    const city = selectCity
      .property('value')
      .replace(/ /g, '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    loadData(city)
  }

  const menuCities = () => {
    d3.csv('csv/stations.csv').then(data => {
      const datos = data

      const nest = d3
        .nest()
        .key(d => d.Name)
        .entries(datos)

      selectCity
        .selectAll('option')
        .data(nest)
        .enter()
        .append('option')
        .attr('value', d => d.key)
        .text(d => d.key)

      selectCity.on('change', () => {
        updateMes()
      })
    })
  }

  menuCities()

  // LOAD THE DATA
  const loadData = mes => {
    d3.csv(`csv/max/junio/${mes}-junio.csv`).then(data => {
      const container = d3.select('.forno-container')

      data.forEach(d => {
        d.fecha = new Date(d.fecha)
      })

      container
        .selectAll('.forno-element')
        .remove()
        .exit()
        .data(data)
        .enter()
        .append('section')
        .attr('class', 'forno-element')
        .html(
          d => `
                                      <span class="forno-year forno-text">${new Intl.DateTimeFormat('es-Es', { year: 'numeric', month: 'long', day: 'numeric' }).format(d.fecha)}</span>
                                    <span class="forno-record forno-text">${d.primero}ºC</span>`
        )
    })
  }

  const selected = 'Albacete'

  loadData(selected)
}

export default heatWave
