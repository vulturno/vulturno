function tempExt () {
  const margin = {
    top: 16,
    right: 16,
    bottom: 24,
    left: 32
  }
  let width = 0
  let height = 0
  const chart = d3.select('.chart-temperature-ext')
  const svg = chart.select('svg')
  const scales = {}
  let datos
  const tooltip = chart
    .append('div')
    .attr('class', 'tooltip tooltip-tropical')
    .style('opacity', 0)

  const setupScales = () => {
    const countX = d3.scaleBand().domain(datos.map(d => d.fecha))

    const countY = d3
      .scaleLinear()
      .domain([0, d3.max(datos, d => d.tropical * 1.25)])

    scales.count = { x: countX, y: countY }
  }

  const setupElements = () => {
    const g = svg.select('.chart-temperature-ext-container')

    g.append('g').attr('class', 'axis axis-x')

    g.append('g').attr('class', 'axis axis-y')

    g.append('g').attr('class', 'chart-temperature-ext-container-bis')
  }

  const updateScales = (width, height) => {
    scales.count.x.range([0, width]).paddingInner(0.05)
    scales.count.y.range([height, 0])
  }

  const drawAxes = g => {
    const axisX = d3
      .axisBottom(scales.count.x)
      .tickPadding(5)
      .tickFormat(d3.format('d'))
      .ticks(13)
      .tickValues(
        scales.count.x.domain().filter(function (d, i) {
          return !(i % 5)
        })
      )

    g.select('.axis-x')
      .attr('transform', `translate(0,${height})`)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(axisX)

    const axisY = d3
      .axisLeft(scales.count.y)
      .tickPadding(5)
      .tickFormat(d => d)
      .tickSize(-width)
      .ticks(6)

    g.select('.axis-y')
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(axisY)
  }

  function updateChart (data) {
    const w = chart.node().offsetWidth
    const h = 544

    width = w - margin.left - margin.right
    height = h - margin.top - margin.bottom

    svg.attr('width', w).attr('height', h)

    const translate = `translate(${margin.left},${margin.top})`

    const g = svg.select('.chart-temperature-ext-container')

    g.attr('transform', translate)

    updateScales(width, height)

    const container = chart.select('.chart-temperature-ext-container-bis')

    const layer = container.selectAll('.rect-ext').data(datos)

    const newLayer = layer
      .enter()
      .append('rect')
      .attr('class', 'rect-ext')

    layer
      .merge(newLayer)
      .on('mouseover', function (d) {
        const stationResize = d3.select('#select-ext').property('value')
        const positionX = scales.count.x(d.fecha)
        const postionWidthTooltip = positionX + 270
        const tooltipWidth = 210
        const positionleft = `${d3.event.pageX}px`
        const positionright = `${d3.event.pageX - tooltipWidth}px`
        tooltip.transition()
        tooltip
          .style('opacity', 1)
          .html(
            `
                                <p class="tooltip-year">En <strong>${d.fecha}</strong> hubo <strong>${d.tropical}</strong> días en los que la máxima fue superior a <strong>${stationResize}ºC</strong>.</p>
                                `
          )
          .style('left', postionWidthTooltip > w ? positionright : positionleft)
          .style('top', `${d3.event.pageY - 28}px`)
      })
      .on('mouseout', function (d) {
        tooltip
          .transition()
          .duration(300)
          .style('opacity', 0)
      })
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('width', scales.count.x.bandwidth())
      .attr('x', d => scales.count.x(d.fecha))
      .attr('y', d => scales.count.y(d.tropical))
      .attr('height', d => height - scales.count.y(d.tropical))

    drawAxes(g)
  }

  function update (mes) {
    d3.csv(`csv/total-temp-${mes}.csv`).then(data => {
      datos = data

      datos.forEach(d => {
        d.fecha = +d.year
        d.tropical = +d.total
      })

      setupScales()
      updateChart(datos)
    })
  }

  const resize = () => {
    const stationResize = d3
      .select('#select-ext')
      .property('value')
      .replace(/[\u00f1-\u036f]/g, '')
      .replace(/ /g, '_')
      .replace(/á/g, 'a')
      .replace(/Á/g, 'A')
      .replace(/é/g, 'e')
      .replace(/è/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u')
      .replace(/ñ/g, 'n')

    d3.csv(`csv/total-temp-${stationResize}.csv`).then(data => {
      datos = data
      datos.forEach(d => {
        d.fecha = +d.year
        d.tropical = +d.total
      })

      updateChart(datos)
    })
  }

  const menuMes = () => {
    d3.csv('csv/temperature.csv').then(data => {
      datos = data

      const nest = d3
        .nest()
        .key(d => d.Name)
        .entries(datos)

      const selectCity = d3.select('#select-ext')

      selectCity
        .selectAll('option')
        .data(nest)
        .enter()
        .append('option')
        .attr('value', ({ key }) => key)
        .text(({ key }) => `${key}ºC`)

      selectCity.on('change', function () {
        const mes = d3
          .select(this)
          .property('value')
          .replace(/ /g, '_')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
        update(mes)
      })
    })
  }

  const loadData = () => {
    d3.csv('csv/total-temp-35.csv').then(data => {
      datos = data
      datos.forEach(d => {
        d.fecha = +d.year
        d.tropical = +d.total
      })
      setupElements()
      setupScales()
      updateChart(datos)
      const mes = '35'
      update(mes)
    })
  }

  window.addEventListener('resize', resize)
  loadData()
  menuMes()
}

export default tempExt
