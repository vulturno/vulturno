function maxRecords() {
  const margin = {
    top: 0,
    right: 48,
    bottom: 24,
    left: 24
  }
  let width = 0;
  let height = 0;
  let w = 0;
  let h = 0;
  const chart = d3.select('.chart-temperature-max');
  const svg = chart.select('svg');
  const scales = {};
  let dataz;

  // Escala para los ejes X e Y
  const setupScales = () => {
    const countX = d3
      .scaleLinear()
      .domain([
        d3.min(dataz, (d) => d.fecha),
        d3.max(dataz, (d) => d.fecha)
      ]);

    const countY = d3
      .scaleLinear()
      .domain([
        d3.min(dataz, (d) => d.total),
        d3.max(dataz, (d) => d.total)
      ]);

    scales.count = { x: countX, y: countY };
  };

  const setupElements = () => {
    const g = svg.select('.chart-temperature-max-container');

    g.append('g').attr('class', 'axis axis-x');

    g.append('g').attr('class', 'chart-temperature-max-container-bis');
  };

  const updateScales = (width) => {
    scales.count.x.range([0, width]);
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

  const danotations = () => {
    d3.csv('csv/max-record.csv', (error, data) => {
      if (error) {
        console.log(error);
      } else {
        dataz = data;
        dataz.forEach((d) => {
          d.fecha = d.yearmax;
          d.total = d.totalmax;
        });
        const labels = [{
          data: { year: 2012 },
          y: 100,
          dy: -50,
          dx: -52,
          note: {
            title: 'Entre 2009 y 2018 se establecen el 78% de los récords de máximas',
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
      }
    });
  };

  const updateChart = (dataz) => {
    w = chart.node().offsetWidth;
    h = 208;

    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

    svg.attr('width', w).attr('height', h);

    const translate = `translate(${margin.left},${margin.top})`;

    const g = svg.select('.chart-temperature-max-container');

    g.attr('transform', translate);

    updateScales(width, height);

    const container = chart.select('.chart-temperature-max-container-bis');

    const layer = container.selectAll('.circles-max').data(dataz);

    const newLayer = layer
      .enter()
      .append('circle')
      .attr('class', 'circles-max');

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

    drawAxes(g);
  };

  const resize = () => {
    updateChart(dataz);
  };

  // LOAD THE DATA
  const loadData = () => {
    d3.csv('csv/max-record.csv', (error, data) => {
      if (error) {
        console.log(error);
      } else {
        dataz = data;
        dataz.forEach((d) => {
          d.fecha = d.yearmax;
          d.total = d.totalmax;
        });
        setupElements();
        setupScales();
        danotations();
        updateChart(dataz);
      }
    });
  };
  window.addEventListener('resize', resize);
  loadData();
}

export default maxRecords;
