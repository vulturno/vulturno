function average () {
  const margin = { top: 24, right: 24, bottom: 24, left: 40 }
  let width = 0
  let height = 0
  const chart = d3.select('.line-average')
  const svg = chart.select('svg')
  const scales = {}
  const temp = 'ºC'
  let dataz

  const setupScales = () => {
    const countX = d3
      .scaleTime()
      .domain([d3.min(dataz, d => d.fecha), d3.max(dataz, d => d.fecha)])

    const countY = d3
      .scaleLinear()
      .domain([
        d3.min(dataz, d => d.mediaXX - 4),
        d3.max(dataz, d => d.mediaXX + 4)
      ])

    scales.count = { x: countX, y: countY }
  }

  const setupElements = () => {
    const g = svg.select('.line-average-container')

    g.append('g').attr('class', 'axis axis-x')

    g.append('g').attr('class', 'axis axis-y')

    g.append('g').attr('class', 'line-average-container-dos')
  }

  const updateScales = (width, height) => {
    scales.count.x.range([16, width])
    scales.count.y.range([height, 0])
  }

  const drawAxes = g => {
    const axisX = d3
      .axisBottom(scales.count.x)
      .tickFormat(d3.format('d'))
      .ticks(33)

    g.select('.axis-x')
      .attr('transform', `translate(0,${height})`)
      .call(axisX)

    const axisY = d3
      .axisLeft(scales.count.y)
      .tickFormat(d => d + temp)
      .ticks(10)
      .tickSizeInner(-width)

    g.select('.axis-y').call(axisY)

    g.append('text')
      .attr('class', 'legend-aragon')
      .attr('y', '1%')
      .attr('x', '3%')
      .text('Promedio de temperatura media entre 1980-2009')

    g.append('rect')
      .attr('class', 'legend-line')
      .attr('y', '0')
      .attr('x', '1%')
      .attr('height', '3px')
      .attr('width', '16px')
  }

  const updateChart = dataz => {
    const w = chart.node().offsetWidth
    const h = 600

    width = w - margin.left - margin.right
    height = h - margin.top - margin.bottom

    svg.attr('width', w).attr('height', h)

    const translate = `translate(${margin.left},${margin.top})`

    const g = svg.select('.line-average-container')

    g.attr('transform', translate)

    const line = d3
      .line()
      .x(d => scales.count.x(d.fecha))
      .y(d => scales.count.y(d.mediaXX))
      .curve(d3.curveStep)

    updateScales(width, height)

    const container = chart.select('.line-average-container-dos')

    const layer = container.selectAll('.line').data([dataz])

    const layer2 = container.selectAll('.bar-vertical').data(dataz)

    const newLayer2 = layer2
      .enter()
      .append('rect')
      .attr('id', (d, i) => 'rect' + i)
      .attr('class', d => {
        if (d.diff < 0) {
          return 'up'
        } else {
          return 'down'
        }
      })

    const newLayer = layer
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('stroke-width', '1.5')

    layer2
      .merge(newLayer2)
      .attr('width', width / dataz.length - 4)
      .attr('x', d => scales.count.x(d.fecha) - 14)
      .attr('y', d => {
        if (d.diff > 0) {
          return scales.count.y(d.mediaXX)
        } else {
          return (
            scales.count.y(d.mediaXX) -
            Math.abs(scales.count.y(d.diff) - scales.count.y(0))
          )
        }
      })
      .attr('height', d => Math.abs(scales.count.y(d.diff) - scales.count.y(0)))

    layer.merge(newLayer).attr('d', line)

    drawAxes(g)
  }

  const resize = () => {
    updateChart(dataz)
  }

  const loadData = () => {
    d3.csv('csv/junio-1980-2019.csv').then(data => {
      dataz = data
      dataz.forEach(d => {
        d.mediaXX = +d.mediaXX
        d.mediaXXI = +d.mediaXXI
        d.diff = +d.diff
      })
      setupElements()
      setupScales()
      updateChart(dataz)
    })
  }

  window.addEventListener('resize', resize)

  loadData()
}

export default average
