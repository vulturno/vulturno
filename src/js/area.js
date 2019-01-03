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

    for(i=0; i<elementBtn.length; i++){
        elementBtn[i].addEventListener("click", function(){
            removeClass();
            console.log('click')
        });
    }

    function removeClass() {
        overlay.classList.remove("show");
        navigation.classList.remove("show");
        burger.classList.remove("clicked");

    }
}

menu();

const vulturno = () => {

    const widthMobile = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    if (widthMobile > 544) {
        margin = { top: 16, right: 16, bottom: 24, left: 48 };
    } else {
        margin = { top: 16, right: 16, bottom: 24, left: 32 };
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
            .domain([d3.min(datos, d => d.year), d3.max(datos, d => d.year )]);

        const countY = d3.scaleLinear()
            .domain([d3.min(datos, d => d.temp - 1), 20]);

        scales.count = { x: countX, y: countY };

    }

    const tooltips = (data) => {

        tooltipMax = chart.append("div")
            .attr("class", "tooltip tooltip-media-anual-maxima")
            .attr("id", "tooltip-max");

        tooltipMin = chart.append("div")
            .attr("class", "tooltip tooltip-media-anual-minima");

        tooltipMax.data(datos)
            .html(function(d) { return "<p class='tooltip-media-texto'>La máxima fue de <strong>" + d3.max(datos, d => d.tempmax ) + "ºC</strong> en <strong>" + d.yearmax; + "</strong></p>" });

        tooltipMin.data(datos)
            .html(function(d) { return "<p class='tooltip-media-texto'>La mínima fue de <strong>" + d3.min(datos, d => d.tempmin ) + "ºC</strong> en <strong>" + d.yearmin; + "</strong></p>" });

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
            .duration(300)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3.axisLeft(scales.count.y)
            .tickPadding(5)
            .tickFormat(d => d + temp)
            .tickSize(-width)
            .ticks(6);

        g.select(".axis-y")
            .transition()
            .duration(300)
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
        const h = 500;


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
            .curve(d3.curveCardinal.tension(0.6));

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
            .duration(300)
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
                .domain([d3.min(datos, d => d.year), d3.max(datos, d => d.year )]);

            const countY = d3.scaleLinear()
                .domain([d3.min(datos, d => d.temp - 1), d3.max(datos, d => d.temp + 1 )]);

            scales.count = { x: countX, y: countY };
            updateChart(datos)

            tooltipMax.data(datos)
                .html(function(d) { return "<p class='tooltip-media-texto'>La máxima fue de <strong>" + d3.max(datos, d => d.tempmax ) + "ºC</strong> en <strong>" + d.yearmax; + "</strong></p>" });

            tooltipMin.data(datos)
                .html(function(d) { return "<p class='tooltip-media-texto'>La mínima fue de <strong>" + d3.min(datos, d => d.tempmin ) + "ºC</strong> en <strong>" + d.yearmin; + "</strong></p>" })

        });


    }

    const resize = () => {

        const stationResize = d3.select("#select-city")
            .property("value")

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

                    const mes = d3.select(this)
                        .property("value")

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
                tooltips(datos)
                mes = 'Albacete';
                update(mes)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()
    menuMes()

}

vulturno()


new SlimSelect({
  select: '#select-city',
  searchPlaceholder: 'Busca tu ciudad'
})

const maxvul = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 48, bottom: 24, left: 24 };
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
            .ticks(10)
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
                               dy: -50, dx: -52,
                               note: {
                                   title: "Entre 2009 y 2017 se establecen el 78% de los récords de máximas",
                                   wrap: 230,
                                   align: "middle"
                               }
                           }
                       ].map(l => {
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
        h = 200;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w )
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
            .duration(300)
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

maxvul()

const minvul = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 48, bottom: 24, left: 24 };
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
                    }
                ].map(l => {
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
            .ticks(10)
            .tickPadding(30);

        g.select(".axis-x")
            .attr("transform", "translate(0," + (height / 2) + ")")
            .call(axisX);

    }

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 200;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w )
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
            .duration(300)
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

minvul()

