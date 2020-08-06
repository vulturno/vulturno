function directionalDot (maxmins) {
  const margin = {
    top: 16,
    right: 16,
    bottom: 32,
    left: 48
  }
  let width = 0
  let height = 0
  const chart = d3.select(`.chart-diff-records-${maxmins}`)
  const svg = chart.select('svg')
  const scales = {}
  const temp = 'ºC'
  let dataz
  const tooltip = d3
    .select(`.chart-diff-records-${maxmins}`)
    .append('div')
    .attr('class', 'tooltip tooltip-diff')
    .style('opacity', 0)
  const selectMonth = d3.select(`#select-month-${maxmins}`)
  const selectCity = d3.select(`#select-cities-records-${maxmins}`)
  const tempThis = `${maxmins}`

  const setupScales = () => {
    if (tempThis === 'max') {
      const countX = d3
        .scaleTime()
        .domain([d3.min(dataz, d => d.dia), d3.max(dataz, d => d.dia)])

      const countY = d3
        .scaleLinear()
        .domain([
          d3.min(dataz, d => d.segundo - 1),
          d3.max(dataz, d => d.primero + 1)
        ])
      scales.count = { x: countX, y: countY }
    } else {
      const countX = d3
        .scaleTime()
        .domain([d3.min(dataz, d => d.dia), d3.max(dataz, d => d.dia)])

      const countY = d3
        .scaleLinear()
        .domain([
          d3.min(dataz, d => d.primero - 1),
          d3.max(dataz, d => d.segundo + 1)
        ])
      scales.count = { x: countX, y: countY }
    }
  }

  const setupElements = () => {
    const g = svg.select('.chart-diff-records-container')

    g.append('g').attr('class', 'axis axis-x')

    g.append('g').attr('class', 'axis axis-y')

    g.append('g').attr('class', 'chart-diff-records-container-bis')
  }

  const updateScales = (width, height) => {
    scales.count.x.range([15, width])
    scales.count.y.range([height, 0])
  }

  const drawAxes = g => {
    const axisX = d3
      .axisBottom(scales.count.x)
      .tickPadding(5)
      .tickFormat(d3.format('d'))
      .ticks(31)

    g.select('.axis-x')
      .attr('transform', `translate(0,${height})`)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(axisX)

    const axisY = d3
      .axisLeft(scales.count.y)
      .tickPadding(5)
      .tickFormat(d => d + temp)
      .ticks(15)
      .tickSizeInner(-width)

    g.select('.axis-y')
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(axisY)
  }

  const updateChart = dataz => {
    const w = chart.node().offsetWidth
    const h = 600

    width = w - margin.left - margin.right
    height = h - margin.top - margin.bottom

    svg.attr('width', w).attr('height', h)

    const translate = `translate(${margin.left},${margin.top})`

    const g = svg.select('.chart-diff-records-container')

    g.attr('transform', translate)

    updateScales(width, height)

    const container = chart.select('.chart-diff-records-container-bis')

    const layer = container.selectAll(`.circle-primero-${maxmins}`).data(dataz)

    layer.exit().remove()

    const layerDos = container
      .selectAll(`.circle-segundo-${maxmins}`)
      .data(dataz)

    layerDos.exit().remove()

    const layerLine = container.selectAll('.circle-lines').data(dataz)

    layerLine.exit().remove()

    const newLayer = layer
      .enter()
      .append('circle')
      .attr('class', `circle-primero-${maxmins}`)

    const newLayerDos = layerDos
      .enter()
      .append('circle')
      .attr('class', `circle-segundo-${maxmins}`)

    const newLayerLines = layerLine
      .enter()
      .append('line')
      .attr('class', 'circle-lines')

    layerLine
      .merge(newLayerLines)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('x1', d => scales.count.x(d.dia))
      .attr('y1', d => tempThis === 'max' ? scales.count.y(d.primero) + 6 : scales.count.y(d.primero) - 6)
      .attr('x2', d => scales.count.x(d.dia))
      .attr('y2', d => tempThis === 'max' ? scales.count.y(d.segundo) - 6 : scales.count.y(d.segundo) + 6)
      .attr('stroke', d => {
        if (d.diff === 0) {
          return 'none'
        }
        return '#111'
      })

    const city = selectCity.property('value')

    layer
      .merge(newLayer)
      .on('mouseover', d => {
        const positionX = scales.count.x(d.dia)
        const postionWidthTooltip = positionX + 270
        const tooltipWidth = 210
        const positionleft = `${d3.event.pageX}px`
        const positionright = `${d3.event.pageX - tooltipWidth}px`
        const tempString = maxmins === 'max' ? 'máxima' : 'mínima'
        tooltip.transition()
        tooltip
          .style('opacity', 1)
          .html(
            `<p class="tooltip-diff-text">La temperatura ${tempString} en ${city} se registro en ${d.yearprimera} y fue de ${d.primero}ºC<p/>`
          )
          .style('left', postionWidthTooltip > w ? positionright : positionleft)
          .style('top', `${d3.event.pageY - 28}px`)
      })
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0)
      })
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('cy', d => scales.count.y(d.primero))
      .attr('cx', d => scales.count.x(d.dia))
      .attr('r', 6)

    layerDos
      .merge(newLayerDos)
      .on('mouseover', d => {
        const positionX = scales.count.x(d.dia)
        const postionWidthTooltip = positionX + 270
        const tooltipWidth = 210
        const positionleft = `${d3.event.pageX}px`
        const positionright = `${d3.event.pageX - tooltipWidth}px`
        tooltip.transition()
        tooltip
          .style('opacity', 1)
          .html(
            `<p class="tooltip-diff-text">La segunda temperatura ${maxmins} en ${city} se registro en ${d.yearsegundo} y fue de ${d.segundo}ºC<p/>`
          )
          .style('left', postionWidthTooltip > w ? positionright : positionleft)
          .style('top', `${d3.event.pageY - 28}px`)
      })
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0)
      })
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('cy', d => scales.count.y(d.segundo))
      .attr('cx', d => scales.count.x(d.dia))
      .attr('r', d => {
        if (d.diff === 0) {
          return 0
        }
        return 6
      })

    drawAxes(g)
  }

  const resize = () => {
    updateChart(dataz)
  }

  const updateMes = () => {
    const mes = selectMonth.property('value')
    const city = selectCity
      .property('value')
      .replace(/ /g, '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    d3.csv(`csv/${maxmins}/dos-records/${city}-dos-records.csv`).then(data => {
      dataz = data.filter(d => String(d.mes).match(mes))

      dataz.forEach(d => {
        d.fecha = +d.fecha
        d.primero = +d.primero
        d.segundo = +d.segundo
        d.diff = d.primero - d.segundo
        d.dia = +d.dia
      })

      if (tempThis === 'max') {
        const countX = d3
          .scaleTime()
          .domain([d3.min(dataz, d => d.dia), d3.max(dataz, d => d.dia)])

        const countY = d3
          .scaleLinear()
          .domain([
            d3.min(dataz, d => d.segundo - 1),
            d3.max(dataz, d => d.primero + 1)
          ])
        scales.count = { x: countX, y: countY }
      } else {
        const countX = d3
          .scaleTime()
          .domain([d3.min(dataz, d => d.dia), d3.max(dataz, d => d.dia)])

        const countY = d3
          .scaleLinear()
          .domain([
            d3.min(dataz, d => d.primero - 1),
            d3.max(dataz, d => d.segundo + 1)
          ])
        scales.count = { x: countX, y: countY }
      }

      updateChart(dataz)
    })
  }

  const menuMes = () => {
    d3.csv('csv/mes.csv').then(data => {
      const datos = data

      const nest = d3
        .nest()
        .key(d => d.Mes)
        .entries(datos)

      selectMonth
        .selectAll('option')
        .data(nest)
        .enter()
        .append('option')
        .attr('value', d => d.key)
        .attr('number', (d, i) => i + 1)
        .text(d => d.key)

      selectMonth.on('change', () => {
        updateMes()
      })
    })
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

  // LOAD THE DATA
  const loadData = () => {
    const mes = 'Enero'
    d3.csv(`csv/${maxmins}/dos-records/Albacete-dos-records.csv`).then(data => {
      dataz = data.filter(d => String(d.mes).match(mes))
      dataz.forEach(d => {
        d.primero = +d.primero
        d.segundo = +d.segundo
        d.diff = d.primero - d.segundo
        d.dia = +d.dia
      })
      setupElements()
      setupScales()
      updateChart(dataz)
      menuMes()
      menuCities()
    })
  }

  window.addEventListener('resize', resize)

  loadData()
}

export default directionalDot
