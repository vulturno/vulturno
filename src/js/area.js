function menu() {
    var overlay = document.querySelector('.overlay');
    var navigation = document.querySelector('.navegacion');
    var body = document.querySelector('body');
    var elementBtn = document.querySelectorAll('.navegacion-btn');
    var burger = document.querySelector('.burger');

    function classToggle() {
        burger.classList.toggle('clicked');
        overlay.classList.toggle('show');
        navigation.classList.toggle('show');
        body.classList.toggle('overflow');
    }

    document.querySelector('.burger').addEventListener('click', classToggle);
    document.querySelector('.overlay').addEventListener('click', classToggle);

    for (i = 0; i < elementBtn.length; i++) {
        elementBtn[i].addEventListener('click', function() {
            removeClass();
            console.log('click');
        });
    }

    function removeClass() {
        overlay.classList.remove('show');
        navigation.classList.remove('show');
        burger.classList.remove('clicked');
    }
}

menu();

function quotes() {
    const list = [
        '<span class="notas-text">La Central Térmica de <strong>AS Pontes</strong> propiedad de <strong>Endesa</strong> es el <strong>mayor emisor de CO2<strong> en España.',
        '<span class="notas-text">La Central Térmica de <strong>Aboño</strong> propiedad de <strong>Endesa</strong> es el <strong>segundo mayor emisor de CO2<strong> en España.',
        '<span class="notas-text">La Central Térmica de <strong>Litoral</strong> propiedad de <strong>Endesa</strong> es el <strong>tercer emisor de CO2<strong> en España.',
        '<span class="notas-text">La Siderurgica de <strong>ArcelorMittal</strong> es el <strong>cuarto emisor de CO2<strong> en España.',
        '<span class="notas-text">La Central Térmica de <strong>Teruel</strong> propiedad de <strong>Endesa</strong> es el <strong>quinto emisor de CO2<strong> en España.'
    ];

    const randomQuote = Math.floor(Math.random() * list.length);
    document.getElementById('notas').innerHTML = list[randomQuote];
}

quotes();

const colorMax = d3.scaleOrdinal([
    '#f6d2d5',
    '#f0b7bc',
    '#ea969d',
    '#e16973',
    '#cc0011',
    '#a2000d',
    '#b8000f'
]);
const colorMin = d3.scaleOrdinal([
    '#004d84',
    '#005da0',
    '#006bb7',
    '#0077cc',
    '#4a9eda',
    '#7db9e5',
    '#a5cfed'
]);
const colores = [colorMax, colorMin];
const widthMobile = window.innerWidth > 0 ? window.innerWidth : screen.width;

const csvForce = ['csv/total-records-max.csv', 'csv/total-records-min.csv'];

const records = ['maxima', 'minima'];

const maxmin = ['max', 'min'];

function formatDate() {
    const d = new Date();
    const dayString = d.getDate();
    const monthString = d.getMonth() + 1;

    document.getElementById('updateButtonDay').value = dayString;
    document.getElementById('updateButtonMonth').value = monthString;
}

formatDate();

