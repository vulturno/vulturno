import menuSelect from './menuSelect.js'
const selectScatter = document.getElementById('select-scatter-city')

function scatterTemp() {
  const margin = {
    top: 16,
    right: 16,
    bottom: 32,
    left: 32
  };
  let width = 0;
  let height = 0;
  const chart = d3.select('.scatter-inputs');
  const svg = chart.select('svg');
  const scales = {};
  let dataz;
  let reValueDate;
  const temp = 'ºC';
  const selectCity = d3.select('#select-scatter-city');
  const tooltip = d3
    .select('.scatter-inputs')
    .append('div')
    .attr('class', 'tooltip tooltip-scatter')
    .style('opacity', 0);

  let returnDate = function() {
    let valueDateDay = d3.select('#updateButtonDay').property('value');
    let valueDateMonth = d3.select('#updateButtonMonth').property('value');
    if (valueDateDay < 10) valueDateDay = `0${valueDateDay}`.slice(-2);
    if (valueDateMonth < 10)
      valueDateMonth = `0${valueDateMonth}`.slice(-2);
    const valueDate = `${valueDateMonth}-${valueDateDay}`;
    const reValueDate = new RegExp(`^.*${valueDate}$`, 'gi');
    return reValueDate;
  }

  reValueDate = returnDate()

  const getYear = (stringDate) => stringDate.split('-')[0];

  const setupScales = () => {
    const countX = d3
      .scaleLinear()
      .domain([
        d3.min(dataz, (d) => d.year),
        d3.max(dataz, (d) => d.year)
      ]);

    const countY = d3
      .scaleLinear()
      .domain([
        d3.min(dataz, (d) => d.minima - 10),
        d3.max(dataz, (d) => d.minima + 10)
      ]);

    scales.count = { x: countX, y: countY };
  };

  const setupElements = () => {
    const g = svg.select('.scatter-inputs-container');

    g.append('g').attr('class', 'axis axis-x');

    g.append('g').attr('class', 'axis axis-y');

    g.append('g').attr('class', 'scatter-inputs-container-dos');

  };

  const updateScales = (width, height) => {
    scales.count.x.range([0, width]);
    scales.count.y.range([height, 0]);
  };

  const drawAxes = (g) => {
    const axisX = d3
      .axisBottom(scales.count.x)
      .tickPadding(10)
      .tickFormat(d3.format('d'))
      .ticks(10);

    g.select('.axis-x')
      .attr('transform', `translate(0,${height})`)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(axisX);

    const axisY = d3
      .axisLeft(scales.count.y)
      .tickFormat((d) => d + temp)
      .tickSize(-width)
      .ticks(6);

    g.select('.axis-y')
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .call(axisY);


  };

  const updateChart = (dataz) => {
    const w = chart.node().offsetWidth;
    const h = 544;

    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

    svg.attr('width', w).attr('height', h);

    const translate = `translate(${margin.left},${margin.top})`;

    const g = svg.select('.scatter-inputs-container');

    g.attr('transform', translate);

    const line = d3
      .line()
      .x((d) => scales.count.x(d.year))
      .y((d) => scales.count.y(d.minima));

    updateScales(width, height);

    const container = chart.select('.scatter-inputs-container-dos');

    const layer = container
      .selectAll('.scatter-inputs-circles')
      .remove()
      .exit()
      .data(dataz);

    const lines = container.selectAll('.lines').data([dataz]);

    const newLayer = layer
      .enter()
      .append('circle')
      .attr('class', 'scatter-inputs-circles');

    const ciudad = selectCity.property('value');

    const newLines = lines
      .enter()
      .append('path')
      .attr('class', 'lines');

    lines
      .merge(newLines)
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('d', line);

    layer
      .merge(newLayer)
      .on('mouseover', (d) => {
        const positionX = scales.count.x(d.year);
        const postionWidthTooltip = positionX + 270;
        const tooltipWidth = 210;
        const positionleft = `${d3.event.pageX}px`;
        const positionright = `${d3.event.pageX - tooltipWidth}px`;
        tooltip.transition();
        tooltip.attr('class', 'tooltip tooltip-scatter tooltip-min');
        tooltip
          .style('opacity', 1)
          .html(
            `<p class="tooltip-scatter-text">La temperatura mínima de ${ciudad} en ${d.year} fue de ${d.minima}ºC<p/>`
          )
          .style(
            'left',
            postionWidthTooltip > w ? positionright : positionleft
          )
          .style('top', `${d3.event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0);
      })
      .attr('cx', (d) => scales.count.x(d.year))
      .attr('cy', (d, i) => i * (Math.random() * i))
      .attr('fill-opacity', 1)
      .transition()
      .delay((d, i) => i * 10)
      .duration(450)
      .ease(d3.easeLinear)
      .attr('cx', (d) => scales.count.x(d.year))
      .attr('cy', (d) => scales.count.y(d.minima))
      .style('fill', '#257d98');

    drawAxes(g);
  };

  const updateMax = () => {

    reValueDate = returnDate()

    errorDate();

    const ciudad = selectCity
      .property('value')
      .replace(/ /g, '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    d3.csv(`csv/day-by-day/${ciudad}-diarias.csv`)
      .then(function(data) {
        dataz = data.filter((d) => String(d.fecha).match(reValueDate));

        dataz.forEach((d) => {
          d.fecha = d.fecha;
          d.maxima = +d.maxima;
          d.minima = +d.minima;
          d.year = getYear(d.fecha);
        });

        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);

        const countX = d3
          .scaleTime()
          .domain([
            d3.min(dataz, (d) => d.year),
            d3.max(dataz, (d) => d.year)
          ]);

        const countY = d3
          .scaleLinear()
          .domain([
            d3.min(dataz, (d) => d.maxima - 10),
            d3.max(dataz, (d) => d.maxima + 10)
          ]);

        const w = chart.node().offsetWidth;
        const h = 544;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        scales.count = { x: countX, y: countY };

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.scatter-inputs-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const line = d3
          .line()
          .x((d) => scales.count.x(d.year))
          .y((d) => scales.count.y(d.maxima));

        const container = chart.select('.scatter-inputs-container-dos');

        const lines = container.selectAll('.lines').data([dataz]);

        const newLines = lines
          .enter()
          .append('path')
          .attr('class', 'lines');

        lines
          .merge(newLines)
          .transition()
          .duration(600)
          .ease(d3.easeLinear)
          .attr('d', line);

        const layer = container
          .selectAll('.scatter-inputs-circles')
          .remove()
          .exit()
          .data(dataz);

        const newLayer = layer
          .enter()
          .append('circle')
          .attr('class', 'scatter-inputs-circles');

        const ciudad = selectCity.property('value');

        layer
          .merge(newLayer)
          .on('mouseover', (d) => {
            const w = chart.node().offsetWidth;
            const positionX = scales.count.x(d.year);
            const postionWidthTooltip = positionX + 270;
            const tooltipWidth = 210;
            const positionleft = `${d3.event.pageX}px`;
            const positionright = `${d3.event.pageX - tooltipWidth}px`;
            tooltip.transition();
            tooltip.attr(
              'class',
              'tooltip tooltip-scatter tooltip-max'
            );
            tooltip
              .style('opacity', 1)
              .html(
                `<p class="tooltip-scatter-text">La temperatura máxima de ${ciudad} en ${d.year} fue de ${d.maxima}ºC<p/>`
              )
              .style(
                'left',
                postionWidthTooltip > w ?
                  positionright :
                  positionleft
              )
              .style('top', `${d3.event.pageY - 28}px`);
          })
          .on('mouseout', () => {
            tooltip
              .transition()
              .duration(200)
              .style('opacity', 0);
          })
          .attr('cx', (d) => scales.count.x(d.year))
          .attr('cy', (d, i) => i * (Math.random() * i))
          .attr('fill-opacity', 1)
          .transition()
          .delay((d, i) => i * 10)
          .duration(450)
          .ease(d3.easeLinear)
          .attr('cx', (d) => scales.count.x(d.year))
          .attr('cy', (d) => scales.count.y(d.maxima))
          .attr('r', 6)
          .style('fill', '#dc7176');

        drawAxes(g);
      });
  };

  const errorDate = () => {
    const monthFail = document.getElementById('fail-month');
    const valueDateDay = d3.select('#updateButtonDay').property('value');
    const valueDateMonth = d3
      .select('#updateButtonMonth')
      .property('value');
    const year = '2020'; // Hardcodeamos el año a 2020 por ser bisiesto y permitir 29 febrero
    if (!isValidDate(valueDateDay, valueDateMonth, year)) {
      monthFail.classList.add('fail-active');
    } else {
      monthFail.classList.remove('fail-active');
    }
  };

  const isValidDate = (day, month, year) => {
    const date = new Date();
    date.setFullYear(year, month - 1, day); // month - 1 porque empiezan en 0 (enero = 0)
    return (
      date.getFullYear() == year &&
      date.getMonth() == month - 1 &&
      date.getDate() == day
    );
  };

  const updateMin = () => {

    reValueDate = returnDate()

    errorDate();

    const ciudad = selectCity
      .property('value')
      .replace(/ /g, '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    d3.csv(`csv/day-by-day/${ciudad}-diarias.csv`)
      .then(function(data) {
        dataz = dataz.filter((d) => String(d.fecha).match(reValueDate));

        dataz.forEach((d) => {
          d.fecha = d.fecha;
          d.maxima = +d.maxima;
          d.minima = +d.minima;
          d.year = getYear(d.fecha);
        });

        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);

        const countX = d3
          .scaleTime()
          .domain([
            d3.min(dataz, (d) => d.year),
            d3.max(dataz, (d) => d.year)
          ]);

        const countY = d3
          .scaleLinear()
          .domain([
            d3.min(dataz, (d) => d.minima - 10),
            d3.max(dataz, (d) => d.minima + 10)
          ]);

        scales.count = { x: countX, y: countY };

        updateChart(dataz);
      });
  };

  const resize = () => {
    updateMax();
  };

  d3.select('#update').on('click', (dataz) => {
    updateMax();
  });

  d3.select('#updateMin').on('click', (dataz) => {
    updateMin();
  });

  function update() {
    updateMax();
  }

  // LOAD THE DATA
  const loadData = () => {
    d3.csv('csv/day-by-day/Albacete-diarias.csv')
      .then(function(data) {
        dataz = data.filter((d) => String(d.fecha).match(reValueDate));

        dataz.forEach((d) => {
          d.fecha = d.fecha;
          d.maxima = +d.maxima;
          d.minima = +d.minima;
          d.year = getYear(d.fecha);
        });
        setupElements();
        setupScales();
        updateChart(dataz);
      });
  };

  window.addEventListener('resize', resize);

  loadData()

  menuSelect(selectScatter);
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

export default scatterTemp;
