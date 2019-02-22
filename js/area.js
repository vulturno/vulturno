function forceLayout(){const t=d3.select(".chart-force"),e=t.select("svg"),a=1.5,n=d3.scaleOrdinal(["#cc0011","#a2000d","#b8000f","#e16973","#ea969d","#f0b7bc","#f6d2d5"]),c=t.append("div").attr("class","tooltip tooltip-under-over").attr("id","tooltip-scatter").style("opacity",0);function r(r){const o=t.node().offsetWidth;e.attr("width",o).attr("height",600),d3.forceSimulation().force("forceX",d3.forceX().x(.5*o)).force("forceY",d3.forceY().y(300)).force("center",d3.forceCenter().x(.5*o).y(300)).force("charge",d3.forceManyBody().strength(5)).force("collision",d3.forceCollide().radius(t=>t.radius+1)).nodes(r).force("collide",d3.forceCollide().strength(.5).radius(function(t){return t.radius+a}).iterations(1)).on("tick",t=>{s.attr("cx",t=>t.x).attr("cy",t=>t.y)});const s=e.selectAll(".circles").remove().exit().data(r).enter().append("circle").attr("class","circles").attr("r",t=>t.radius).attr("fill",t=>n(t.decade)).attr("cx",t=>t.x).attr("cy",t=>t.y).on("mouseover",function(t){var e=this;d3.selectAll(".circles").filter(function(t,a){return this!==e}).transition().duration(300).ease(d3.easeLinear).style("opacity","0.5"),c.transition(),c.style("opacity",1).html(`<p class="tooltip-record-max">En <span class="number">${t.year}</span> se establecieron <span class="number">${t.total}</span> récords.<p/>\n                        `).style("left",d3.event.pageX-50+"px").style("top",d3.event.pageY-60+"px")}).on("mouseout",function(t){d3.selectAll(".circles").transition().duration(800).ease(d3.easeLinear).style("opacity",1),c.transition().duration(200).style("opacity",0)})}window.addEventListener("resize",()=>{r(dataz)}),d3.csv("csv/total-records-max.csv",(t,e)=>{t?console.log(t):(dataz=e,dataz.forEach(t=>{t.size=+t.total/10,t.radius=+t.size,t.year=t.year}),dataz.sort((t,e)=>e.size-t.size),r(dataz))})}function forceLayoutVertical(){const t=d3.select(".chart-force-two"),e=d3.select(".chart-force-two-container"),a=t.select("svg"),n=t.node().offsetWidth;a.attr("width",n).attr("height",600);const c=d3.scaleOrdinal(["#cc0011","#a2000d","#b8000f","#e16973","#ea969d","#f0b7bc","#f6d2d5"]);var r=[100,200,300,400,500,600,700],o=d3.range(70).map(function(t,e){return{radius:25*Math.random(),category:e%7}});d3.forceSimulation(o).force("charge",d3.forceManyBody().strength(5)).force("x",d3.forceX().x(t=>r[t.category])).force("collision",d3.forceCollide().radius(t=>t.radius)).on("tick",function(){var t=e.selectAll("circle").data(o);t.enter().append("circle").attr("r",t=>t.radius).attr("fill",t=>c(t.category)).merge(t).attr("cx",t=>t.x).attr("cy",t=>t.y),t.exit().remove()})}forceLayout(),forceLayoutVertical();const vulturno=()=>{const t=window.innerWidth>0?window.innerWidth:screen.width;margin=t>544?{top:8,right:16,bottom:24,left:48}:{top:8,right:16,bottom:24,left:32};let e=0,a=0;const n=d3.select(".chart-vulturno"),c=n.select("svg");let r={};let o;const s=n.append("div").attr("class","tooltip tooltip-temp").style("opacity",0),i=d3.bisector(t=>t.year).left,l=(t,e)=>{r.count.x.range([0,t]),r.count.y.range([e,0])},d=t=>{const c=d3.axisBottom(r.count.x).tickPadding(5).tickFormat(d3.format("d")).ticks(13);t.select(".axis-x").attr("transform","translate(0,"+a+")").transition().duration(500).ease(d3.easeLinear).call(c);const l=d3.axisLeft(r.count.y).tickPadding(5).tickFormat(t=>t+"ºC").tickSize(-e).ticks(6);t.select(".axis-y").transition().duration(500).ease(d3.easeLinear).call(l);const d=t.select(".focus"),m=t.select(".overlay");d.select(".x-hover-line").attr("y2",a),m.attr("width",e+margin.left+margin.right).attr("height",a).on("mouseover",function(){d.style("display",null)}).on("mouseout",function(){d.style("display","none"),s.style("opacity",0)}).on("mousemove",function(){const t=n.node().offsetWidth/2-176,e=r.count.x.invert(d3.mouse(this)[0]),a=i(o,e,1),c=o[a-1],l=o[a],m=e-c.fecha>l.fecha-e?l:c;s.style("opacity",1).html(`<p class="tooltip-media-texto">En <strong>${m.year}</strong> la temperatura media fue de <strong>${m.temp} ºC</strong>.<p/>`).style("left",t+"px"),d.select(".x-hover-line").attr("transform",`translate(${r.count.x(m.fecha)},0)`)})};function m(t){const s=n.node().offsetWidth;e=s-margin.left-margin.right,a=600-margin.top-margin.bottom,c.attr("width",s).attr("height",600);const i="translate("+margin.left+","+margin.top+")",m=c.select(".chart-vulturno-container");m.attr("transform",i);const u=d3.line().x(t=>r.count.x(t.year)).y(t=>r.count.y(t.temp));l(e,a);const p=n.select(".chart-vulturno-container-bis"),y=p.selectAll(".lines").data([o]),f=y.enter().append("path").attr("class","lines"),x=p.selectAll(".circles").remove().exit().data(o),g=x.enter().append("circle").attr("class","circles");y.merge(f).transition().duration(600).ease(d3.easeLinear).attr("d",u),x.merge(g).attr("cx",t=>r.count.x(t.year)).attr("cy",0).transition().delay(function(t,e){return 10*e}).duration(500).ease(d3.easeLinear).attr("cx",t=>r.count.x(t.year)).attr("cy",t=>r.count.y(t.temp)),d(m)}function u(t){d3.csv("csv/"+t+".csv",(t,n)=>{(o=n).forEach(t=>{t.temp=+t.temp,t.year=t.year,t.fecha=+t.year,t.tempmax=+t.tempmax,t.yearmax=t.yearmax,t.tempmin=+t.tempmin,t.yearmin=t.yearmin}),r.count.x.range([0,e]),r.count.y.range([a,0]);const c=d3.scaleTime().domain([d3.min(o,t=>t.year),d3.max(o,t=>t.year)]),s=d3.scaleLinear().domain([d3.min(o,t=>t.temp-1),d3.max(o,t=>t.temp+1)]);r.count={x:c,y:s},m()})}window.addEventListener("resize",()=>{const t=d3.select("#select-city").property("value").replace(/[\u00f1-\u036f]/g,"").replace(/ /g,"_").replace(/á/g,"a").replace(/Á/g,"A").replace(/é/g,"e").replace(/è/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u").replace(/ñ/g,"n");d3.csv("csv/"+t+".csv",(t,e)=>{o=e,m()})}),d3.csv("csv/Albacete.csv",(t,e)=>{t?console.log(t):((o=e).forEach(t=>{t.year=t.year,t.temp=t.temp,t.fecha=+t.year}),(()=>{const t=c.select(".chart-vulturno-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-vulturno-container-bis"),t.append("rect").attr("class","overlay"),t.append("g").attr("class","focus").style("display","none").append("line").attr("class","x-hover-line hover-line").attr("y1",0),t.select(".focus").append("text").attr("class","text-focus")})(),(()=>{const t=d3.scaleTime().domain([d3.min(o,t=>t.year),d3.max(o,t=>t.year)]),e=d3.scaleLinear().domain([d3.min(o,t=>t.temp-1),d3.max(o,t=>t.temp+1)]);r.count={x:t,y:e}})(),m(),mes="Albacete",u(mes))}),d3.csv("csv/stations.csv",(t,e)=>{if(t)console.log(t);else{o=e;const t=d3.nest().key(t=>t.Name).entries(o),a=d3.select("#select-city");a.selectAll("option").data(t).enter().append("option").attr("value",t=>t.key).text(t=>t.key),a.on("change",function(){let t=d3.select(this).property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,"");console.log(t),u(t)})}})},maxvul=()=>{const t=24,e=48,a=24,n=24;let c=0,r=0,o=0,s=0;const i=d3.select(".chart-temperature-max"),l=i.select("svg"),d={};let m;const u=m=>{o=i.node().offsetWidth,c=o-n-e,r=(s=200)-t-a,l.attr("width",o).attr("height",s);const u="translate("+n+","+t+")",p=l.select(".chart-temperature-max-container");p.attr("transform",u),(t=>{d.count.x.range([0,t])})(c);const y=i.select(".chart-temperature-max-container-bis").selectAll(".circles-max").data(m),f=y.enter().append("circle").attr("class","circles-max");y.merge(f).attr("cx",t=>d.count.x(t.fecha)).attr("cy",r/2).attr("r",0).transition().delay(function(t,e){return 10*e}).duration(500).attr("r",t=>3*t.total).attr("fill-opacity",.6),(t=>{const e=d3.axisBottom(d.count.x).tickFormat(d3.format("d")).ticks(6).tickPadding(30);t.select(".axis-x").attr("transform","translate(0,"+r/2+")").call(e)})(p)};window.addEventListener("resize",()=>{u(m)}),d3.csv("csv/max-record.csv",(t,e)=>{t?console.log(t):((m=e).forEach(t=>{t.fecha=t.yearmax,t.total=t.totalmax}),(()=>{const t=l.select(".chart-temperature-max-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","chart-temperature-max-container-bis")})(),(()=>{const t=d3.scaleLinear().domain([d3.min(m,function(t){return t.fecha}),d3.max(m,function(t){return t.fecha})]),e=d3.scaleLinear().domain([d3.min(m,t=>t.total),d3.max(m,t=>t.total)]);d.count={x:t,y:e}})(),d3.csv("csv/max-record.csv",(t,e)=>{if(t)console.log(t);else{(m=e).forEach(t=>{t.fecha=t.yearmax,t.total=t.totalmax});const t=[{data:{year:2012},y:100,dy:-50,dx:-52,note:{title:"Entre 2009 y 2018 se establecen el 78% de los récords de máximas",wrap:230,align:"middle"}}].map(t=>(t.subject={radius:4},t));window.makeAnnotations=d3.annotation().annotations(t).type(d3.annotationCalloutCircle).accessors({x:t=>d.count.x(t.year),y:t=>d.count.y(t.total)}).accessorsInverse({year:t=>d.count.x.invert(t.x),total:t=>d.count.y.invert(t.y)}).on("subjectover",function(t){t.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden",!1)}).on("subjectout",function(t){t.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden",!0)}),l.append("g").attr("class","annotation-test").call(makeAnnotations),l.selectAll("g.annotation-connector, g.annotation-note")}}),u(m))})},minvul=()=>{const t=24,e=48,a=24,n=24;let c=0,r=0,o=0,s=0;const i=d3.select(".chart-temperature-min"),l=i.select("svg"),d={};let m;const u=m=>{o=i.node().offsetWidth,c=o-n-e,r=(s=200)-t-a,l.attr("width",o).attr("height",s);const u="translate("+n+","+t+")",p=l.select(".chart-temperature-min-container");p.attr("transform",u),(t=>{d.count.x.range([0,t])})(c),(t=>{const e=d3.axisBottom(d.count.x).tickFormat(d3.format("d")).ticks(6).tickPadding(30);t.select(".axis-x").attr("transform","translate(0,"+r/2+")").call(e)})(p);const y=i.select(".chart-temperature-min-container-bis").selectAll(".circles-min").data(m),f=y.enter().append("circle").attr("class","circles-min");y.merge(f).attr("cx",t=>d.count.x(t.fecha)).attr("cy",r/2).attr("r",0).transition().delay(function(t,e){return 10*e}).duration(500).attr("r",t=>3*t.total).attr("fill-opacity",.6)};window.addEventListener("resize",()=>{u(m)}),d3.csv("csv/min-record.csv",(t,e)=>{t?console.log(t):((m=e).forEach(t=>{t.fecha=t.yearmin,t.total=t.totalmin}),(()=>{const t=l.select(".chart-temperature-min-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","chart-temperature-min-container-bis")})(),(()=>{const t=d3.scaleLinear().domain([d3.min(m,function(t){return t.fecha}),d3.max(m,function(t){return t.fecha})]);d.count={x:t}})(),d3.csv("csv/min-record.csv",(t,e)=>{if(t)console.log(t);else{(m=e).forEach(t=>{t.fecha=t.yearmin,t.total=t.totalmin});const t=[{data:{year:1988},y:100,dy:-50,note:{title:"Desde 1986 no se ha batido ni un solo récord de temperatura mínima",wrap:230,align:"middle"}}].map(t=>(t.subject={radius:4},t));window.makeAnnotations=d3.annotation().annotations(t).type(d3.annotationCalloutCircle).accessors({x:t=>d.count.x(t.year),y:t=>d.count.y(t.total)}).accessorsInverse({year:t=>d.count.x.invert(t.x),total:t=>d.count.y.invert(t.y)}).on("subjectover",function(t){t.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden",!1)}).on("subjectout",function(t){t.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden",!0)}),l.append("g").attr("class","annotation-test").call(makeAnnotations),l.selectAll("g.annotation-connector, g.annotation-note")}}),u(m))})},tropicalTotal=()=>{const t=24,e=24,a=24,n=32;let c=0,r=0;const o=d3.select(".chart-tropical"),s=o.select("svg"),i={};let l;const d=l=>{const d=o.node().offsetWidth;c=d-n-e,r=600-t-a,s.attr("width",d).attr("height",600);const m="translate("+n+","+t+")",u=s.select(".chart-tropical-container");u.attr("transform",m);const p=d3.area().x(t=>i.count.x(t.year)).y0(r).y1(t=>i.count.y(t.total)),y=d3.line().x(t=>i.count.x(t.year)).y(t=>i.count.y(t.total));((t,e)=>{i.count.x.range([0,t]),i.count.y.range([e,0])})(c,r);const f=o.select(".chart-tropical-container-bis"),x=f.selectAll(".area-tropical").data([l]),g=f.selectAll(".line-tropical").data([l]),h=x.enter().append("path").attr("class","area-tropical"),v=g.enter().append("path").attr("class","line-tropical");x.merge(h).transition().duration(600).ease(d3.easeLinear).attr("d",p),g.merge(v).transition(600).ease(d3.easeLinear).attr("d",y),(t=>{const e=d3.axisBottom(i.count.x).tickFormat(d3.format("d")).ticks(13);t.select(".axis-x").attr("transform","translate(0,"+r+")").call(e);const a=d3.axisLeft(i.count.y).tickFormat(d3.format("d")).ticks(5).tickSizeInner(-c);t.select(".axis-y").call(a)})(u)};window.addEventListener("resize",()=>{d(l)}),d3.csv("csv/total-tropicales.csv",(t,e)=>{t?console.log(t):((l=e).forEach(t=>{t.year=t.year,t.total=+t.total}),(()=>{const t=s.select(".chart-tropical-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-tropical-container-bis")})(),(()=>{const t=d3.scaleTime().domain([d3.min(l,t=>t.year),d3.max(l,t=>t.year)]),e=d3.scaleLinear().domain([0,d3.max(l,t=>1.25*t.total)]);i.count={x:t,y:e}})(),d(l))})},frostyTotal=()=>{const t=24,e=24,a=24,n=32;let c=0,r=0;const o=d3.select(".chart-frosty"),s=o.select("svg"),i={};let l;const d=l=>{const d=o.node().offsetWidth;c=d-n-e,r=600-t-a,s.attr("width",d).attr("height",600);const m="translate("+n+","+t+")",u=s.select(".chart-frosty-container");u.attr("transform",m);const p=d3.area().x(t=>i.count.x(t.year)).y0(r).y1(t=>i.count.y(t.total)),y=d3.line().x(t=>i.count.x(t.year)).y(t=>i.count.y(t.total));((t,e)=>{i.count.x.range([0,t]),i.count.y.range([e,0])})(c,r);const f=o.select(".chart-frosty-container-bis"),x=f.selectAll(".area-frosty").data([l]),g=f.selectAll(".line-frosty").data([l]),h=g.enter().append("path").attr("class","line-frosty"),v=x.enter().append("path").attr("class","area-frosty");x.merge(v).transition().duration(600).ease(d3.easeLinear).attr("d",p),g.merge(h).transition(600).ease(d3.easeLinear).attr("d",y),(t=>{const e=d3.axisBottom(i.count.x).tickFormat(d3.format("d")).ticks(13);t.select(".axis-x").attr("transform","translate(0,"+r+")").call(e);const a=d3.axisLeft(i.count.y).tickFormat(d3.format("d")).ticks(5).tickSizeInner(-c);t.select(".axis-y").call(a)})(u)};window.addEventListener("resize",()=>{d(l)}),d3.csv("csv/total-heladas.csv",(t,e)=>{t?console.log(t):((l=e).forEach(t=>{t.year=t.year,t.total=+t.total}),(()=>{const t=s.select(".chart-frosty-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-frosty-container-bis")})(),(()=>{const t=d3.scaleTime().domain([d3.min(l,t=>t.year),d3.max(l,t=>t.year)]),e=d3.scaleLinear().domain([0,d3.max(l,t=>1.25*t.total)]);i.count={x:t,y:e}})(),d(l))})},scatterInput=()=>{const t=48,e=16,a=24,n=32;let c=0,r=0;const o=d3.select(".scatter-inputs"),s=o.select("svg"),i={};let l;d3.timeFormat("%m-%d-%Y");const d=d3.select("#select-scatter-city"),m=d3.select(".scatter-inputs").append("div").attr("class","tooltip tooltip-scatter").style("opacity",0),u=t=>t.split("-")[0],p=(t,e)=>{i.count.x.range([0,t]),i.count.y.range([e,0])},y=t=>{const e=d3.axisBottom(i.count.x).tickPadding(10).tickFormat(d3.format("d")).tickSize(-r).ticks(10);t.select(".axis-x").attr("transform","translate(0,"+r+")").transition().duration(500).ease(d3.easeLinear).call(e);const a=d3.axisLeft(i.count.y).tickFormat(t=>t+"ºC").tickSize(-c).ticks(6);t.select(".axis-y").transition().duration(500).ease(d3.easeLinear).call(a)},f=l=>{const d=o.node().offsetWidth;c=d-n-e,r=550-t-a,s.attr("width",d).attr("height",550);const u="translate("+n+","+t+")",f=s.select(".scatter-inputs-container");f.attr("transform",u),p(c,r);const x=o.select(".scatter-inputs-container-dos").selectAll(".scatter-inputs-circles").remove().exit().data(l),g=x.enter().append("circle").attr("class","scatter-inputs-circles");x.merge(g).on("mouseover",function(t){m.transition(),m.attr("class","tooltip tooltip-scatter tooltip-min"),m.style("opacity",1).html(`<p class="tooltip-scatter-text">La temperatura mínima en ${t.year} fue de ${t.minima}ºC<p/>`).style("left",`${d3.event.pageX}px`).style("top",`${d3.event.pageY-28}px`)}).on("mouseout",function(t){m.transition().duration(200).style("opacity",0)}).attr("cx",d/2).attr("cy",275).transition().duration(500).ease(d3.easeLinear).attr("cx",t=>i.count.x(t.year)).attr("cy",t=>i.count.y(t.minima)).attr("r",0).transition().duration(100).ease(d3.easeLinear).attr("r",6).style("fill","#257d98"),y(f)};d3.select("#update").on("click",t=>{x()}),d3.select("#updateMin").on("click",t=>{v()});const x=()=>{let e=d3.select("#updateButtonDay").property("value"),a=d3.select("#updateButtonMonth").property("value");e<10&&(e=`0${e}`.slice(-2)),a<10&&(a=`0${a}`.slice(-2));let l=new RegExp(`^.*${`${a}-${e}`}$`,"gi");g();const f=d.property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,"");d3.csv(`csv/day-by-day/${f}-diarias.csv`,(e,a)=>{(a=a.filter(t=>String(t.fecha).match(l))).forEach(t=>{t.fecha=t.fecha,t.maxima=+t.maxima,t.minima=+t.minima,t.year=u(t.fecha)}),i.count.x.range([0,c]),i.count.y.range([r,0]);const d=d3.scaleTime().domain([d3.min(a,t=>t.year),d3.max(a,t=>t.year)]),f=d3.scaleLinear().domain([d3.min(a,t=>t.maxima),d3.max(a,t=>t.maxima)]);i.count={x:d,y:f};const x="translate("+n+","+t+")",g=s.select(".scatter-inputs-container");g.attr("transform",x),p(c,r);const h=o.select(".scatter-inputs-container-dos").selectAll(".scatter-inputs-circles").remove().exit().data(a),v=h.enter().append("circle").attr("class","scatter-inputs-circles");h.merge(v).on("mouseover",function(t){m.transition(),m.attr("class","tooltip tooltip-scatter tooltip-max"),m.style("opacity",1).html(`<p class="tooltip-scatter-text">La temperatura máxima en ${t.year} fue de ${t.maxima}ºC<p/>`).style("left",`${d3.event.pageX}px`).style("top",`${d3.event.pageY-28}px`)}).on("mouseout",function(t){m.transition().duration(200).style("opacity",0)}).attr("cx",c/2).attr("cy",r/2).transition().duration(500).ease(d3.easeLinear).attr("cx",t=>i.count.x(t.year)).attr("cy",t=>i.count.y(t.maxima)).attr("r",0).transition().duration(100).ease(d3.easeLinear).attr("r",6).style("fill","#dc7176"),y(g)})},g=()=>{const t=document.getElementById("fail-month"),e=(document.getElementById("fail-day"),d3.select("#updateButtonDay").property("value")),a=d3.select("#updateButtonMonth").property("value");h(e,a,"2020")?t.classList.remove("fail-active"):t.classList.add("fail-active")},h=(t,e,a)=>{const n=new Date;return n.setFullYear(a,e-1,t),n.getFullYear()==a&&n.getMonth()==e-1&&n.getDate()==t},v=()=>{let t=d3.select("#updateButtonDay").property("value"),e=d3.select("#updateButtonMonth").property("value");t<10&&(t=`0${t}`.slice(-2)),e<10&&(e=`0${e}`.slice(-2));let a=new RegExp(`^.*${`${e}-${t}`}$`,"gi");g();const n=d.property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,"");d3.csv(`csv/day-by-day/${n}-diarias.csv`,(t,e)=>{(e=e.filter(t=>String(t.fecha).match(a))).forEach(t=>{t.fecha=t.fecha,t.maxima=+t.maxima,t.minima=+t.minima,t.year=u(t.fecha)}),i.count.x.range([0,c]),i.count.y.range([r,0]);const n=d3.scaleTime().domain([d3.min(e,t=>t.year),d3.max(e,t=>t.year)]),o=d3.scaleLinear().domain([d3.min(e,t=>t.minima),d3.max(e,t=>t.minima)]);i.count={x:n,y:o},f(e)})};window.addEventListener("resize",()=>{x()}),d3.csv("csv/day-by-day/Albacete-diarias.csv",(t,e)=>{t?console.log(t):(l=e,(l=e.filter(t=>String(t.fecha).match(/08-01$/))).forEach(t=>{t.fecha=t.fecha,t.maxima=+t.maxima,t.minima=+t.minima,t.year=u(t.fecha)}),(()=>{const t=s.select(".scatter-inputs-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","scatter-inputs-container-dos")})(),(()=>{const t=d3.scaleLinear().domain([d3.min(l,t=>t.year),d3.max(l,t=>t.year)]),e=d3.scaleLinear().domain([d3.min(l,t=>t.minima),d3.max(l,t=>t.minima)]);i.count={x:t,y:e}})(),f(l))}),d3.csv("csv/stations.csv",(t,e)=>{if(t)console.log(t);else{datos=e;const t=d3.nest().key(t=>t.Name).entries(datos);d.selectAll("option").data(t).enter().append("option").attr("value",t=>t.key).text(t=>t.key),d.on("change",function(){d3.select(this).property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,""),x()})}})};scatterInput(),vulturno(),new SlimSelect({select:"#select-city",searchPlaceholder:"Busca tu ciudad"}),new SlimSelect({select:"#select-scatter-city",searchPlaceholder:"Busca tu ciudad"}),maxvul(),tropicalTotal(),frostyTotal(),minvul();