function forceLayout() {

    const chart = d3.select('.chart-force');
    const svg = chart.select('svg');
    const nodePadding = 1.5;
    const color = d3.scaleOrdinal(["#f6d2d5", "#f0b7bc", "#ea969d", "#e16973", "#cc0011", "#a2000d", "#b8000f"]);

    const tooltip = chart.append("div")
        .attr("class", "tooltip tooltip-record")
        .style("opacity", 0);

    const tooltipDecade = chart.append("div")
        .attr("class", "tooltip tooltip-decade")
        .style("opacity", 0);

    function updateChart(dataz) {
        const w = chart.node().offsetWidth;
        const h = 608;

        svg
            .attr('width', w)
            .attr('height', h);

        const simulation = d3.forceSimulation()
            .force("forceX", d3.forceX().x(w * .5))
            .force("forceY", d3.forceY().y(h * .5))
            .force("center", d3.forceCenter().x(w * .5).y(h * .5))
            .force("charge", d3.forceManyBody().strength(5))
            .force('collision', d3.forceCollide().radius(d => d.radius + 1));

        simulation
            .nodes(dataz)
            .force("collide", d3.forceCollide().strength(.5).radius(function(d) { return d.radius + nodePadding; }).iterations(1))
            .on("tick", d => {
                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            });


        const node = svg
            .selectAll(".circles").remove().exit()
            .data(dataz)
            .enter().append("circle")
            .attr("class", 'circles')
            .attr("r", d => d.radius)
            .attr("fill", d => color(d.decade))
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .on("mouseover", function(d) {
                var circleUnderMouse = this;
                d3.selectAll('.circles').filter(function(d, i) {
                    return (this !== circleUnderMouse);
                }).transition().duration(300).ease(d3.easeLinear).style('opacity', 0.2)

                tooltip.transition()
                tooltip.style("opacity", 1)
                    .html(`<p class="tooltip-record-max">En <span class="number">${d.year}</span> se establecieron <span class="number">${d.total}</span> récords.<p/>
                        `)
                    .style("left", 50 + "px")
                    .style("top", 16 + "px");
            })
            .on("mouseout", function(d) {
                d3.selectAll('.circles').transition().duration(800).ease(d3.easeLinear).style('opacity', 1)
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            })

        const legendData = d3.group(dataz.map(d => d.decade))
        let unique = legendData.filter(function(elem, pos) {
            return legendData.indexOf(elem) == pos;
        })

        unique = unique.reverse((d) => d.decade);

        const titleLegend = svg.append('text')
            .attr("class", "legend-title")
            .attr("transform", "translate(50,110)")
            .text("Décadas")

        const legend = svg.selectAll(".legend")
            .data(unique, d => d)
            .enter()
            .append("g")
            .attr("class", 'legend')
            .attr("year", d => d)
            .attr("transform", (d, i) => `translate(${50},${(i + 5) * 25})`);

        legend.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", d => color(d));

        legend.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text(d => d)

        legend.on("mouseover", function(tipo) {
                const legendThis = d3.select(this);
                d3.selectAll(".legend")
                    .transition().duration(300).ease(d3.easeLinear).style('opacity', 0.1)
                legendThis
                    .transition().duration(300).ease(d3.easeLinear).style('opacity', 1)
                d3.selectAll(".circles")
                    .transition().duration(200).ease(d3.easeLinear).style('opacity', 0.1)
                    .filter(d => d.decade == tipo)
                    .transition().duration(300).ease(d3.easeLinear).style('opacity', 1)
                d3.select(this).call(tooltipLast)

            })
            .on("mouseout", function(tipo) {
                d3.selectAll(".legend")
                    .transition().duration(300).ease(d3.easeLinear).style('opacity', 1)
                d3.selectAll(".circles")
                    .transition().duration(300).ease(d3.easeLinear).style('opacity', 1)
                tooltipDecade
                    .style("opacity", 0);
            })

        function tooltipLast(legend) {

            const valueYear = legend.attr("year")

            d3.csv("csv/total-records-max.csv", (error, data) => {

                dataz = data
                dataz = dataz.filter(d => String(d.decade).match(valueYear));

                tooltipDecade
                    .data(dataz)
                    .style("opacity", 1)
                    .html(d => `<p class="tooltip-record-max">Entre <span class="number">${d.decade}</span> y <span class="number">${parseInt(d.decade) + 9}</span> se establecieron <span class="number">${d.totaldecade}</span> récords de temperatura máxima.<p/>
                            `)
                    .style("left", 50 + "px")
                    .style("top", 16 + "px");
            });
        }

    }

    function loadData() {

        d3.csv("csv/total-records-max.csv", (error, data) => {
            if (error) {
                console.log(error);
            } else {

                dataz = data
                dataz.forEach(d => {
                    d.size = +d.total / 10;
                    d.radius = +d.size;
                    d.year = d.year;
                });


                updateChart(dataz)

            }

        });

    }

    const resize = () => {
        updateChart(dataz)
    }

    window.addEventListener('resize', resize)

    loadData()
}