function forceLayout(csvFile, record, color) {
    const chart = d3.select(`.chart-force-${record}`);
    const svg = chart.select('svg');
    const nodePadding = 1.5;
    let dataz;

    const tooltip = chart
        .append('div')
        .attr('class', 'tooltip tooltip-record')
        .style('opacity', 0);

    const tooltipDecade = chart
        .append('div')
        .attr('class', 'tooltip tooltip-decade')
        .style('opacity', 0);

    svg.append('text')
        .attr('class', 'legend-title')
        .text('Décadas');

    if (widthMobile > 544) {
        svg.select('.legend-title').attr('transform', 'translate(50,110)');
    } else {
        svg.select('.legend-title').attr('transform', 'translate(0,30)');
    }

    function updateChart(dataz) {
        const w = chart.node().offsetWidth;
        const h = 600;

        svg.attr('width', w).attr('height', h);

        const node = svg
            .selectAll(`.circle-${record}`)
            .remove()
            .exit()
            .data(dataz)
            .enter()
            .append('circle')
            .attr('class', `circle-${record}`)
            .attr('r', (d) => d.radius)
            .attr('fill', (d) => color(d.decade))
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .on('mouseover', function(d) {
                const circleUnderMouse = this;
                d3.selectAll(`.circle-${record}`)
                    .filter(function(d, i) {
                        return this !== circleUnderMouse;
                    })
                    .transition()
                    .duration(300)
                    .ease(d3.easeLinear)
                    .style('opacity', 0.1);

                tooltip.transition();
                tooltip.style(
                    'opacity',
                    1
                ).html(`<p class="tooltip-record-max">En <span class="number">${d.year}</span> se establecieron <span class="number">${d.total}</span> récords.<p/>
                        `);
            })
            .on('mouseout', () => {
                d3.selectAll(`.circle-${record}`)
                    .transition()
                    .duration(800)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0);
            });

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
            .force('collision', d3.forceCollide().radius((d) => d.radius + 1));

        simulation
            .nodes(dataz)
            .force(
                'collide',
                d3
                    .forceCollide()
                    .strength(0.5)
                    .radius((d) => d.radius + nodePadding)
                    .iterations(1)
            )
            .on('tick', () =>
                node.attr('cx', ({ x }) => x).attr('cy', ({ y }) => y)
            );

        const legendData = d3.group(dataz.map((d) => d.decade));
        let unique = legendData.filter(
            (elem, pos) => legendData.indexOf(elem) === pos
        );

        unique = unique.reverse((d) => d.decade);

        const legend = svg
            .selectAll(`.legend-${record}`)
            .remove()
            .exit()
            .data(unique, (d) => d)
            .enter()
            .append('g')
            .attr('class', `legend-${record}`)
            .attr('year', (d) => d);

        if (widthMobile > 544) {
            legend.attr(
                'transform',
                (d, i) => `translate(${50},${(i + 5) * 25})`
            );
            legend
                .append('text')
                .attr('x', 20)
                .attr('y', 10)
                .text((d) => d);
        } else {
            legend.attr('transform', (d, i) => `translate(${i * 45},${50})`);
            legend
                .append('text')
                .attr('x', 14)
                .attr('y', 9)
                .text((d) => d);
        }

        legend
            .append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', (d) => color(d));

        function tooltipLast(leyenda) {
            const valueYear = leyenda.attr('year');

            d3.csv(csvFile, (error, data) => {
                const dataz = data.filter((d) =>
                    String(d.decade).match(valueYear)
                );

                tooltipDecade
                    .data(dataz)
                    .style('opacity', 1)
                    .html(
                        (d) =>
                            `<p class="tooltip-record-max">Entre <span class="number">${
                                d.decade
                            }</span> y <span class="number">${Number(d.decade) +
                                9}</span> se establecieron <span class="number">${
                                d.totaldecade
                            }</span> récords de temperatura ${record}.<p/>`
                    );
            });
        }

        legend
            .on('mouseover', function(tipo) {
                const legendThis = d3.select(this);
                d3.selectAll(`.legend-${record}`)
                    .transition()
                    .duration(300)
                    .ease(d3.easeLinear)
                    .style('opacity', 0.1);
                legendThis
                    .transition()
                    .duration(300)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
                d3.selectAll(`.circle-${record}`)
                    .transition()
                    .duration(200)
                    .ease(d3.easeLinear)
                    .style('opacity', 0.1)
                    .filter((d) => d.decade === tipo)
                    .transition()
                    .duration(300)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
                d3.select(this).call(tooltipLast);
            })
            .on('mouseout', () => {
                d3.selectAll(`.legend-${record}`)
                    .transition()
                    .duration(300)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
                d3.selectAll(`.circle-${record}`)
                    .transition()
                    .duration(300)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
                tooltipDecade.style('opacity', 0);
            });
    }

    function loadData() {
        d3.csv(csvFile, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    if (widthMobile > 544) {
                        d.size = +d.total / 10;
                    } else {
                        d.size = +d.total / 17;
                    }
                    d.radius = +d.size;
                    d.year = d.year;
                });
                updateChart(dataz);
            }
        });
    }

    const resize = () => {
        updateChart(dataz);
    };

    window.addEventListener('resize', resize);

    loadData();
}

forceLayout(csvForce[0], records[0], colores[0]);
forceLayout(csvForce[1], records[1], colores[1]);

