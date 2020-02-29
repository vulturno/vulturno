function recordsMin() {
  const margin = {
    top: 0,
    right: 48,
    bottom: 24,
    left: 24
  };
  let width = 0;
  let height = 0;
  let w = 0;
  let h = 0;
  const chart = d3.select('.chart-temperature-min');
  const svg = chart.select('svg');
  const scales = {};
  let dataz;

  const setupScales = () => {
    const countX = d3
      .scaleLinear()
      .domain([
        d3.min(dataz, (d) => d.fecha),
        d3.max(dataz, (d) => d.fecha)
      ]);
    scales.count = { x: countX };
  };

  const setupElements = () => {
    const g = svg.select('.chart-temperature-min-container');

    g.append('g').attr('class', 'axis axis-x');

    g.append('g').attr('class', 'chart-temperature-min-container-bis');
  };

  const updateScales = (width) => {
    scales.count.x.range([0, width]);
  };

  const danotations = () => {
    d3.csv('csv/min-record.csv')
      .then(function(data) {
        dataz = data;
        dataz.forEach((d) => {
          d.fecha = d.yearmin;
          d.total = d.totalmin;
        });

        // Add annotations
        const labels = [{
          data: { year: 1988 },
          y: 100,
          dy: -50,
          note: {
            title: 'Desde 1986 no se ha batido ni un solo récord de temperatura mínima',
            wrap: 230,
            align: 'middle'
          }
        }].map((l) => {
          this.subject = { radius: 4 };
          return l;
        });

        window.makeAnnotations = d3
          .annotation()
          .annotations(labels)
          .type(d3.annotationCalloutCircle)
          .accessors({
            x: (d) => scales.count.x(d.year),
            y: (d) => scales.count.y(d.total)
          })
          .accessorsInverse({
            year: (d) => scales.count.x.invert(d.x),
            total: (d) => scales.count.y.invert(d.y)
          })
          .on('subjectover', (annotation) => {
            annotation.type.a
              .selectAll(
                'g.annotation-connector, g.annotation-note'
              )
              .classed('hidden', false);
          })
          .on('subjectout', (annotation) => {
            annotation.type.a
              .selectAll(
                'g.annotation-connector, g.annotation-note'
              )
              .classed('hidden', true);
          });

        svg.append('g')
          .attr('class', 'annotation-test')
          .call(makeAnnotations);

        svg.selectAll('g.annotation-connector, g.annotation-note');
      });
  };

  const drawAxes = (g) => {
    const axisX = d3
      .axisBottom(scales.count.x)
      .tickFormat(d3.format('d'))
      .ticks(6)
      .tickPadding(30);

    g.select('.axis-x')
      .attr('transform', `translate(0,${height / 2})`)
      .call(axisX);
  };

  const updateChart = (dataz) => {
    w = chart.node().offsetWidth;
    h = 208;

    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

    svg.attr('width', w).attr('height', h);

    const translate = `translate(${margin.left},${margin.top})`;

    const g = svg.select('.chart-temperature-min-container');

    g.attr('transform', translate);

    updateScales(width, height);

    drawAxes(g);

    const container = chart.select('.chart-temperature-min-container-bis');

    const layer = container.selectAll('.circles-min').data(dataz);

    const newLayer = layer
      .enter()
      .append('circle')
      .attr('class', 'circles-min');

    layer
      .merge(newLayer)
      .attr('cx', (d) => scales.count.x(d.fecha))
      .attr('cy', height / 2)
      .attr('r', 0)
      .transition()
      .delay((d, i) => i * 10)
      .duration(500)
      .attr('r', (d) => 3 * d.total)
      .attr('fill-opacity', 0.6);
  };

  const resize = () => {
    updateChart(dataz);
  };

  // LOAD THE DATA
  const loadData = () => {
    d3.csv('csv/min-record.csv')
      .then(function(data) {
        dataz = data;
        dataz.forEach((d) => {
          d.fecha = d.yearmin;
          d.total = d.totalmin;
        });
        setupElements();
        setupScales();
        danotations();
        updateChart(dataz);
      });
  };

  window.addEventListener('resize', resize);
  loadData();
}

export default recordsMin;
