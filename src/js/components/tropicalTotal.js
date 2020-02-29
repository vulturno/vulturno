function tropicalTotal() {
  const margin = {
    top: 16,
    right: 16,
    bottom: 24,
    left: 32
  };
  let width = 0;
  let height = 0;
  const chart = d3.select('.chart-tropical');
  const svg = chart.select('svg');
  const scales = {};
  let dataz;
  const tooltip = chart
    .append('div')
    .attr('class', 'tooltip tooltip-tropical')
    .style('opacity', 0);

  const setupScales = () => {
    const countX = d3.scaleBand().domain(dataz.map((d) => d.year));

    const countY = d3
      .scaleLinear()
      .domain([0, d3.max(dataz, (d) => d.total * 1.25)]);

    scales.count = { x: countX, y: countY };
  };

  const setupElements = () => {
    const g = svg.select('.chart-tropical-container');

    g.append('g').attr('class', 'axis axis-x');

    g.append('g').attr('class', 'axis axis-y');

    g.append('g').attr('class', 'chart-tropical-container-bis');
  };

  const updateScales = (width, height) => {
    scales.count.x.range([0, width]).paddingInner(-0.1);
    scales.count.y.range([height, 0]);
  };

  const drawAxes = (g) => {
    const axisX = d3
      .axisBottom(scales.count.x)
      .tickFormat(d3.format('d'))
      .ticks(13)
      .tickValues(
        scales.count.x.domain().filter(function(d, i) {
          return !(i % 5);
        })
      );

    g.select('.axis-x')
      .attr('transform', `translate(0,${height})`)
      .call(axisX);

    const axisY = d3
      .axisLeft(scales.count.y)
      .tickFormat(d3.format('d'))
      .ticks(5)
      .tickSizeInner(-width);

    g.select('.axis-y').call(axisY);
  };

  const updateChart = (dataz) => {
    const w = chart.node().offsetWidth;
    const h = 544;

    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

    svg.attr('width', w).attr('height', h);

    const translate = `translate(${margin.left},${margin.top})`;

    const g = svg.select('.chart-tropical-container');

    g.attr('transform', translate);

    updateScales(width, height);

    const container = chart.select('.chart-tropical-container-bis');

    const layer = container.selectAll('.bar-tropical').data(dataz);

    const newLayer = layer
      .enter()
      .append('rect')
      .attr('class', 'bar-tropical');

    layer
      .merge(newLayer)
      .on('mouseover', function(d) {
        const positionX = scales.count.x(d.year);
        const postionWidthTooltip = positionX + 270;
        const tooltipWidth = 210;
        const positionleft = `${d3.event.pageX}px`;
        const positionright = `${d3.event.pageX - tooltipWidth}px`;
        tooltip.transition();
        tooltip
          .style('opacity', 1)
          .html(
            `
                        <p class="tooltip-year">En <strong>${d.year}</strong> hubo un total de <strong>${d.total}</strong> noches tropicales.</p>
                        `
          )
          .style(
            'left',
            postionWidthTooltip > w ? positionright : positionleft
          )
          .style('top', `${d3.event.pageY - 28}px`);
      })
      .on('mouseout', function(d) {
        tooltip
          .transition()
          .duration(300)
          .style('opacity', 0);
      })
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('width', scales.count.x.bandwidth())
      .attr('x', (d) => scales.count.x(d.year))
      .attr('y', (d) => scales.count.y(d.total))
      .attr('height', (d) => height - scales.count.y(d.total));

    drawAxes(g);

    drawAxes(g);
  };

  const resize = () => {
    updateChart(dataz);
  };

  // LOAD THE DATA
  const loadData = () => {
    d3.csv('csv/total-tropicales.csv')
      .then(function(data) {
        dataz = data;
        dataz.forEach((d) => {
          d.year = +d.year;
          d.total = +d.total;
        });
        setupElements();
        setupScales();
        updateChart(dataz);
      });
  };

  window.addEventListener('resize', resize);

  loadData();
}

export default tropicalTotal;
