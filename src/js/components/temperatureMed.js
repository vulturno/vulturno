import menuSelect from './menuSelect.js'

const selectVulturno = document.getElementById('select-city');

function tempMed() {
  const margin = {
    top: 0,
    right: 16,
    bottom: 24,
    left: 32
  };
  let width = 0;
  let height = 0;
  const chart = d3.select('.chart-vulturno');
  const svg = chart.select('svg');
  const scales = {};
  const temp = 'ºC';
  let datos;
  const tooltipTemp = chart
    .append('div')
    .attr('class', 'tooltip tooltip-temp')
    .style('opacity', 0);
  const bisectDate = d3.bisector((d) => d.year).left;

  const setupScales = () => {
    const countX = d3
      .scaleTime()
      .domain([
        d3.min(datos, (d) => d.year),
        d3.max(datos, (d) => d.year)
      ]);

    const countY = d3
      .scaleLinear()
      .domain([
        d3.min(datos, (d) => d.temp - 1),
        d3.max(datos, (d) => d.temp + 1)
      ]);

    scales.count = { x: countX, y: countY };
  };

  const setupElements = () => {
    const g = svg.select('.chart-vulturno-container');

    g.append('g').attr('class', 'axis axis-x');

    g.append('g').attr('class', 'axis axis-y');

    g.append('g').attr('class', 'chart-vulturno-container-bis');

    g.append('rect').attr('class', 'overlay');

    g.append('g')
      .attr('class', 'focus')
      .style('display', 'none')
      .append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0);

    g.select('.focus')
      .append('text')
      .attr('class', 'text-focus');
  };

  const updateScales = (width, height) => {
    scales.count.x.range([0, width]);
    scales.count.y.range([height, 0]);
  };

  const drawAxes = (g) => {
    const axisX = d3
      .axisBottom(scales.count.x)
      .tickPadding(5)
      .tickFormat(d3.format('d'))
      .ticks(13);

    g.select('.axis-x')
      .attr('transform', `translate(0,${height})`)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(axisX);

    const axisY = d3
      .axisLeft(scales.count.y)
      .tickPadding(5)
      .tickFormat((d) => d + temp)
      .tickSize(-width)
      .ticks(6);

    g.select('.axis-y')
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(axisY);

    const focus = g.select('.focus');

    const overlay = g.select('.overlay');

    focus.select('.x-hover-line').attr('y2', height);

    function mousemove() {
      const w = chart.node().offsetWidth;
      const positionTooltip = w / 2 - 352 / 2;
      const x0 = scales.count.x.invert(d3.mouse(this)[0]);
      const i = bisectDate(datos, x0, 1);
      const d0 = datos[i - 1];
      const d1 = datos[i];
      const d = x0 - d0.fecha > d1.fecha - x0 ? d1 : d0;
      tooltipTemp
        .style('opacity', 1)
        .html(
          `<p class="tooltip-media-texto">En <strong>${d.year}</strong> la temperatura media fue de <strong>${d.temp} ºC</strong>.<p/>`
        )
        .style('left', `${positionTooltip}px`);

      focus
        .select('.x-hover-line')
        .attr(
          'transform',
          `translate(${scales.count.x(d.fecha)},${0})`
        );
    }

    overlay
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .on('mouseover', () => {
        focus.style('display', null);
      })
      .on('mouseout', () => {
        focus.style('display', 'none');
        tooltipTemp.style('opacity', 0);
      })
      .on('mousemove', mousemove);
  };

  function updateChart(data) {
    const w = chart.node().offsetWidth;
    const h = 544;

    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

    svg.attr('width', w).attr('height', h);

    const translate = `translate(${margin.left},${margin.top})`;

    const g = svg.select('.chart-vulturno-container');

    g.attr('transform', translate);

    updateScales(width, height);

    const container = chart.select('.chart-vulturno-container-bis');

    const lines = container.selectAll('.lines').data([datos]);

    const line = d3
      .line()
      .x((d) => scales.count.x(d.year))
      .y((d) => scales.count.y(d.temp));

    const dots = container
      .selectAll('.circles')
      .remove()
      .exit()
      .data(datos);

    const newLines = lines
      .enter()
      .append('path')
      .attr('class', 'lines');

    const dotsLayer = dots
      .enter()
      .append('circle')
      .attr('class', 'circles');

    lines
      .merge(newLines)
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('d', line);

    dots.merge(dotsLayer)
      .attr('cx', (d) => scales.count.x(d.year))
      .attr('cy', 0)
      .transition()
      .delay((d, i) => i * 10)
      .duration(500)
      .ease(d3.easeLinear)
      .attr('cx', (d) => scales.count.x(d.year))
      .attr('cy', (d) => scales.count.y(d.temp));

    drawAxes(g);
  }

  function update(mes) {
    d3.csv(`csv/${mes}.csv`, (error, data) => {
      datos = data;

      datos.forEach((d) => {
        d.temp = +d.temp;
        d.year = d.year;
        d.fecha = +d.year;
        d.tempmax = +d.tempmax;
        d.yearmax = d.yearmax;
        d.tempmin = +d.tempmin;
        d.yearmin = d.yearmin;
      });

      scales.count.x.range([0, width]);
      scales.count.y.range([height, 0]);

      const countX = d3
        .scaleTime()
        .domain([
          d3.min(datos, (d) => d.year),
          d3.max(datos, (d) => d.year)
        ]);

      const countY = d3
        .scaleLinear()
        .domain([
          d3.min(datos, (d) => d.temp - 2),
          d3.max(datos, (d) => d.temp + 2)
        ]);

      scales.count = { x: countX, y: countY };
      updateChart(datos);
    });
  }

  const resize = () => {
    const stationResize = d3
      .select('#select-city')
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
      .replace(/ñ/g, 'n');

    d3.csv(`csv/${stationResize}.csv`, (error, data) => {
      datos = data;
      updateChart(datos);
    });
  };

  const loadData = () => {
    d3.csv('csv/Albacete.csv', (data) => {
      datos = data;
      datos.forEach((d) => {
        d.year = d.year;
        d.temp = d.temp;
        d.fecha = +d.year;
      });
      setupElements();
      setupScales();
      updateChart(datos);
      const mes = 'Albacete';
      update(mes);
    });
  };
  window.addEventListener('resize', resize);

  loadData();
  menuSelect(selectVulturno);
  const selectCity = d3.select('#select-city');
  selectCity.on('change', function() {
    const mes = d3
      .select(this)
      .property('value')
      .replace(/ /g, '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    update(mes);
  });
}

export default tempMed;