forceLayout()

const vulturno = () => {

    const widthMobile = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    if (widthMobile > 544) {
        margin = { top: 8, right: 16, bottom: 24, left: 48 };
    } else {
        margin = { top: 8, right: 16, bottom: 24, left: 32 };
    }

    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-vulturno');
    const svg = chart.select('svg');
    let scales = {};
    const temp = "ºC";
    let datos;
    let tooltipMax;
    let tooltipMin;
    const tooltipTemp = chart.append("div")
        .attr("class", "tooltip tooltip-temp")
        .style("opacity", 0);
    const bisectDate = d3.bisector(d => d.year).left;


    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain([d3.min(datos, d => d.year), d3.max(datos, d => d.year)]);

        const countY = d3.scaleLinear()
            .domain([d3.min(datos, d => d.temp - 1), d3.max(datos, d => d.temp + 1)]);

        scales.count = { x: countX, y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.chart-vulturno-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-vulturno-container-bis');

        g.append('rect')
            .attr('class', 'overlay');

        g.append('g')
            .attr('class', 'focus')
            .style("display", "none")
            .append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0);

        g.select('.focus').append("text")
            .attr("class", "text-focus");

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .tickPadding(5)
            .tickFormat(d3.format("d"))
            .ticks(13)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3.axisLeft(scales.count.y)
            .tickPadding(5)
            .tickFormat(d => d + temp)
            .tickSize(-width)
            .ticks(6);

        g.select(".axis-y")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisY)

        const focus = g.select('.focus');

        const overlay = g.select('.overlay');

        focus.select(".x-hover-line").attr("y2", height);

        overlay.attr("width", width + margin.left + margin.right)
            .attr("height", height)
            .on("mouseover", function() {
                focus.style("display", null);
            })
            .on("mouseout", function() {
                focus.style("display", "none")
                tooltipTemp.style("opacity", 0)
            })
            .on("mousemove", mousemove);

        function mousemove() {
            const w = chart.node().offsetWidth;
            const positionTooltip = w / 2 - (352 / 2);
            const x0 = scales.count.x.invert(d3.mouse(this)[0]);
            const i = bisectDate(datos, x0, 1);
            const d0 = datos[i - 1];
            const d1 = datos[i];
            const d = x0 - d0.fecha > d1.fecha - x0 ? d1 : d0;
            tooltipTemp.style("opacity", 1)
                .html(`<p class="tooltip-media-texto">En <strong>${d.year}</strong> la temperatura media fue de <strong>${d.temp} ºC</strong>.<p/>`)
                .style('left', positionTooltip + 'px')

            focus.select(".x-hover-line")
                .attr("transform",
                    `translate(${scales.count.x(d.fecha)},${0})`);

        }

    }

    function updateChart(data) {
        const w = chart.node().offsetWidth;
        const h = 608;


        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.chart-vulturno-container')

        g.attr("transform", translate)

        const line = d3.line()
            .x(d => scales.count.x(d.year))
            .y(d => scales.count.y(d.temp))

        updateScales(width, height)

        const container = chart.select('.chart-vulturno-container-bis')

        const lines = container.selectAll('.lines')
            .data([datos])

        const newLines = lines.enter()
            .append('path')
            .attr('class', 'lines')

        const dots = container.selectAll('.circles').remove().exit()
            .data(datos)

        const dotsLayer = dots.enter()
            .append("circle")
            .attr("class", "circles");


        lines.merge(newLines)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .attr('d', line);


        dots.merge(dotsLayer)
            .attr("cx", d => scales.count.x(d.year))
            .attr("cy", 0)
            .transition()
            .delay(function(d, i) {
                return i * 10
            })
            .duration(500)
            .ease(d3.easeLinear)
            .attr("cx", d => scales.count.x(d.year))
            .attr("cy", d => scales.count.y(d.temp));

        drawAxes(g)

    }

    function update(mes) {

        d3.csv("csv/" + mes + ".csv", (error, data) => {

            datos = data;

            datos.forEach(d => {
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

            const countX = d3.scaleTime()
                .domain([d3.min(datos, d => d.year), d3.max(datos, d => d.year)]);

            const countY = d3.scaleLinear()
                .domain([d3.min(datos, d => d.temp - 1), d3.max(datos, d => d.temp + 1)]);

            scales.count = { x: countX, y: countY };
            updateChart(datos)

        });


    }

    const resize = () => {

        const stationResize = d3.select("#select-city")
            .property("value")
            .replace(/[\u00f1-\u036f]/g, "")
            .replace(/ /g, "_")
            .replace(/á/g, "a")
            .replace(/Á/g, "A")
            .replace(/é/g, "e")
            .replace(/è/g, "e")
            .replace(/í/g, "i")
            .replace(/ó/g, "o")
            .replace(/ú/g, "u")
            .replace(/ñ/g, "n");

        d3.csv("csv/" + stationResize + ".csv", (error, data) => {

            datos = data;
            updateChart(datos)

        });

    }

    const menuMes = () => {
        d3.csv('csv/stations.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                datos = data;

                const nest = d3.nest()
                    .key(d => d.Name)
                    .entries(datos);

                const selectCity = d3.select("#select-city");

                selectCity
                    .selectAll("option")
                    .data(nest)
                    .enter()
                    .append("option")
                    .attr("value", d => d.key)
                    .text(d => d.key)

                selectCity.on('change', function() {

                    let mes = d3.select(this)
                        .property("value")
                        .replace(/ /g, "_")
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                    console.log(mes)

                    update(mes)

                });


            }

        });

    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/Albacete.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                datos = data;
                datos.forEach(d => {
                    d.year = d.year;
                    d.temp = d.temp;
                    d.fecha = +d.year;
                });
                setupElements()
                setupScales()
                updateChart(datos)
                mes = 'Albacete';
                update(mes)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()
    menuMes()

}

