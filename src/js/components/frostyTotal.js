function frostyTotal() {
  const margin = {
    top: 0,
    right: 16,
    bottom: 24,
    left: 32
  };
  let width = 0;
  let height = 0;
  const chart = d3.select('.chart-frosty');
  const svg = chart.select('svg');
  const scales = {};
  let dataz;

  const setupScales = () => {
    const countX = d3
      .scaleTime()
      .domain([
        d3.min(dataz, (d) => d.year),
        d3.max(dataz, (d) => d.year)
      ]);

    const countY = d3
      .scaleLinear()
      .domain([0, d3.max(dataz, (d) => d.total * 1.25)]);

    scales.count = { x: countX, y: countY };
  };

  const setupElements = () => {
    const g = svg.select('.chart-frosty-container');

    g.append('g').attr('class', 'axis axis-x');

    g.append('g').attr('class', 'axis axis-y');

    g.append('g').attr('class', 'chart-frosty-container-bis');
  };

  const updateScales = (width, height) => {
    scales.count.x.range([0, width]);
    scales.count.y.range([height, 0]);
  };

  const drawAxes = (g) => {
    const axisX = d3
      .axisBottom(scales.count.x)
      .tickFormat(d3.format('d'))
      .ticks(13);

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

    const g = svg.select('.chart-frosty-container');

    g.attr('transform', translate);

    const area = d3
      .area()
      .x((d) => scales.count.x(d.year))
      .y0(height)
      .y1((d) => scales.count.y(d.total));

    updateScales(width, height);

    const container = chart.select('.chart-frosty-container-bis');

    const layer = container.selectAll('.area-frosty').data([dataz]);

    const newLayer = layer
      .enter()
      .append('path')
      .attr('class', 'area-frosty');

    layer
      .merge(newLayer)
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('d', area);

    drawAxes(g);
  };

  const resize = () => {
    updateChart(dataz);
  };

  // LOAD THE DATA
  const loadData = () => {
    d3.csv('csv/total-heladas.csv')
      .then(function(data) {
        dataz = data;
        dataz.forEach((d) => {
          d.year = d.year;
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

export default frostyTotal;
