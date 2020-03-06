const widthMobile = window.innerWidth > 0 ? window.innerWidth : screen.width

function forceLayout (csvFile, record, color) {
  const chart = d3.select(`.chart-force-${record}`)
  const svg = chart.select('svg')
  const nodePadding = 1.5
  let dataz

  const tooltip = chart
    .append('div')
    .attr('class', 'tooltip tooltip-record')
    .style('opacity', 0)

  const tooltipDecade = chart
    .append('div')
    .attr('class', 'tooltip tooltip-decade')
    .style('opacity', 0)

  svg
    .append('text')
    .attr('class', 'legend-title')
    .text('Décadas')

  if (widthMobile > 544) {
    svg.select('.legend-title').attr('transform', 'translate(50,110)')
  } else {
    svg.select('.legend-title').attr('transform', 'translate(0,30)')
  }

  function updateChart (dataz) {
    const w = chart.node().offsetWidth
    const h = 600

    svg.attr('width', w).attr('height', h)

    const node = svg
      .selectAll(`.circle-${record}`)
      .remove()
      .exit()
      .data(dataz)
      .enter()
      .append('circle')
      .attr('class', `circle-${record}`)
      .attr('r', d => d.radius)
      .attr('fill', d => color(d.decade))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .on('mouseover', function (d) {
        const circleUnderMouse = this
        d3.selectAll(`.circle-${record}`)
          .filter((d, i) => this !== circleUnderMouse)
          .transition()
          .duration(300)
          .ease(d3.easeLinear)
          .style('opacity', 0.1)

        tooltip.transition()
        tooltip.style(
          'opacity',
          1
        ).html(`<p class="tooltip-record-max">En <span class="number">${d.year}</span> se establecieron <span class="number">${d.total}</span> récords.<p/>
                        `)
      })
      .on('mouseout', () => {
        d3.selectAll(`.circle-${record}`)
          .transition()
          .duration(800)
          .ease(d3.easeLinear)
          .style('opacity', 1)
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0)
      })

    const simulation = d3
      .forceSimulation()
      .force('forceX', d3.forceX().x(w * 0.5))
      .force('forceY', d3.forceY().y(h * 0.5))
      .force(
        'center',
        d3
          .forceCenter()
          .x(w * 0.5)
          .y(h * 0.5)
      )
      .force('charge', d3.forceManyBody().strength(5))
      .force('collision', d3.forceCollide().radius(d => d.radius + 1))

    simulation
      .nodes(dataz)
      .force(
        'collide',
        d3
          .forceCollide()
          .strength(0.5)
          .radius(d => d.radius + nodePadding)
          .iterations(1)
      )
      .on('tick', () => node.attr('cx', ({ x }) => x).attr('cy', ({ y }) => y))

    const legendData = d3.group(dataz.map(d => d.decade))
    let unique = legendData.filter(
      (elem, pos) => legendData.indexOf(elem) === pos
    )

    unique = unique.reverse(d => d.decade)

    const legend = svg
      .selectAll(`.legend-${record}`)
      .remove()
      .exit()
      .data(unique, d => d)
      .enter()
      .append('g')
      .attr('class', `legend-${record}`)
      .attr('year', d => d)

    if (widthMobile > 544) {
      legend.attr('transform', (d, i) => `translate(${50},${(i + 5) * 25})`)
      legend
        .append('text')
        .attr('x', 20)
        .attr('y', 10)
        .text(d => d)
    } else {
      legend.attr('transform', (d, i) => `translate(${i * 45},${50})`)
      legend
        .append('text')
        .attr('x', 14)
        .attr('y', 9)
        .text(d => d)
    }

    legend
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', d => color(d))

    function tooltipLast (leyenda) {
      const valueYear = leyenda.attr('year')

      d3.csv(csvFile, (data) => {
        const dataz = data.filter(d => String(d.decade).match(valueYear))

        tooltipDecade
          .data(dataz)
          .style('opacity', 1)
          .html(
            d =>
              `<p class="tooltip-record-max">Entre <span class="number">${
                d.decade
              }</span>
                y <span class="number">${Number(d.decade) +
                  9}</span> se establecieron <span class="number">
                ${d.totaldecade}</span> récords de temperatura ${record}.<p/>`
          )
      })
    }

    legend
      .on('mouseover', function (tipo) {
        const legendThis = d3.select(this)
        d3.selectAll(`.legend-${record}`)
          .transition()
          .duration(300)
          .ease(d3.easeLinear)
          .style('opacity', 0.1)
        legendThis
          .transition()
          .duration(300)
          .ease(d3.easeLinear)
          .style('opacity', 1)
        d3.selectAll(`.circle-${record}`)
          .transition()
          .duration(200)
          .ease(d3.easeLinear)
          .style('opacity', 0.1)
          .filter(d => d.decade === tipo)
          .transition()
          .duration(300)
          .ease(d3.easeLinear)
          .style('opacity', 1)
        d3.select(this).call(tooltipLast)
      })
      .on('mouseout', () => {
        d3.selectAll(`.legend-${record}`)
          .transition()
          .duration(300)
          .ease(d3.easeLinear)
          .style('opacity', 1)
        d3.selectAll(`.circle-${record}`)
          .transition()
          .duration(300)
          .ease(d3.easeLinear)
          .style('opacity', 1)
        tooltipDecade.style('opacity', 0)
      })
  }

  function loadData () {
    d3.csv(csvFile).then(data => {
      dataz = data
      dataz.forEach(d => {
        if (widthMobile > 544) {
          d.size = +d.total / 10
        } else {
          d.size = +d.total / 17
        }
        d.radius = +d.size
      })
      updateChart(dataz)
    })
  }

  const resize = () => {
    updateChart(dataz)
  }

  window.addEventListener('resize', resize)

  loadData()
}

export default forceLayout