const maxvul = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 0, right: 48, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.chart-temperature-max');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleLinear()
            .domain(
                [d3.min(dataz, function(d) {
                        return d.fecha;
                    }),
                    d3.max(dataz, function(d) {
                        return d.fecha;
                    })
                ]
            );


        const countY = d3.scaleLinear()
            .domain([d3.min(dataz, d => d.total), d3.max(dataz, d => d.total)]);

        scales.count = { x: countX, y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.chart-temperature-max-container');

        g.append('g').attr('class', 'axis axis-x');


        g.append('g').attr('class', 'chart-temperature-max-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width) => {
        scales.count.x.range([0, width]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .tickFormat(d3.format("d"))
            .ticks(6)
            .tickPadding(30);

        g.select(".axis-x")
            .attr("transform", "translate(0," + (height / 2) + ")")
            .call(axisX);

    }

    const danotations = () => {

        d3.csv('csv/max-record.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data
                dataz.forEach(d => {
                    d.fecha = d.yearmax;
                    d.total = d.totalmax;
                });
                //Add annotations
                const labels = [{
                    data: { year: 2012 },
                    y: 100,
                    dy: -50,
                    dx: -52,
                    note: {
                        title: "Entre 2009 y 2018 se establecen el 78% de los récords de máximas",
                        wrap: 230,
                        align: "middle"
                    }
                }].map(l => {
                    l.subject = { radius: 4 }
                    return l
                })

                window.makeAnnotations = d3.annotation()
                    .annotations(labels)
                    .type(d3.annotationCalloutCircle)
                    .accessors({
                        x: d => scales.count.x(d.year),
                        y: d => scales.count.y(d.total)
                    })
                    .accessorsInverse({
                        year: d => scales.count.x.invert(d.x),
                        total: d => scales.count.y.invert(d.y)
                    })
                    .on('subjectover', function(annotation) {
                        annotation.type.a.selectAll("g.annotation-connector, g.annotation-note")
                            .classed("hidden", false)
                    })
                    .on('subjectout', function(annotation) {
                        annotation.type.a.selectAll("g.annotation-connector, g.annotation-note")
                            .classed("hidden", true)
                    })

                svg.append("g")
                    .attr("class", "annotation-test")
                    .call(makeAnnotations)

                svg.selectAll("g.annotation-connector, g.annotation-note")
            }

        })

    }

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 208;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.chart-temperature-max-container')

        g.attr("transform", translate)

        updateScales(width, height)

        const container = chart.select('.chart-temperature-max-container-bis')

        const layer = container.selectAll('.circles-max')
            .data(dataz)

        const newLayer = layer.enter()
            .append('circle')
            .attr('class', 'circles-max')


        layer.merge(newLayer)
            .attr("cx", d => scales.count.x(d.fecha))
            .attr("cy", (height / 2))
            .attr("r", 0)
            .transition()
            .delay(function(d, i) {
                return i * 10
            })
            .duration(500)
            .attr("r", d => 3 * d.total)
            .attr('fill-opacity', 0.6);

        drawAxes(g)


    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/max-record.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data
                dataz.forEach(d => {
                    d.fecha = d.yearmax;
                    d.total = d.totalmax;
                });
                setupElements()
                setupScales()
                danotations()
                updateChart(dataz)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