const vulturno = () => {
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

        const line = d3
            .line()
            .x((d) => scales.count.x(d.year))
            .y((d) => scales.count.y(d.temp));

        updateScales(width, height);

        const container = chart.select('.chart-vulturno-container-bis');

        const lines = container.selectAll('.lines').data([datos]);

        const newLines = lines
            .enter()
            .append('path')
            .attr('class', 'lines');

        const dots = container
            .selectAll('.circles')
            .remove()
            .exit()
            .data(datos);

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
                    d3.min(datos, (d) => d.temp - 1),
                    d3.max(datos, (d) => d.temp + 1)
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

    const menuMes = () => {
        d3.csv('csv/stations.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                datos = data;

                const nest = d3
                    .nest()
                    .key((d) => d.Name)
                    .entries(datos);

                const selectCity = d3.select('#select-city');

                selectCity
                    .selectAll('option')
                    .data(nest)
                    .enter()
                    .append('option')
                    .attr('value', (d) => d.key)
                    .text((d) => d.key);

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
    menuMes();
};

const maxvul = () => {
    // Estructura similar a la que utilizan en algunos proyectos de pudding.cool
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
                const labels = [
                    {
                        data: { year: 2012 },
                        y: 100,
                        dy: -50,
                        dx: -52,
                        note: {
                            title:
                                'Entre 2009 y 2018 se establecen el 78% de los récords de máximas',
                            wrap: 230,
                            align: 'middle'
                        }
                    }
                ].map((l) => {
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
};

const minvul = () => {
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
        d3.csv('csv/min-record.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.fecha = d.yearmin;
                    d.total = d.totalmin;
                });

                // Add annotations
                const labels = [
                    {
                        data: { year: 1988 },
                        y: 100,
                        dy: -50,
                        note: {
                            title:
                                'Desde 1986 no se ha batido ni un solo récord de temperatura mínima',
                            wrap: 230,
                            align: 'middle'
                        }
                    }
                ].map((l) => {
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
        d3.csv('csv/min-record.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.fecha = d.yearmin;
                    d.total = d.totalmin;
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
};

const tropicalTotal = () => {
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
        d3.csv('csv/total-tropicales.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.year = +d.year;
                    d.total = +d.total;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const frostyTotal = () => {
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
        d3.csv('csv/total-heladas.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.year = d.year;
                    d.total = +d.total;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const scatterInput = () => {
    const margin = {
        top: 16,
        right: 16,
        bottom: 24,
        left: 32
    };
    let width = 0;
    let height = 0;
    const chart = d3.select('.scatter-inputs');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const temp = 'ºC';
    const selectCity = d3.select('#select-scatter-city');
    const tooltip = d3
        .select('.scatter-inputs')
        .append('div')
        .attr('class', 'tooltip tooltip-scatter')
        .style('opacity', 0);

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
                d3.min(dataz, (d) => d.minima),
                d3.max(dataz, (d) => d.minima)
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
            .tickSize(-height)
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

        updateScales(width, height);

        const container = chart.select('.scatter-inputs-container-dos');

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

    const menuCiudad = () => {
        d3.csv('csv/stations.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                datos = data;

                const nest = d3
                    .nest()
                    .key((d) => d.Name)
                    .entries(datos);

                selectCity
                    .selectAll('option')
                    .data(nest)
                    .enter()
                    .append('option')
                    .attr('value', (d) => d.key)
                    .text((d) => d.key);

                selectCity.on('change', () => {
                    update();
                });
            }
        });
    };

    const updateMax = () => {
        let valueDateDay = d3.select('#updateButtonDay').property('value');
        let valueDateMonth = d3.select('#updateButtonMonth').property('value');
        if (valueDateDay < 10) valueDateDay = `0${valueDateDay}`.slice(-2);
        if (valueDateMonth < 10)
            valueDateMonth = `0${valueDateMonth}`.slice(-2);
        let valueDate = `${valueDateMonth}-${valueDateDay}`;
        let reValueDate = new RegExp(`^.*${valueDate}$`, 'gi');

        errorDate();

        const ciudad = selectCity
            .property('value')
            .replace(/ /g, '_')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        d3.csv(`csv/day-by-day/${ciudad}-diarias.csv`, (error, dataz) => {
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
                    d3.min(dataz, (d) => d.maxima),
                    d3.max(dataz, (d) => d.maxima)
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

            const container = chart.select('.scatter-inputs-container-dos');

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
                            postionWidthTooltip > w
                                ? positionright
                                : positionleft
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
                .attr('cy', (d) => scales.count.y(d.minima))
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
        let valueDateDay = d3.select('#updateButtonDay').property('value');
        let valueDateMonth = d3.select('#updateButtonMonth').property('value');
        if (valueDateDay < 10) valueDateDay = `0${valueDateDay}`.slice(-2);
        if (valueDateMonth < 10)
            valueDateMonth = `0${valueDateMonth}`.slice(-2);
        const valueDate = `${valueDateMonth}-${valueDateDay}`;
        const reValueDate = new RegExp(`^.*${valueDate}$`, 'gi');

        errorDate();

        const ciudad = selectCity
            .property('value')
            .replace(/ /g, '_')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        d3.csv(`csv/day-by-day/${ciudad}-diarias.csv`, (error, dataz) => {
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
                    d3.min(dataz, (d) => d.minima),
                    d3.max(dataz, (d) => d.minima)
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
        d3.csv('csv/day-by-day/Albacete-diarias.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;

                dataz = data.filter((d) => String(d.fecha).match(/08-01$/));

                dataz.forEach((d) => {
                    d.fecha = d.fecha;
                    d.maxima = +d.maxima;
                    d.minima = +d.minima;
                    d.year = getYear(d.fecha);
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
    menuCiudad();
};

const tropicalCities = () => {
    const margin = {
        top: 16,
        right: 16,
        bottom: 24,
        left: 24
    };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-cities-tropical');
    const svg = chart.select('svg');
    const scales = {};
    let datos;
    const tooltip = chart
        .append('div')
        .attr('class', 'tooltip tooltip-tropical')
        .style('opacity', 0);

    const setupScales = () => {
        const countX = d3.scaleBand().domain(datos.map((d) => d.fecha));

        const countY = d3
            .scaleLinear()
            .domain([0, d3.max(datos, (d) => d.tropical * 1.25)]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.chart-cities-tropical-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-cities-tropical-container-bis');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]).paddingInner(-0.1);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickPadding(5)
            .tickFormat(d3.format('d'))
            .tickValues(
                scales.count.x.domain().filter(function(d, i) {
                    return !(i % 5);
                })
            );

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickPadding(5)
            .tickFormat((d) => d)
            .tickSize(-width)
            .ticks(6);

        g.select('.axis-y')
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisY);
    };

    function updateChart(data) {
        const w = chart.node().offsetWidth;
        const h = 450;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.chart-cities-tropical-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.chart-cities-tropical-container-bis');

        const layer = container.selectAll('.bar-cities-tropical').data(datos);

        const newLayer = layer
            .enter()
            .append('rect')
            .attr('class', 'bar-cities-tropical');

        layer
            .merge(newLayer)
            .on('mouseover', function(d) {
                const positionX = scales.count.x(d.fecha);
                const postionWidthTooltip = positionX + 270;
                const tooltipWidth = 210;
                const positionleft = `${d3.event.pageX}px`;
                const positionright = `${d3.event.pageX - tooltipWidth}px`;
                tooltip.transition();
                tooltip
                    .style('opacity', 1)
                    .html(
                        `
                        <p class="tooltip-year">En <strong>${d.fecha}</strong> hubo un total de <strong>${d.tropical}</strong> noches tropicales.</p>
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
    }

    function update(city) {
        d3.csv(`csv/tropicales/${city}-total-tropicales.csv`, (error, data) => {
            datos = data;

            datos.forEach((d) => {
                d.fecha = +d.year;
                d.tropical = +d.total;
            });

            setupScales();
            updateChart(datos);
        });
    }

    const resize = () => {
        const stationResize = d3
            .select('#select-city-tropical')
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

        d3.csv(
            `csv/tropicales/${stationResize}-total-tropicales.csv`,
            (error, data) => {
                datos = data;
                updateChart(datos);
            }
        );
    };

    const menuCity = () => {
        d3.csv('csv/stations.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                datos = data;

                const nest = d3
                    .nest()
                    .key((d) => d.Name)
                    .entries(datos);

                const selectCity = d3.select('#select-city-tropical');

                selectCity
                    .selectAll('option')
                    .data(nest)
                    .enter()
                    .append('option')
                    .attr('value', (d) => d.key)
                    .text((d) => d.key);

                selectCity.on('change', function() {
                    const city = d3
                        .select(this)
                        .property('value')
                        .replace(/ /g, '_')
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '');
                    update(city);
                });
            }
        });
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv(
            'csv/tropicales/Albacete-total-tropicales.csv',
            (error, data) => {
                if (error) {
                    console.log(error);
                } else {
                    datos = data;
                    datos.forEach((d) => {
                        d.fecha = +d.year;
                        d.tropical = +d.total;
                    });
                    setupElements();
                    setupScales();
                    updateChart(datos);
                    const city = 'Albacete';
                    update(city);
                }
            }
        );
    };
    window.addEventListener('resize', resize);
    loadData();
    menuCity();
};

const tempExt = () => {
    const margin = {
        top: 16,
        right: 16,
        bottom: 24,
        left: 32
    };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-temperature-ext');
    const svg = chart.select('svg');
    const scales = {};
    let datos;
    const tooltip = chart
        .append('div')
        .attr('class', 'tooltip tooltip-tropical')
        .style('opacity', 0);

    const setupScales = () => {
        const countX = d3.scaleBand().domain(datos.map((d) => d.fecha));

        const countY = d3
            .scaleLinear()
            .domain([0, d3.max(datos, (d) => d.tropical * 1.25)]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.chart-temperature-ext-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-temperature-ext-container-bis');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]).paddingInner(-0.1);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickPadding(5)
            .tickFormat(d3.format('d'))
            .ticks(13)
            .tickValues(
                scales.count.x.domain().filter(function(d, i) {
                    return !(i % 5);
                })
            );

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickPadding(5)
            .tickFormat((d) => d)
            .tickSize(-width)
            .ticks(6);

        g.select('.axis-y')
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisY);
    };

    function updateChart(data) {
        const w = chart.node().offsetWidth;
        const h = 544;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.chart-temperature-ext-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.chart-temperature-ext-container-bis');

        const layer = container.selectAll('.rect-ext').data(datos);

        const newLayer = layer
            .enter()
            .append('rect')
            .attr('class', 'rect-ext');

        layer
            .merge(newLayer)
            .on('mouseover', function(d) {
                const stationResize = d3
                    .select('#select-ext')
                    .property('value');
                const positionX = scales.count.x(d.fecha);
                const postionWidthTooltip = positionX + 270;
                const tooltipWidth = 210;
                const positionleft = `${d3.event.pageX}px`;
                const positionright = `${d3.event.pageX - tooltipWidth}px`;
                tooltip.transition();
                tooltip
                    .style('opacity', 1)
                    .html(
                        `
                                <p class="tooltip-year">En <strong>${d.fecha}</strong> hubo <strong>${d.tropical}</strong> días en los que la máxima fue superior a <strong>${stationResize}ºC</strong>.</p>
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
            .attr('x', (d) => scales.count.x(d.fecha))
            .attr('y', (d) => scales.count.y(d.tropical))
            .attr('height', (d) => height - scales.count.y(d.tropical));

        drawAxes(g);
    }

    function update(mes) {
        d3.csv(`csv/total-temp-${mes}.csv`, (error, data) => {
            datos = data;

            datos.forEach((d) => {
                d.fecha = +d.year;
                d.tropical = +d.total;
            });

            setupScales();
            updateChart(datos);
        });
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
            .replace(/ñ/g, 'n');

        d3.csv(`csv/total-temp-${stationResize}.csv`, (error, data) => {
            datos = data;
            datos.forEach((d) => {
                d.fecha = +d.year;
                d.tropical = +d.total;
            });

            updateChart(datos);
        });
    };

    const menuMes = () => {
        d3.csv('csv/temperature.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                datos = data;

                const nest = d3
                    .nest()
                    .key((d) => d.Name)
                    .entries(datos);

                const selectCity = d3.select('#select-ext');

                selectCity
                    .selectAll('option')
                    .data(nest)
                    .enter()
                    .append('option')
                    .attr('value', ({ key }) => key)
                    .text(({ key }) => `${key}ºC`);

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
        });
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv('csv/total-temp-35.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                datos = data;
                datos.forEach((d) => {
                    d.fecha = +d.year;
                    d.tropical = +d.total;
                });
                setupElements();
                setupScales();
                updateChart(datos);
                const mes = '35';
                update(mes);
            }
        });
    };
    window.addEventListener('resize', resize);
    loadData();
    menuMes();
};

function directionalDot(maxmins) {
    const margin = {
        top: 16,
        right: 16,
        bottom: 32,
        left: 48
    };
    let width = 0;
    let height = 0;
    const chart = d3.select(`.chart-diff-records-${maxmins}`);
    const svg = chart.select('svg');
    const scales = {};
    const temp = 'ºC';
    let dataz;
    const tooltip = d3
        .select(`.chart-diff-records-${maxmins}`)
        .append('div')
        .attr('class', 'tooltip tooltip-diff')
        .style('opacity', 0);
    const selectMonth = d3.select(`#select-month-${maxmins}`);
    const selectCity = d3.select(`#select-cities-records-${maxmins}`);
    const tempThis = `${maxmins}`;

    const setupScales = () => {
        if (tempThis === 'max') {
            const countX = d3
                .scaleTime()
                .domain([
                    d3.min(dataz, (d) => d.dia),
                    d3.max(dataz, (d) => d.dia)
                ]);

            const countY = d3
                .scaleLinear()
                .domain([
                    d3.min(dataz, (d) => d.segundo - 1),
                    d3.max(dataz, (d) => d.primero + 1)
                ]);
            scales.count = { x: countX, y: countY };
        } else {
            const countX = d3
                .scaleTime()
                .domain([
                    d3.min(dataz, (d) => d.dia),
                    d3.max(dataz, (d) => d.dia)
                ]);

            const countY = d3
                .scaleLinear()
                .domain([
                    d3.min(dataz, (d) => d.primero - 1),
                    d3.max(dataz, (d) => d.segundo + 1)
                ]);
            scales.count = { x: countX, y: countY };
        }
    };

    const setupElements = () => {
        const g = svg.select('.chart-diff-records-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-diff-records-container-bis');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([15, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickPadding(5)
            .tickFormat(d3.format('d'))
            .ticks(31);

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
            .ticks(15)
            .tickSizeInner(-width);

        g.select('.axis-y')
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.chart-diff-records-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.chart-diff-records-container-bis');

        const layer = container
            .selectAll(`.circle-primero-${maxmins}`)
            .data(dataz);

        layer.exit().remove();

        const layerDos = container
            .selectAll(`.circle-segundo-${maxmins}`)
            .data(dataz);

        layerDos.exit().remove();

        const layerLine = container.selectAll('.circle-lines').data(dataz);

        layerLine.exit().remove();

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', `circle-primero-${maxmins}`);

        const newLayerDos = layerDos
            .enter()
            .append('circle')
            .attr('class', `circle-segundo-${maxmins}`);

        const newLayerLines = layerLine
            .enter()
            .append('line')
            .attr('class', 'circle-lines');

        layerLine
            .merge(newLayerLines)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('x1', (d) => scales.count.x(d.dia))
            .attr('y1', (d) => {
                if (tempThis === 'max') {
                    return scales.count.y(d.primero) + 6;
                }
                return scales.count.y(d.primero) - 6;
            })
            .attr('x2', (d) => scales.count.x(d.dia))
            .attr('y2', (d) => {
                if (tempThis === 'max') {
                    return scales.count.y(d.segundo) - 6;
                }
                return scales.count.y(d.segundo) + 6;
            })
            .attr('stroke', (d) => {
                if (d.diff === 0) {
                    return 'none';
                }
                return '#111';
            });

        const city = selectCity.property('value');

        layer
            .merge(newLayer)
            .on('mouseover', (d) => {
                const positionX = scales.count.x(d.dia);
                const postionWidthTooltip = positionX + 270;
                const tooltipWidth = 210;
                const positionleft = `${d3.event.pageX}px`;
                const positionright = `${d3.event.pageX - tooltipWidth}px`;
                tooltip.transition();
                tooltip
                    .style('opacity', 1)
                    .html(
                        `<p class="tooltip-diff-text">La temperatura ${maxmins} en ${city} se registro en ${d.yearprimera} y fue de ${d.primero}ºC<p/>`
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
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('cy', (d) => scales.count.y(d.primero))
            .attr('cx', (d) => scales.count.x(d.dia))
            .attr('r', 6);

        layerDos
            .merge(newLayerDos)
            .on('mouseover', (d) => {
                const positionX = scales.count.x(d.dia);
                const postionWidthTooltip = positionX + 270;
                const tooltipWidth = 210;
                const positionleft = `${d3.event.pageX}px`;
                const positionright = `${d3.event.pageX - tooltipWidth}px`;
                tooltip.transition();
                tooltip
                    .style('opacity', 1)
                    .html(
                        `<p class="tooltip-diff-text">La segunda temperatura ${maxmins} en ${city} se registro en ${d.yearsegundo} y fue de ${d.segundo}ºC<p/>`
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
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('cy', (d) => scales.count.y(d.segundo))
            .attr('cx', (d) => scales.count.x(d.dia))
            .attr('r', (d) => {
                if (d.diff === 0) {
                    return 0;
                }
                return 6;
            });

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };
    const updateMes = () => {
        const mes = selectMonth.property('value');
        const city = selectCity
            .property('value')
            .replace(/ /g, '_')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        d3.csv(
            `csv/${maxmins}/dos-records/${city}-dos-records.csv`,
            (error, dataz) => {
                dataz = dataz.filter((d) => String(d.mes).match(mes));

                dataz.forEach((d) => {
                    d.fecha = +d.fecha;
                    d.primero = +d.primero;
                    d.segundo = +d.segundo;
                    d.diff = d.primero - d.segundo;
                    d.dia = +d.dia;
                });

                if (tempThis === 'max') {
                    const countX = d3
                        .scaleTime()
                        .domain([
                            d3.min(dataz, (d) => d.dia),
                            d3.max(dataz, (d) => d.dia)
                        ]);

                    const countY = d3
                        .scaleLinear()
                        .domain([
                            d3.min(dataz, (d) => d.segundo - 1),
                            d3.max(dataz, (d) => d.primero + 1)
                        ]);
                    scales.count = { x: countX, y: countY };
                } else {
                    const countX = d3
                        .scaleTime()
                        .domain([
                            d3.min(dataz, (d) => d.dia),
                            d3.max(dataz, (d) => d.dia)
                        ]);

                    const countY = d3
                        .scaleLinear()
                        .domain([
                            d3.min(dataz, (d) => d.primero - 1),
                            d3.max(dataz, (d) => d.segundo + 1)
                        ]);
                    scales.count = { x: countX, y: countY };
                }

                updateChart(dataz);
            }
        );
    };

    const menuMes = () => {
        d3.csv('csv/mes.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                const datos = data;

                const nest = d3
                    .nest()
                    .key((d) => d.Mes)
                    .entries(datos);

                selectMonth
                    .selectAll('option')
                    .data(nest)
                    .enter()
                    .append('option')
                    .attr('value', (d) => d.key)
                    .attr('number', (d, i) => i + 1)
                    .text((d) => d.key);

                selectMonth.on('change', () => {
                    updateMes();
                });
            }
        });
    };

    const menuCities = () => {
        d3.csv('csv/stations.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                const datos = data;

                const nest = d3
                    .nest()
                    .key((d) => d.Name)
                    .entries(datos);

                selectCity
                    .selectAll('option')
                    .data(nest)
                    .enter()
                    .append('option')
                    .attr('value', (d) => d.key)
                    .text((d) => d.key);

                selectCity.on('change', () => {
                    updateMes();
                });
            }
        });
    };

    // LOAD THE DATA
    const loadData = () => {
        const mes = 'Enero';
        d3.csv(
            `csv/${maxmins}/dos-records/Albacete-dos-records.csv`,
            (error, data) => {
                if (error) {
                    console.log(error);
                } else {
                    dataz = data.filter((d) => String(d.mes).match(mes));
                    dataz.forEach((d) => {
                        d.fecha = +d.fecha;
                        d.primero = +d.primero;
                        d.segundo = +d.segundo;
                        d.diff = d.primero - d.segundo;
                        d.dia = +d.dia;
                    });
                    setupElements();
                    setupScales();
                    updateChart(dataz);
                    menuMes();
                    menuCities();
                }
            }
        );
    };

    window.addEventListener('resize', resize);

    loadData();
}

/*const heatWave = () => {
    const selectCity = d3.select('#select-heat-wave');

    const updateMes = () => {
        const city = selectCity
            .property('value')
            .replace(/ /g, '_')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        loadData(city);
    };

    const menuCities = () => {
        d3.csv('csv/stations.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                const datos = data;

                const nest = d3
                    .nest()
                    .key((d) => d.Name)
                    .entries(datos);

                selectCity
                    .selectAll('option')
                    .data(nest)
                    .enter()
                    .append('option')
                    .attr('value', (d) => d.key)
                    .text((d) => d.key);

                selectCity.on('change', () => {
                    updateMes();
                });
            }
        });
    };

    menuCities();

    // LOAD THE DATA
    const loadData = (mes) => {
        d3.csv(`csv/max/julio/${mes}-julio.csv`, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                const container = d3.select('.forno-container');

                container
                    .selectAll('.forno-element')
                    .remove()
                    .exit()
                    .data(data)
                    .enter()
                    .append('section')
                    .attr('class', 'forno-element')
                    .html(
                        (d) => `
                              <span class="forno-day forno-text">${d.fecha}</span>
                              <span class="forno-year forno-text">${d.yearprimera}</span>
                            <span class="forno-record forno-text">${d.primero}ºC</span>`
                    );
            }
        });
    };

    const selected = 'Albacete';

    loadData(selected);
};*/

/*const average = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 40 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.line-average');
    const svg = chart.select('svg');
    const scales = {};
    const temp = 'ºC';
    let dataz;

    const setupScales = () => {
        const countX = d3
            .scaleTime()
            .domain([
                d3.min(dataz, (d) => d.fecha),
                d3.max(dataz, (d) => d.fecha),
            ]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.mediaXX - 4),
                d3.max(dataz, (d) => d.mediaXX + 4),
            ]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.line-average-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'line-average-container-dos');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([16, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(d3.format('d'))
            .ticks(33);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + temp)
            .ticks(10)
            .tickSizeInner(-width);

        g.select('.axis-y').call(axisY);

        g.append('text')
            .attr('class', 'legend-aragon')
            .attr('y', '1%')
            .attr('x', '3%')
            .text('Promedio de temperatura media entre 1980-2009');

        g.append('rect')
            .attr('class', 'legend-line')
            .attr('y', '0')
            .attr('x', '1%')
            .attr('height', '3px')
            .attr('width', '16px');
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.line-average-container');

        g.attr('transform', translate);

        const line = d3
            .line()
            .x((d) => scales.count.x(d.fecha))
            .y((d) => scales.count.y(d.mediaXX))
            .curve(d3.curveStep);

        updateScales(width, height);

        const container = chart.select('.line-average-container-dos');

        const layer = container.selectAll('.line').data([dataz]);

        const layer2 = container.selectAll('.bar-vertical').data(dataz);

        const newLayer2 = layer2
            .enter()
            .append('rect')
            .attr('id', (d, i) => 'rect' + i)
            .attr('class', (d) => {
                if (d.diff < 0) {
                    return 'up';
                } else {
                    return 'down';
                }
            });

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'line')
            .attr('stroke-width', '1.5');

        layer2
            .merge(newLayer2)
            .attr('width', width / dataz.length - 4)
            .attr('x', (d) => scales.count.x(d.fecha) - 14)
            .attr('y', (d) => {
                if (d.diff > 0) {
                    return scales.count.y(d.mediaXX);
                } else {
                    return (
                        scales.count.y(d.mediaXX) -
                        Math.abs(scales.count.y(d.diff) - scales.count.y(0))
                    );
                }
            })
            .attr('height', (d) =>
                Math.abs(scales.count.y(d.diff) - scales.count.y(0))
            );

        layer.merge(newLayer).attr('d', line);

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/junio-1980-2019.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.mediaXX = +d.mediaXX;
                    d.mediaXXI = +d.mediaXXI;
                    d.diff = +d.diff;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};*/

tropicalCities();
scatterInput();
vulturno();
directionalDot(maxmin[0]);
directionalDot(maxmin[1]);

maxvul();
tropicalTotal();
frostyTotal();
minvul();
tempExt();
/*average();*/
/*heatWave();*/

new SlimSelect({
    select: '#select-city',
    searchPlaceholder: 'Busca tu ciudad'
});

new SlimSelect({
    select: '#select-scatter-city',
    searchPlaceholder: 'Busca tu ciudad'
});

new SlimSelect({
    select: '#select-city-tropical',
    searchPlaceholder: 'Busca tu ciudad'
});

new SlimSelect({
    select: '#select-ext',
    searchPlaceholder: 'Selecciona temperatura'
});

new SlimSelect({
    select: '#select-month-max',
    searchPlaceholder: 'Selecciona un mes'
});

new SlimSelect({
    select: '#select-month-min',
    searchPlaceholder: 'Selecciona un mes'
});

new SlimSelect({
    select: '#select-cities-records-max',
    searchPlaceholder: 'Selecciona una ciudad'
});

new SlimSelect({
    select: '#select-cities-records-min',
    searchPlaceholder: 'Selecciona una ciudad'
});

/*new SlimSelect({
    select: '#select-heat-wave',
    searchPlaceholder: 'Selecciona una ciudad'
});
*/
