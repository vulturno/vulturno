const areaInput = () => {

    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 16, right: 16, bottom: 24, left: 32 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-lluvia-input');
    const svg = chart.select('svg');
    let scales = {};
    const temp = "ºC";


    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain([1950, 2017]);


        const countY = d3.scaleLinear()
            .domain([14, 23]);

        scales.count = { x: countX, y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.chart-lluvia-input-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'area-input-container');

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
    }

    function updateChart(data) {
        const w = chart.node().offsetWidth;
        const h = 400;


        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.chart-lluvia-input-container')

        g.attr("transform", translate)

        const area = d3.area()
            .x(d => scales.count.x(d.year))
            .y0(height)
            .y1(d => scales.count.y(d.temp));

        updateScales(width, height)

        const container = chart.select('.area-input-container')

        const layer = container.selectAll('.area')
            .data([data])

        const newLayer = layer.enter()
            .append('path')
            .attr('class', 'area area-bgc7')

        const dots = container.selectAll('.circles')
            .data(data)

        const dotsLayer = dots.enter()
            .append("circle")
            .attr("class", "circles")
            .attr("fill", "#921d5d")
            .attr("opacity", 1)

        layer.merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .attr('d', area)

        dots.merge(dotsLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .attr("cx", d => scales.count.x(d.year))
            .attr("cy", d => scales.count.y(d.temp))
            .attr('r', 3)

        drawAxes(g)

    }

    function update(mes) {

        d3.csv("csv/" + mes + ".csv", (error, data) => {

            data.forEach(d => {
                d.temp = +d.temp;
                d.year = d.year;
            });

            scales.count.x.range([0, width]);
            scales.count.y.range([height, 0]);

            const countX = d3.scaleTime()
                .domain([d3.min(data, d => d.year), d3.max(data, d => d.year )]);

            const countY = d3.scaleLinear()
                .domain([d3.min(data, d => d.temp - 5), d3.max(data, d => d.temp + 5 )]);

            scales.count = { x: countX, y: countY };
            updateChart(data)

        });


    }

    const resize = () => {

        d3.csv("csv/total-media-limpio.csv", (error, data) => {

            const mesActual = d3.select("#mes-mensual-minima")
                .select("select")
                .property("value")

            data = data.filter(d => String(d.mes).match(mesActual));

            updateChart(data)


        });

    }

    const menuMes = () => {
        d3.csv('csv/stations.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                const nest = d3.nest()
                    .key(d => d.Name)
                    .entries(data);

                console.log(nest)

                const mesMenuMensualMinima = d3.select("#select-city");

                mesMenuMensualMinima
                    .selectAll("option")
                    .data(nest)
                    .enter()
                    .append("option")
                    .attr("value", d => d.key)
                    .text(d => d.key)

                mesMenuMensualMinima.on('change', function() {

                    const mes = d3.select(this)
                        .property("value")

                    update(mes)

                });


            }

        });

    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/1249I.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {

                data.forEach(d => {
                    d.year = d.year;
                    d.temp = d.temp;
                });
                setupElements()
                setupScales()
                updateChart(data)
            }

        });
    }

    window.addEventListener('resize', resize)

    loadData()
    menuMes()

}

areaInput()


new SlimSelect({
  select: '#select-city'
})