const minvul = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 0, right: 48, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.chart-temperature-min');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleLinear()
            .domain(
                [d3.min(dataz, function(d) {
                        return d.fecha;
                    }),
                    d3.max(dataz, function(d) {
                        return d.fecha;
                    })
                ]
            );

        scales.count = { x: countX };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.chart-temperature-min-container');

        g.append('g').attr('class', 'axis axis-x');


        g.append('g').attr('class', 'chart-temperature-min-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width) => {
        scales.count.x.range([0, width]);
    }

    const danotations = () => {

        d3.csv('csv/min-record.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data
                dataz.forEach(d => {
                    d.fecha = d.yearmin;
                    d.total = d.totalmin;
                });

                //Add annotations
                const labels = [{
                    data: { year: 1988 },
                    y: 100,
                    dy: -50,
                    note: {
                        title: "Desde 1986 no se ha batido ni un solo récord de temperatura mínima",
                        wrap: 230,
                        align: "middle"
                    }
                }].map(l => {
                    l.subject = { radius: 4 }
                    return l
                })

                window.makeAnnotations = d3.annotation()
                    .annotations(labels)
                    .type(d3.annotationCalloutCircle)
                    .accessors({
                        x: d => scales.count.x(d.year),
                        y: d => scales.count.y(d.total)
                    })
                    .accessorsInverse({
                        year: d => scales.count.x.invert(d.x),
                        total: d => scales.count.y.invert(d.y)
                    })
                    .on('subjectover', function(annotation) {
                        annotation.type.a.selectAll("g.annotation-connector, g.annotation-note")
                            .classed("hidden", false)
                    })
                    .on('subjectout', function(annotation) {
                        annotation.type.a.selectAll("g.annotation-connector, g.annotation-note")
                            .classed("hidden", true)
                    })

                svg.append("g")
                    .attr("class", "annotation-test")
                    .call(makeAnnotations)

                svg.selectAll("g.annotation-connector, g.annotation-note")

            }

        });

    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .tickFormat(d3.format("d"))
            .ticks(6)
            .tickPadding(30);

        g.select(".axis-x")
            .attr("transform", "translate(0," + (height / 2) + ")")
            .call(axisX);

    }

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 208;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.chart-temperature-min-container')

        g.attr("transform", translate)

        updateScales(width, height)

        drawAxes(g)

        const container = chart.select('.chart-temperature-min-container-bis')

        const layer = container.selectAll('.circles-min')
            .data(dataz)

        const newLayer = layer.enter()
            .append('circle')
            .attr('class', 'circles-min')


        layer.merge(newLayer)
            .attr("cx", d => scales.count.x(d.fecha))
            .attr("cy", (height / 2))
            .attr("r", 0)
            .transition()
            .delay(function(d, i) {
                return i * 10
            })
            .duration(500)
            .attr("r", d => 3 * d.total)
            .attr('fill-opacity', 0.6);

    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/min-record.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data
                dataz.forEach(d => {
                    d.fecha = d.yearmin;
                    d.total = d.totalmin;
                });
                setupElements()
                setupScales()
                danotations()
                updateChart(dataz)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

