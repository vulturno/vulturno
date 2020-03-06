function menuSelect (selector) {
  d3.csv('csv/stations.csv').then(data => {
    const datos = data

    const nest = d3
      .nest()
      .key(d => d.Name)
      .entries(datos)

    const selectCity = d3.select(selector)

    selectCity
      .selectAll('option')
      .data(nest)
      .enter()
      .append('option')
      .attr('value', d => d.key)
      .text(d => d.key)
  })
}

export default menuSelect