const tropicalTotal = () => { //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 0, right: 24, bottom: 24, left: 32 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-tropical');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain([d3.min(dataz, d => d.year), d3.max(dataz, d => d.year)]);

        const countY = d3.scaleLinear()
            .domain([0, d3.max(dataz, d => d.total * 1.25)]);

        scales.count = { x: countX, y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.chart-tropical-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-tropical-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .tickFormat(d3.format("d"))
            .ticks(13)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .ticks(5)
            .tickSizeInner(-width)

        g.select(".axis-y")
            .call(axisY)
    }

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 608;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.chart-tropical-container')

        g.attr("transform", translate)

        const area = d3.area()
            .x(d => scales.count.x(d.year))
            .y0(height)
            .y1(d => scales.count.y(d.total))

        const line = d3.line()
            .x(d => scales.count.x(d.year))
            .y(d => scales.count.y(d.total))

        updateScales(width, height)

        const container = chart.select('.chart-tropical-container-bis')

        const layer = container.selectAll('.area-tropical')
            .data([dataz])

        const layerLine = container.selectAll('.line-tropical')
            .data([dataz])

        const newLayer = layer.enter()
            .append('path')
            .attr('class', 'area-tropical')

        const newlayerLine = layerLine.enter()
            .append('path')
            .attr('class', 'line-tropical')

        layer.merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .attr('d', area)

        layerLine.merge(newlayerLine)
            .transition(600)
            .ease(d3.easeLinear)
            .attr('d', line)

        drawAxes(g)

    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/total-tropicales.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data
                dataz.forEach(d => {
                    d.year = d.year;
                    d.total = +d.total;
                });
                setupElements()
                setupScales()
                updateChart(dataz)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

const frostyTotal = () => { //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 0, right: 24, bottom: 24, left: 32 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-frosty');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain([d3.min(dataz, d => d.year), d3.max(dataz, d => d.year)]);

        const countY = d3.scaleLinear()
            .domain([0, d3.max(dataz, d => d.total * 1.25)]);

        scales.count = { x: countX, y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.chart-frosty-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-frosty-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .tickFormat(d3.format("d"))
            .ticks(13)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .ticks(5)
            .tickSizeInner(-width)

        g.select(".axis-y")
            .call(axisY)
    }

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 608;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.chart-frosty-container')

        g.attr("transform", translate)

        const area = d3.area()
            .x(d => scales.count.x(d.year))
            .y0(height)
            .y1(d => scales.count.y(d.total))

        const line = d3.line()
            .x(d => scales.count.x(d.year))
            .y(d => scales.count.y(d.total))


        updateScales(width, height)

        const container = chart.select('.chart-frosty-container-bis')

        const layer = container.selectAll('.area-frosty')
            .data([dataz])

        const layerLine = container.selectAll('.line-frosty')
            .data([dataz])

        const newlayerLine = layerLine.enter()
            .append('path')
            .attr('class', 'line-frosty')

        const newLayer = layer.enter()
            .append('path')
            .attr('class', 'area-frosty')

        layer.merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .attr('d', area)

        layerLine.merge(newlayerLine)
            .transition(600)
            .ease(d3.easeLinear)
            .attr('d', line)

        drawAxes(g)

    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/total-heladas.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data
                dataz.forEach(d => {
                    d.year = d.year;
                    d.total = +d.total;
                });
                setupElements()
                setupScales()
                updateChart(dataz)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

const scatterInput = () => {

    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 48, right: 16, bottom: 24, left: 32 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.scatter-inputs');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    let parseDate = d3.timeFormat('%m-%d-%Y');
    const temp = "ºC";
    const selectCity = d3.select("#select-scatter-city");
    const tooltip = d3.select(".scatter-inputs")
        .append("div")
        .attr("class", "tooltip tooltip-scatter")
        .style("opacity", 0);

    //Eliminando el año para quedarnos solamente con el día y la fecha en formato: DD-MM
    const getYear = (stringDate) => stringDate.split('-')[0];


    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleLinear()
            .domain(
                [d3.min(dataz, d => d.year),
                    d3.max(dataz, d => d.year)
                ]
            );

        const countY = d3.scaleLinear()
            .domain([d3.min(dataz, d => d.minima),
                d3.max(dataz, d => d.minima)
            ])


        scales.count = { x: countX, y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.scatter-inputs-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'scatter-inputs-container-dos');

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .tickPadding(10)
            .tickFormat(d3.format("d"))
            .tickSize(-height)
            .ticks(10)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d => d + temp)
            .tickSize(-width)
            .ticks(6);

        g.select(".axis-y")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisY)
    }

    const updateChart = (dataz) => {

        const w = chart.node().offsetWidth;
        const h = 608;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.scatter-inputs-container')

        g.attr("transform", translate)

        updateScales(width, height)

        const container = chart.select('.scatter-inputs-container-dos')

        const layer = container.selectAll('.scatter-inputs-circles').remove().exit()
            .data(dataz)

        const newLayer = layer.enter()
            .append('circle')
            .attr('class', 'scatter-inputs-circles')

        layer.merge(newLayer)
            .on("mouseover", function(d) {
                tooltip.transition()
                tooltip.attr('class', 'tooltip tooltip-scatter tooltip-min')
                tooltip.style("opacity", 1)
                    .html(`<p class="tooltip-scatter-text">La temperatura mínima en ${d.year} fue de ${d.minima}ºC<p/>`)
                    .style("left", `${d3.event.pageX}px`)
                    .style("top", `${d3.event.pageY - 28}px`);
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            })
            .attr('cx', w / 2)
            .attr('cy', h / 2)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("cx", d => scales.count.x(d.year))
            .attr("cy", d => scales.count.y(d.minima))
            .attr('r', 0)
            .transition()
            .duration(100)
            .ease(d3.easeLinear)
            .attr("r", 6)
            .style("fill", "#257d98")

        drawAxes(g)

    }

    function update(ciudad) {

        updateMax()

    }

    const menuCiudad = () => {
        d3.csv('csv/stations.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                datos = data;

                const nest = d3.nest()
                    .key(d => d.Name)
                    .entries(datos);

                selectCity
                    .selectAll("option")
                    .data(nest)
                    .enter()
                    .append("option")
                    .attr("value", d => d.key)
                    .text(d => d.key)

                selectCity.on('change', function() {

                    let ciudad = d3.select(this)
                        .property("value")
                        .replace(/ /g, "_")
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                    update(ciudad)

                });


            }

        });

    }

    d3.select("#update")
        .on("click", (dataz) => {
            updateMax()
        });

    d3.select("#updateMin")
        .on("click", (dataz) => {
            updateMin()
        });

    const updateMax = () => {

        let valueDateDay = d3.select("#updateButtonDay").property("value");
        let valueDateMonth = d3.select("#updateButtonMonth").property("value");
        if (valueDateDay < 10) valueDateDay = (`0${valueDateDay}`).slice(-2);
        if (valueDateMonth < 10) valueDateMonth = (`0${valueDateMonth}`).slice(-2);
        let valueDate = `${valueDateMonth}-${valueDateDay}`;
        let reValueDate = new RegExp(`^.*${valueDate}$`, "gi");

        errorDate();

        const ciudad = selectCity.property("value")
            .replace(/ /g, "_")
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        d3.csv(`csv/day-by-day/${ciudad}-diarias.csv`, (error, dataz) => {

            dataz = dataz.filter(d => String(d.fecha).match(reValueDate));

            dataz.forEach(d => {
                d.fecha = d.fecha;
                d.maxima = +d.maxima;
                d.minima = +d.minima;
                d.year = getYear(d.fecha);
            });

            scales.count.x.range([0, width]);
            scales.count.y.range([height, 0]);

            const countX = d3.scaleTime()
                .domain(
                    [d3.min(dataz, d => d.year),
                        d3.max(dataz, d => d.year)
                    ]
                );

            const countY = d3.scaleLinear()
                .domain(
                    [d3.min(dataz, d => d.maxima),
                        d3.max(dataz, d => d.maxima)
                    ]
                );

            scales.count = { x: countX, y: countY };

            const translate = "translate(" + margin.left + "," + margin.top + ")";

            const g = svg.select('.scatter-inputs-container')

            g.attr("transform", translate)

            updateScales(width, height)

            const container = chart.select('.scatter-inputs-container-dos')

            const layer = container.selectAll('.scatter-inputs-circles').remove().exit()
                .data(dataz)

            const newLayer = layer.enter()
                .append('circle')
                .attr('class', 'scatter-inputs-circles')

            layer.merge(newLayer)
                .on("mouseover", function(d) {
                    tooltip.transition()
                    tooltip.attr('class', 'tooltip tooltip-scatter tooltip-max')
                    tooltip.style("opacity", 1)
                        .html(`<p class="tooltip-scatter-text">La temperatura máxima en ${d.year} fue de ${d.maxima}ºC<p/>`)
                        .style("left", `${d3.event.pageX}px`)
                        .style("top", `${d3.event.pageY - 28}px`);
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0);
                })
                .attr('cx', width / 2)
                .attr('cy', height / 2)
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("cx", d => scales.count.x(d.year))
                .attr("cy", d => scales.count.y(d.maxima))
                .attr('r', 0)
                .transition()
                .duration(100)
                .ease(d3.easeLinear)
                .attr("r", 6)
                .style("fill", "#dc7176")

            drawAxes(g)

        });


    }

    const errorDate = () => {
        const monthFail = document.getElementById('fail-month');
        const dayFail = document.getElementById('fail-day');
        const valueDateDay = d3.select("#updateButtonDay").property("value");
        const valueDateMonth = d3.select("#updateButtonMonth").property("value");
        const year = "2020"; // Hardcodeamos el año a 2020 por ser bisiesto y permitir 29 febrero
        if (!isValidDate(valueDateDay, valueDateMonth, year)) {
            monthFail.classList.add('fail-active');
        } else {
            monthFail.classList.remove('fail-active');

        }
    }

    const isValidDate = (day, month, year) => {
        const date = new Date();
        date.setFullYear(year, month - 1, day); // month - 1 porque empiezan en 0 (enero = 0)
        return (date.getFullYear() == year) && (date.getMonth() == month - 1) && (date.getDate() == day);
    }

    const updateMin = () => {

        let valueDateDay = d3.select("#updateButtonDay").property("value");
        let valueDateMonth = d3.select("#updateButtonMonth").property("value");
        if (valueDateDay < 10) valueDateDay = (`0${valueDateDay}`).slice(-2);
        if (valueDateMonth < 10) valueDateMonth = (`0${valueDateMonth}`).slice(-2);
        let valueDate = `${valueDateMonth}-${valueDateDay}`;
        let reValueDate = new RegExp(`^.*${valueDate}$`, "gi");

        errorDate();


        const ciudad = selectCity.property("value")
            .replace(/ /g, "_")
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        d3.csv(`csv/day-by-day/${ciudad}-diarias.csv`, (error, dataz) => {

            dataz = dataz.filter(d => String(d.fecha).match(reValueDate));

            dataz.forEach(d => {
                d.fecha = d.fecha;
                d.maxima = +d.maxima;
                d.minima = +d.minima;
                d.year = getYear(d.fecha);
            });

            scales.count.x.range([0, width]);
            scales.count.y.range([height, 0]);

            const countX = d3.scaleTime()
                .domain(
                    [d3.min(dataz, d => d.year),
                        d3.max(dataz, d => d.year)
                    ]
                );

            const countY = d3.scaleLinear()
                .domain(
                    [d3.min(dataz, d => d.minima),
                        d3.max(dataz, d => d.minima)
                    ]
                );


            scales.count = { x: countX, y: countY };

            updateChart(dataz)

        });


    }

    const resize = () => {

        updateMax()

    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/day-by-day/Albacete-diarias.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                dataz = data

                dataz = data.filter(d => String(d.fecha).match(/08-01$/));

                dataz.forEach(d => {
                    d.fecha = d.fecha;
                    d.maxima = +d.maxima;
                    d.minima = +d.minima;
                    d.year = getYear(d.fecha);

                });

                setupElements()
                setupScales()
                updateChart(dataz)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()
    menuCiudad()

}

const tropicalCities = () => {

    const widthMobile = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    if (widthMobile > 544) {
        margin = { top: 8, right: 16, bottom: 24, left: 48 };
    } else {
        margin = { top: 8, right: 16, bottom: 24, left: 32 };
    }

    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-cities-tropical');
    const svg = chart.select('svg');
    let scales = {};
    let datos;

    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain([d3.min(datos, d => d.fecha), d3.max(datos, d => d.fecha)]);

        const countY = d3.scaleLinear()
            .domain([0, d3.max(datos, d => d.tropical * 1.25)]);

        scales.count = { x: countX, y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.chart-cities-tropical-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-cities-tropical-container-bis');


    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .tickPadding(5)
            .tickFormat(d3.format("d"))
            .ticks(13)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3.axisLeft(scales.count.y)
            .tickPadding(5)
            .tickFormat(d => d)
            .tickSize(-width)
            .ticks(6);

        g.select(".axis-y")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisY)

    }

    function updateChart(data) {

        const w = chart.node().offsetWidth;
        const h = 608;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.chart-cities-tropical-container')

        g.attr("transform", translate)

        const area = d3.area()
            .x(d => scales.count.x(d.year))
            .y0(height)
            .y1(d => scales.count.y(d.total))

        const line = d3.line()
            .x(d => scales.count.x(d.year))
            .y(d => scales.count.y(d.total))

        updateScales(width, height)

        const container = chart.select('.chart-cities-tropical-container-bis')

        const layer = container.selectAll('.area-cities-tropical')
            .data([datos])

        const layerLine = container.selectAll('.line-cities-tropical')
            .data([datos])

        const newLayer = layer.enter()
            .append('path')
            .attr('class', 'area-cities-tropical')

        const newlayerLine = layerLine.enter()
            .append('path')
            .attr('class', 'line-cities-tropical')

        layer.merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .attr('d', area)

        layerLine.merge(newlayerLine)
            .transition(600)
            .ease(d3.easeLinear)
            .attr('d', line)


        drawAxes(g)

    }

    function update(mes) {

        d3.csv(`csv/tropicales/${mes}-total-tropicales.csv`, (error, data) => {

            datos = data;

            datos.forEach(d => {
                d.fecha = +d.year;
                d.tropical = +d.total;
            });

            console.log(datos)

            scales.count.x.range([0, width]);
            scales.count.y.range([height, 0]);

            const countX = d3.scaleTime()
                .domain([d3.min(datos, d => d.fecha), d3.max(datos, d => d.fecha)]);

            const countY = d3.scaleLinear()
                .domain([0, d3.max(datos, d => d.tropical * 1.25)]);

            scales.count = { x: countX, y: countY };
            updateChart(datos)

        });


    }

    const resize = () => {

        const stationResize = d3.select("#select-city-tropical")
            .property("value")
            .replace(/[\u00f1-\u036f]/g, "")
            .replace(/ /g, "_")
            .replace(/á/g, "a")
            .replace(/Á/g, "A")
            .replace(/é/g, "e")
            .replace(/è/g, "e")
            .replace(/í/g, "i")
            .replace(/ó/g, "o")
            .replace(/ú/g, "u")
            .replace(/ñ/g, "n");

        d3.csv("csv/" + stationResize + ".csv", (error, data) => {

            datos = data;
            updateChart(datos)

        });

    }

    const menuMes = () => {
        d3.csv('csv/stations.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                datos = data;

                const nest = d3.nest()
                    .key(d => d.Name)
                    .entries(datos);

                const selectCity = d3.select("#select-city-tropical");

                selectCity
                    .selectAll("option")
                    .data(nest)
                    .enter()
                    .append("option")
                    .attr("value", d => d.key)
                    .text(d => d.key)

                selectCity.on('change', function() {

                    let mes = d3.select(this)
                        .property("value")
                        .replace(/ /g, "_")
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                    console.log(mes)

                    update(mes)

                });


            }

        });

    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/tropicales/Albacete-total-tropicales.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                datos = data;
                datos.forEach(d => {
                    d.fecha = +d.year;
                    d.tropical = +d.total;
                });
                setupElements()
                setupScales()
                updateChart(datos)
                mes = 'Albacete';
                update(mes)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()
    menuMes()

}

tropicalCities()

scatterInput()

vulturno()
new SlimSelect({
    select: '#select-city',
    searchPlaceholder: 'Busca tu ciudad'
})

new SlimSelect({
    select: '#select-scatter-city',
    searchPlaceholder: 'Busca tu ciudad'
})

new SlimSelect({
    select: '#select-city-tropical',
    searchPlaceholder: 'Busca tu ciudad'
})
maxvul()
tropicalTotal()
frostyTotal()
minvul()
