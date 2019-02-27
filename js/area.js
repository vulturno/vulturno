const colorMax=d3.scaleOrdinal(["#f6d2d5","#f0b7bc","#ea969d","#e16973","#cc0011","#a2000d","#b8000f"]),colorMin=d3.scaleOrdinal(["#004d84","#005da0","#006bb7","#0077cc","#4a9eda","#7db9e5","#a5cfed"]),colores=[colorMax,colorMin],csvForce=["csv/total-records-max.csv","csv/total-records-min.csv"],records=["maxima","minima"];function forceLayout(t,e,a){const c=d3.select(`.chart-force-${e}`),n=c.select("svg"),s=1.5,r=c.append("div").attr("class","tooltip tooltip-record").style("opacity",0),o=c.append("div").attr("class","tooltip tooltip-decade").style("opacity",0);function i(i){const l=c.node().offsetWidth;n.attr("width",l).attr("height",608),n.append("text").attr("class","legend-title").attr("transform","translate(50,110)").text("Décadas");const d=n.selectAll(`.circle-${e}`).remove().exit().data(i).enter().append("circle").attr("class",`circle-${e}`).attr("r",t=>t.radius).attr("fill",t=>a(t.decade)).attr("cx",t=>t.x).attr("cy",t=>t.y).on("mouseover",function(t){const a=this;d3.selectAll(`.circle-${e}`).filter(function(t,e){return this!==a}).transition().duration(300).ease(d3.easeLinear).style("opacity",.2),r.transition(),r.style("opacity",1).html(`<p class="tooltip-record-max">En <span class="number">${t.year}</span> se establecieron <span class="number">${t.total}</span> récords.<p/>\n                        `).style("left","50px").style("top","16px")}).on("mouseout",()=>{d3.selectAll(`.circle-${e}`).transition().duration(800).ease(d3.easeLinear).style("opacity",1),r.transition().duration(200).style("opacity",0)});d3.forceSimulation().force("forceX",d3.forceX().x(.5*l)).force("forceY",d3.forceY().y(304)).force("center",d3.forceCenter().x(.5*l).y(304)).force("charge",d3.forceManyBody().strength(5)).force("collision",d3.forceCollide().radius(t=>t.radius+1)).nodes(i).force("collide",d3.forceCollide().strength(.5).radius(t=>t.radius+s).iterations(1)).on("tick",()=>d.attr("cx",({x:t})=>t).attr("cy",({y:t})=>t));const p=d3.group(i.map(t=>t.decade));let m=p.filter((t,e)=>p.indexOf(t)===e);m=m.reverse(t=>t.decade);const u=n.selectAll(`.legend-${e}`).remove().exit().data(m,t=>t).enter().append("g").attr("class",`legend-${e}`).attr("year",t=>t).attr("transform",(t,e)=>`translate(50,${25*(e+5)})`);function y(a){const c=a.attr("year");d3.csv(t,(t,a)=>{const n=a.filter(t=>String(t.decade).match(c));o.data(n).style("opacity",1).html(t=>`<p class="tooltip-record-max">Entre <span class="number">${t.decade}</span> y <span class="number">${Number(t.decade)+9}</span> se establecieron <span class="number">${t.totaldecade}</span> récords de temperatura ${e}.<p/>`).style("left","50px").style("top","16px")})}u.append("rect").attr("width",10).attr("height",10).style("fill",t=>a(t)),u.append("text").attr("x",20).attr("y",10).text(t=>t),u.on("mouseover",function(t){const a=d3.select(this);d3.selectAll(`.legend-${e}`).transition().duration(300).ease(d3.easeLinear).style("opacity",.1),a.transition().duration(300).ease(d3.easeLinear).style("opacity",1),d3.selectAll(`.circle-${e}`).transition().duration(200).ease(d3.easeLinear).style("opacity",.1).filter(e=>e.decade===t).transition().duration(300).ease(d3.easeLinear).style("opacity",1),d3.select(this).call(y)}).on("mouseout",()=>{d3.selectAll(`.legend-${e}`).transition().duration(300).ease(d3.easeLinear).style("opacity",1),d3.selectAll(`.circle-${e}`).transition().duration(300).ease(d3.easeLinear).style("opacity",1),o.style("opacity",0)})}window.addEventListener("resize",()=>{i(dataz)}),d3.csv(t,(t,e)=>{t?console.log(t):(dataz=e,dataz.forEach(t=>{t.size=+t.total/10,t.radius=+t.size,t.year=t.year}),i(dataz))})}forceLayout(csvForce[0],records[0],colores[0]),forceLayout(csvForce[1],records[1],colores[1]);const vulturno=()=>{if((window.innerWidth>0?window.innerWidth:screen.width)>544){}else{}let t=0,e=0;const a=d3.select(".chart-vulturno"),c=a.select("svg"),n={};let s;const r=a.append("div").attr("class","tooltip tooltip-temp").style("opacity",0),o=d3.bisector(t=>t.year).left,i=(t,e)=>{n.count.x.range([0,t]),n.count.y.range([e,0])},l=c=>{const i=d3.axisBottom(n.count.x).tickPadding(5).tickFormat(d3.format("d")).ticks(13);c.select(".axis-x").attr("transform",`translate(0,${e})`).transition().duration(500).ease(d3.easeLinear).call(i);const l=d3.axisLeft(n.count.y).tickPadding(5).tickFormat(t=>t+"ºC").tickSize(-t).ticks(6);c.select(".axis-y").transition().duration(500).ease(d3.easeLinear).call(l);const d=c.select(".focus"),p=c.select(".overlay");d.select(".x-hover-line").attr("y2",e),p.attr("width",t+margin.left+margin.right).attr("height",e).on("mouseover",()=>{d.style("display",null)}).on("mouseout",()=>{d.style("display","none"),r.style("opacity",0)}).on("mousemove",function(){const t=a.node().offsetWidth/2-176,e=n.count.x.invert(d3.mouse(this)[0]),c=o(s,e,1),i=s[c-1],l=s[c],p=e-i.fecha>l.fecha-e?l:i;r.style("opacity",1).html(`<p class="tooltip-media-texto">En <strong>${p.year}</strong> la temperatura media fue de <strong>${p.temp} ºC</strong>.<p/>`).style("left",`${t}px`),d.select(".x-hover-line").attr("transform",`translate(${n.count.x(p.fecha)},0)`)})};function d(r){const o=a.node().offsetWidth;t=o-margin.left-margin.right,e=608-margin.top-margin.bottom,c.attr("width",o).attr("height",608);const d=`translate(${margin.left},${margin.top})`,p=c.select(".chart-vulturno-container");p.attr("transform",d);const m=d3.line().x(t=>n.count.x(t.year)).y(t=>n.count.y(t.temp));i(t,e);const u=a.select(".chart-vulturno-container-bis"),y=u.selectAll(".lines").data([s]),x=y.enter().append("path").attr("class","lines"),g=u.selectAll(".circles").remove().exit().data(s),f=g.enter().append("circle").attr("class","circles");y.merge(x).transition().duration(600).ease(d3.easeLinear).attr("d",m),g.merge(f).attr("cx",t=>n.count.x(t.year)).attr("cy",0).transition().delay((t,e)=>10*e).duration(500).ease(d3.easeLinear).attr("cx",t=>n.count.x(t.year)).attr("cy",t=>n.count.y(t.temp)),l(p)}function p(a){d3.csv(`csv/${a}.csv`,(a,c)=>{(s=c).forEach(t=>{t.temp=+t.temp,t.year=t.year,t.fecha=+t.year,t.tempmax=+t.tempmax,t.yearmax=t.yearmax,t.tempmin=+t.tempmin,t.yearmin=t.yearmin}),n.count.x.range([0,t]),n.count.y.range([e,0]);const r=d3.scaleTime().domain([d3.min(s,t=>t.year),d3.max(s,t=>t.year)]),o=d3.scaleLinear().domain([d3.min(s,t=>t.temp-1),d3.max(s,t=>t.temp+1)]);n.count={x:r,y:o},d()})}window.addEventListener("resize",()=>{const t=d3.select("#select-city").property("value").replace(/[\u00f1-\u036f]/g,"").replace(/ /g,"_").replace(/á/g,"a").replace(/Á/g,"A").replace(/é/g,"e").replace(/è/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u").replace(/ñ/g,"n");d3.csv(`csv/${t}.csv`,(t,e)=>{s=e,d()})}),d3.csv("csv/Albacete.csv",t=>{(s=t).forEach(t=>{t.year=t.year,t.temp=t.temp,t.fecha=+t.year}),(()=>{const t=c.select(".chart-vulturno-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-vulturno-container-bis"),t.append("rect").attr("class","overlay"),t.append("g").attr("class","focus").style("display","none").append("line").attr("class","x-hover-line hover-line").attr("y1",0),t.select(".focus").append("text").attr("class","text-focus")})(),(()=>{const t=d3.scaleTime().domain([d3.min(s,t=>t.year),d3.max(s,t=>t.year)]),e=d3.scaleLinear().domain([d3.min(s,t=>t.temp-1),d3.max(s,t=>t.temp+1)]);n.count={x:t,y:e}})(),d(),p("Albacete")}),d3.csv("csv/stations.csv",(t,e)=>{if(t)console.log(t);else{s=e;const t=d3.nest().key(t=>t.Name).entries(s),a=d3.select("#select-city");a.selectAll("option").data(t).enter().append("option").attr("value",t=>t.key).text(t=>t.key),a.on("change",function(){p(d3.select(this).property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,""))})}})},maxvul=()=>{const t=0,e=48,a=24,c=24;let n=0,s=0,r=0,o=0;const i=d3.select(".chart-temperature-max"),l=i.select("svg"),d={};let p;const m=()=>{d3.csv("csv/max-record.csv",(t,e)=>{if(t)console.log(t);else{(p=e).forEach(t=>{t.fecha=t.yearmax,t.total=t.totalmax});const t=[{data:{year:2012},y:100,dy:-50,dx:-52,note:{title:"Entre 2009 y 2018 se establecen el 78% de los récords de máximas",wrap:230,align:"middle"}}].map(t=>(this.subject={radius:4},t));window.makeAnnotations=d3.annotation().annotations(t).type(d3.annotationCalloutCircle).accessors({x:t=>d.count.x(t.year),y:t=>d.count.y(t.total)}).accessorsInverse({year:t=>d.count.x.invert(t.x),total:t=>d.count.y.invert(t.y)}).on("subjectover",t=>{t.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden",!1)}).on("subjectout",t=>{t.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden",!0)}),l.append("g").attr("class","annotation-test").call(makeAnnotations),l.selectAll("g.annotation-connector, g.annotation-note")}})},u=p=>{r=i.node().offsetWidth,n=r-c-e,s=(o=208)-t-a,l.attr("width",r).attr("height",o);const m=`translate(${c},${t})`,u=l.select(".chart-temperature-max-container");u.attr("transform",m),(t=>{d.count.x.range([0,t])})(n);const y=i.select(".chart-temperature-max-container-bis").selectAll(".circles-max").data(p),x=y.enter().append("circle").attr("class","circles-max");y.merge(x).attr("cx",t=>d.count.x(t.fecha)).attr("cy",s/2).attr("r",0).transition().delay((t,e)=>10*e).duration(500).attr("r",t=>3*t.total).attr("fill-opacity",.6),(t=>{const e=d3.axisBottom(d.count.x).tickFormat(d3.format("d")).ticks(6).tickPadding(30);t.select(".axis-x").attr("transform",`translate(0,${s/2})`).call(e)})(u)};window.addEventListener("resize",()=>{u(p)}),d3.csv("csv/max-record.csv",(t,e)=>{t?console.log(t):((p=e).forEach(t=>{t.fecha=t.yearmax,t.total=t.totalmax}),(()=>{const t=l.select(".chart-temperature-max-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","chart-temperature-max-container-bis")})(),(()=>{const t=d3.scaleLinear().domain([d3.min(p,t=>t.fecha),d3.max(p,t=>t.fecha)]),e=d3.scaleLinear().domain([d3.min(p,t=>t.total),d3.max(p,t=>t.total)]);d.count={x:t,y:e}})(),m(),u(p))})},minvul=()=>{const t=0,e=48,a=24,c=24;let n=0,s=0,r=0,o=0;const i=d3.select(".chart-temperature-min"),l=i.select("svg"),d={};let p;const m=()=>{d3.csv("csv/min-record.csv",(t,e)=>{if(t)console.log(t);else{(p=e).forEach(t=>{t.fecha=t.yearmin,t.total=t.totalmin});const t=[{data:{year:1988},y:100,dy:-50,note:{title:"Desde 1986 no se ha batido ni un solo récord de temperatura mínima",wrap:230,align:"middle"}}].map(t=>(this.subject={radius:4},t));window.makeAnnotations=d3.annotation().annotations(t).type(d3.annotationCalloutCircle).accessors({x:t=>d.count.x(t.year),y:t=>d.count.y(t.total)}).accessorsInverse({year:t=>d.count.x.invert(t.x),total:t=>d.count.y.invert(t.y)}).on("subjectover",t=>{t.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden",!1)}).on("subjectout",t=>{t.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden",!0)}),l.append("g").attr("class","annotation-test").call(makeAnnotations),l.selectAll("g.annotation-connector, g.annotation-note")}})},u=p=>{r=i.node().offsetWidth,n=r-c-e,s=(o=208)-t-a,l.attr("width",r).attr("height",o);const m=`translate(${c},${t})`,u=l.select(".chart-temperature-min-container");u.attr("transform",m),(t=>{d.count.x.range([0,t])})(n),(t=>{const e=d3.axisBottom(d.count.x).tickFormat(d3.format("d")).ticks(6).tickPadding(30);t.select(".axis-x").attr("transform",`translate(0,${s/2})`).call(e)})(u);const y=i.select(".chart-temperature-min-container-bis").selectAll(".circles-min").data(p),x=y.enter().append("circle").attr("class","circles-min");y.merge(x).attr("cx",t=>d.count.x(t.fecha)).attr("cy",s/2).attr("r",0).transition().delay((t,e)=>10*e).duration(500).attr("r",t=>3*t.total).attr("fill-opacity",.6)};window.addEventListener("resize",()=>{u(p)}),d3.csv("csv/min-record.csv",(t,e)=>{t?console.log(t):((p=e).forEach(t=>{t.fecha=t.yearmin,t.total=t.totalmin}),(()=>{const t=l.select(".chart-temperature-min-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","chart-temperature-min-container-bis")})(),(()=>{const t=d3.scaleLinear().domain([d3.min(p,t=>t.fecha),d3.max(p,t=>t.fecha)]);d.count={x:t}})(),m(),u(p))})},tropicalTotal=()=>{const t=0,e=24,a=24,c=32;let n=0,s=0;const r=d3.select(".chart-tropical"),o=r.select("svg"),i={};let l;const d=l=>{const d=r.node().offsetWidth;n=d-c-e,s=608-t-a,o.attr("width",d).attr("height",608);const p=`translate(${c},${t})`,m=o.select(".chart-tropical-container");m.attr("transform",p);const u=d3.area().x(t=>i.count.x(t.year)).y0(s).y1(t=>i.count.y(t.total)),y=d3.line().x(t=>i.count.x(t.year)).y(t=>i.count.y(t.total));((t,e)=>{i.count.x.range([0,t]),i.count.y.range([e,0])})(n,s);const x=r.select(".chart-tropical-container-bis"),g=x.selectAll(".area-tropical").data([l]),f=x.selectAll(".line-tropical").data([l]),h=g.enter().append("path").attr("class","area-tropical"),v=f.enter().append("path").attr("class","line-tropical");g.merge(h).transition().duration(600).ease(d3.easeLinear).attr("d",u),f.merge(v).transition(600).ease(d3.easeLinear).attr("d",y),(t=>{const e=d3.axisBottom(i.count.x).tickFormat(d3.format("d")).ticks(13);t.select(".axis-x").attr("transform",`translate(0,${s})`).call(e);const a=d3.axisLeft(i.count.y).tickFormat(d3.format("d")).ticks(5).tickSizeInner(-n);t.select(".axis-y").call(a)})(m)};window.addEventListener("resize",()=>{d(l)}),d3.csv("csv/total-tropicales.csv",(t,e)=>{t?console.log(t):((l=e).forEach(t=>{t.year=t.year,t.total=+t.total}),(()=>{const t=o.select(".chart-tropical-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-tropical-container-bis")})(),(()=>{const t=d3.scaleTime().domain([d3.min(l,t=>t.year),d3.max(l,t=>t.year)]),e=d3.scaleLinear().domain([0,d3.max(l,t=>1.25*t.total)]);i.count={x:t,y:e}})(),d(l))})},frostyTotal=()=>{const t=0,e=24,a=24,c=32;let n=0,s=0;const r=d3.select(".chart-frosty"),o=r.select("svg"),i={};let l;const d=l=>{const d=r.node().offsetWidth;n=d-c-e,s=608-t-a,o.attr("width",d).attr("height",608);const p=`translate(${c},${t})`,m=o.select(".chart-frosty-container");m.attr("transform",p);const u=d3.area().x(t=>i.count.x(t.year)).y0(s).y1(t=>i.count.y(t.total)),y=d3.line().x(t=>i.count.x(t.year)).y(t=>i.count.y(t.total));((t,e)=>{i.count.x.range([0,t]),i.count.y.range([e,0])})(n,s);const x=r.select(".chart-frosty-container-bis"),g=x.selectAll(".area-frosty").data([l]),f=x.selectAll(".line-frosty").data([l]),h=f.enter().append("path").attr("class","line-frosty"),v=g.enter().append("path").attr("class","area-frosty");g.merge(v).transition().duration(600).ease(d3.easeLinear).attr("d",u),f.merge(h).transition(600).ease(d3.easeLinear).attr("d",y),(t=>{const e=d3.axisBottom(i.count.x).tickFormat(d3.format("d")).ticks(13);t.select(".axis-x").attr("transform",`translate(0,${s})`).call(e);const a=d3.axisLeft(i.count.y).tickFormat(d3.format("d")).ticks(5).tickSizeInner(-n);t.select(".axis-y").call(a)})(m)};window.addEventListener("resize",()=>{d(l)}),d3.csv("csv/total-heladas.csv",(t,e)=>{t?console.log(t):((l=e).forEach(t=>{t.year=t.year,t.total=+t.total}),(()=>{const t=o.select(".chart-frosty-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-frosty-container-bis")})(),(()=>{const t=d3.scaleTime().domain([d3.min(l,t=>t.year),d3.max(l,t=>t.year)]),e=d3.scaleLinear().domain([0,d3.max(l,t=>1.25*t.total)]);i.count={x:t,y:e}})(),d(l))})},scatterInput=()=>{const t=48,e=16,a=24,c=32;let n=0,s=0;const r=d3.select(".scatter-inputs"),o=r.select("svg"),i={};let l;const d=d3.select("#select-scatter-city"),p=d3.select(".scatter-inputs").append("div").attr("class","tooltip tooltip-scatter").style("opacity",0),m=t=>t.split("-")[0],u=(t,e)=>{i.count.x.range([0,t]),i.count.y.range([e,0])},y=t=>{const e=d3.axisBottom(i.count.x).tickPadding(10).tickFormat(d3.format("d")).tickSize(-s).ticks(10);t.select(".axis-x").attr("transform",`translate(0,${s})`).transition().duration(500).ease(d3.easeLinear).call(e);const a=d3.axisLeft(i.count.y).tickFormat(t=>t+"ºC").tickSize(-n).ticks(6);t.select(".axis-y").transition().duration(500).ease(d3.easeLinear).call(a)},x=l=>{const d=r.node().offsetWidth;n=d-c-e,s=608-t-a,o.attr("width",d).attr("height",608);const m=`translate(${c},${t})`,x=o.select(".scatter-inputs-container");x.attr("transform",m),u(n,s);const g=r.select(".scatter-inputs-container-dos").selectAll(".scatter-inputs-circles").remove().exit().data(l),f=g.enter().append("circle").attr("class","scatter-inputs-circles");g.merge(f).on("mouseover",t=>{p.transition(),p.attr("class","tooltip tooltip-scatter tooltip-min"),p.style("opacity",1).html(`<p class="tooltip-scatter-text">La temperatura mínima en ${t.year} fue de ${t.minima}ºC<p/>`).style("left",`${d3.event.pageX}px`).style("top",`${d3.event.pageY-28}px`)}).on("mouseout",()=>{p.transition().duration(200).style("opacity",0)}).attr("cx",d/2).attr("cy",304).transition().duration(500).ease(d3.easeLinear).attr("cx",t=>i.count.x(t.year)).attr("cy",t=>i.count.y(t.minima)).attr("r",0).transition().duration(100).ease(d3.easeLinear).attr("r",6).style("fill","#257d98"),y(x)},g=()=>{let e=d3.select("#updateButtonDay").property("value"),a=d3.select("#updateButtonMonth").property("value");e<10&&(e=`0${e}`.slice(-2)),a<10&&(a=`0${a}`.slice(-2));let l=new RegExp(`^.*${`${a}-${e}`}$`,"gi");f();const x=d.property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,"");d3.csv(`csv/day-by-day/${x}-diarias.csv`,(e,a)=>{(a=a.filter(t=>String(t.fecha).match(l))).forEach(t=>{t.fecha=t.fecha,t.maxima=+t.maxima,t.minima=+t.minima,t.year=m(t.fecha)}),i.count.x.range([0,n]),i.count.y.range([s,0]);const d=d3.scaleTime().domain([d3.min(a,t=>t.year),d3.max(a,t=>t.year)]),x=d3.scaleLinear().domain([d3.min(a,t=>t.maxima),d3.max(a,t=>t.maxima)]);i.count={x:d,y:x};const g=`translate(${c},${t})`,f=o.select(".scatter-inputs-container");f.attr("transform",g),u(n,s);const h=r.select(".scatter-inputs-container-dos").selectAll(".scatter-inputs-circles").remove().exit().data(a),v=h.enter().append("circle").attr("class","scatter-inputs-circles");h.merge(v).on("mouseover",t=>{p.transition(),p.attr("class","tooltip tooltip-scatter tooltip-max"),p.style("opacity",1).html(`<p class="tooltip-scatter-text">La temperatura máxima en ${t.year} fue de ${t.maxima}ºC<p/>`).style("left",`${d3.event.pageX}px`).style("top",`${d3.event.pageY-28}px`)}).on("mouseout",()=>{p.transition().duration(200).style("opacity",0)}).attr("cx",n/2).attr("cy",s/2).transition().duration(500).ease(d3.easeLinear).attr("cx",t=>i.count.x(t.year)).attr("cy",t=>i.count.y(t.maxima)).attr("r",0).transition().duration(100).ease(d3.easeLinear).attr("r",6).style("fill","#dc7176"),y(f)})},f=()=>{const t=document.getElementById("fail-month"),e=d3.select("#updateButtonDay").property("value"),a=d3.select("#updateButtonMonth").property("value");h(e,a,"2020")?t.classList.remove("fail-active"):t.classList.add("fail-active")},h=(t,e,a)=>{const c=new Date;return c.setFullYear(a,e-1,t),c.getFullYear()==a&&c.getMonth()==e-1&&c.getDate()==t};d3.select("#update").on("click",t=>{g()}),d3.select("#updateMin").on("click",t=>{(()=>{let t=d3.select("#updateButtonDay").property("value"),e=d3.select("#updateButtonMonth").property("value");t<10&&(t=`0${t}`.slice(-2)),e<10&&(e=`0${e}`.slice(-2));const a=new RegExp(`^.*${`${e}-${t}`}$`,"gi");f();const c=d.property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,"");d3.csv(`csv/day-by-day/${c}-diarias.csv`,(t,e)=>{(e=e.filter(t=>String(t.fecha).match(a))).forEach(t=>{t.fecha=t.fecha,t.maxima=+t.maxima,t.minima=+t.minima,t.year=m(t.fecha)}),i.count.x.range([0,n]),i.count.y.range([s,0]);const c=d3.scaleTime().domain([d3.min(e,t=>t.year),d3.max(e,t=>t.year)]),r=d3.scaleLinear().domain([d3.min(e,t=>t.minima),d3.max(e,t=>t.minima)]);i.count={x:c,y:r},x(e)})})()});window.addEventListener("resize",()=>{g()}),d3.csv("csv/day-by-day/Albacete-diarias.csv",(t,e)=>{t?console.log(t):(l=e,(l=e.filter(t=>String(t.fecha).match(/08-01$/))).forEach(t=>{t.fecha=t.fecha,t.maxima=+t.maxima,t.minima=+t.minima,t.year=m(t.fecha)}),(()=>{const t=o.select(".scatter-inputs-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","scatter-inputs-container-dos")})(),(()=>{const t=d3.scaleLinear().domain([d3.min(l,t=>t.year),d3.max(l,t=>t.year)]),e=d3.scaleLinear().domain([d3.min(l,t=>t.minima),d3.max(l,t=>t.minima)]);i.count={x:t,y:e}})(),x(l))}),d3.csv("csv/stations.csv",(t,e)=>{if(t)console.log(t);else{datos=e;const t=d3.nest().key(t=>t.Name).entries(datos);d.selectAll("option").data(t).enter().append("option").attr("value",t=>t.key).text(t=>t.key),d.on("change",function(){d3.select(this).property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,""),g()})}})},tropicalCities=()=>{const t=window.innerWidth>0?window.innerWidth:screen.width;margin=t>544?{top:8,right:16,bottom:24,left:48}:{top:8,right:16,bottom:24,left:32};let e=0,a=0;const c=d3.select(".chart-cities-tropical"),n=c.select("svg"),s={};let r;const o=(t,e)=>{s.count.x.range([0,t]),s.count.y.range([e,0])},i=t=>{const c=d3.axisBottom(s.count.x).tickPadding(5).tickFormat(d3.format("d")).ticks(13);t.select(".axis-x").attr("transform",`translate(0,${a})`).transition().duration(500).ease(d3.easeLinear).call(c);const n=d3.axisLeft(s.count.y).tickPadding(5).tickFormat(t=>t).tickSize(-e).ticks(6);t.select(".axis-y").transition().duration(500).ease(d3.easeLinear).call(n)};function l(t){const l=c.node().offsetWidth;e=l-margin.left-margin.right,a=608-margin.top-margin.bottom,n.attr("width",l).attr("height",608);const d=`translate(${margin.left},${margin.top})`,p=n.select(".chart-cities-tropical-container");p.attr("transform",d);const m=d3.area().x(t=>s.count.x(t.year)).y0(a).y1(t=>s.count.y(t.total)),u=d3.line().x(t=>s.count.x(t.year)).y(t=>s.count.y(t.total));o(e,a);const y=c.select(".chart-cities-tropical-container-bis"),x=y.selectAll(".area-cities-tropical").data([r]),g=y.selectAll(".line-cities-tropical").data([r]),f=x.enter().append("path").attr("class","area-cities-tropical"),h=g.enter().append("path").attr("class","line-cities-tropical");x.merge(f).transition().duration(600).ease(d3.easeLinear).attr("d",m),g.merge(h).transition(600).ease(d3.easeLinear).attr("d",u),i(p)}function d(t){d3.csv(`csv/tropicales/${t}-total-tropicales.csv`,(t,c)=>{(r=c).forEach(t=>{t.fecha=+t.year,t.tropical=+t.total}),s.count.x.range([0,e]),s.count.y.range([a,0]);const n=d3.scaleTime().domain([d3.min(r,t=>t.fecha),d3.max(r,t=>t.fecha)]),o=d3.scaleLinear().domain([0,d3.max(r,t=>1.25*t.tropical)]);s.count={x:n,y:o},l()})}window.addEventListener("resize",()=>{const t=d3.select("#select-city-tropical").property("value").replace(/[\u00f1-\u036f]/g,"").replace(/ /g,"_").replace(/á/g,"a").replace(/Á/g,"A").replace(/é/g,"e").replace(/è/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u").replace(/ñ/g,"n");d3.csv(`csv/${t}.csv`,(t,e)=>{r=e,l()})}),d3.csv("csv/tropicales/Albacete-total-tropicales.csv",(t,e)=>{t?console.log(t):((r=e).forEach(t=>{t.fecha=+t.year,t.tropical=+t.total}),(()=>{const t=n.select(".chart-cities-tropical-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-cities-tropical-container-bis")})(),(()=>{const t=d3.scaleTime().domain([d3.min(r,t=>t.fecha),d3.max(r,t=>t.fecha)]),e=d3.scaleLinear().domain([0,d3.max(r,t=>1.25*t.tropical)]);s.count={x:t,y:e}})(),l(),d("Albacete"))}),d3.csv("csv/stations.csv",(t,e)=>{if(t)console.log(t);else{r=e;const t=d3.nest().key(t=>t.Name).entries(r),a=d3.select("#select-city-tropical");a.selectAll("option").data(t).enter().append("option").attr("value",t=>t.key).text(t=>t.key),a.on("change",function(){d(d3.select(this).property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,""))})}})},tempExt=()=>{const t=window.innerWidth>0?window.innerWidth:screen.width;margin=t>544?{top:8,right:16,bottom:24,left:48}:{top:8,right:16,bottom:24,left:32};let e=0,a=0;const c=d3.select(".chart-temperature-ext"),n=c.select("svg"),s={};let r;const o=(t,e)=>{s.count.x.range([0,t]),s.count.y.range([e,0])},i=t=>{const c=d3.axisBottom(s.count.x).tickPadding(5).tickFormat(d3.format("d")).ticks(13);t.select(".axis-x").attr("transform",`translate(0,${a})`).transition().duration(500).ease(d3.easeLinear).call(c);const n=d3.axisLeft(s.count.y).tickPadding(5).tickFormat(t=>t).tickSize(-e).ticks(6);t.select(".axis-y").transition().duration(500).ease(d3.easeLinear).call(n)};function l(t){const l=c.node().offsetWidth;e=l-margin.left-margin.right,a=608-margin.top-margin.bottom,n.attr("width",l).attr("height",608);const d=`translate(${margin.left},${margin.top})`,p=n.select(".chart-temperature-ext-container");p.attr("transform",d);const m=d3.area().x(t=>s.count.x(t.year)).y0(a).y1(t=>s.count.y(t.total)),u=d3.line().x(t=>s.count.x(t.year)).y(t=>s.count.y(t.total));o(e,a);const y=c.select(".chart-temperature-ext-container-bis"),x=y.selectAll(".area-ext").data([r]),g=y.selectAll(".line-ext").data([r]),f=x.enter().append("path").attr("class","area-ext"),h=g.enter().append("path").attr("class","line-ext");x.merge(f).transition().duration(600).ease(d3.easeLinear).attr("d",m),g.merge(h).transition(600).ease(d3.easeLinear).attr("d",u),i(p)}function d(t){d3.csv(`csv/total-temp-${t}.csv`,(t,c)=>{(r=c).forEach(t=>{t.fecha=+t.year,t.tropical=+t.total}),s.count.x.range([0,e]),s.count.y.range([a,0]);const n=d3.scaleTime().domain([d3.min(r,t=>t.fecha),d3.max(r,t=>t.fecha)]),o=d3.scaleLinear().domain([0,d3.max(r,t=>1.25*t.tropical)]);s.count={x:n,y:o},l()})}window.addEventListener("resize",()=>{const t=d3.select("#select-ext").property("value").replace(/[\u00f1-\u036f]/g,"").replace(/ /g,"_").replace(/á/g,"a").replace(/Á/g,"A").replace(/é/g,"e").replace(/è/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u").replace(/ñ/g,"n");d3.csv(`csv/${t}.csv`,(t,e)=>{r=e,l()})}),d3.csv("csv/total-temp-35.csv",(t,e)=>{t?console.log(t):((r=e).forEach(t=>{t.fecha=+t.year,t.tropical=+t.total}),(()=>{const t=n.select(".chart-temperature-ext-container");t.append("g").attr("class","axis axis-x"),t.append("g").attr("class","axis axis-y"),t.append("g").attr("class","chart-temperature-ext-container-bis")})(),(()=>{const t=d3.scaleTime().domain([d3.min(r,t=>t.fecha),d3.max(r,t=>t.fecha)]),e=d3.scaleLinear().domain([0,d3.max(r,t=>1.25*t.tropical)]);s.count={x:t,y:e}})(),l(),d("35"))}),d3.csv("csv/temperature.csv",(t,e)=>{if(t)console.log(t);else{r=e;const t=d3.nest().key(t=>t.Name).entries(r),a=d3.select("#select-ext");a.selectAll("option").data(t).enter().append("option").attr("value",({key:t})=>t).text(({key:t})=>`${t}ºC`),a.on("change",function(){d(d3.select(this).property("value").replace(/ /g,"_").normalize("NFD").replace(/[\u0300-\u036f]/g,""))})}})};tropicalCities(),scatterInput(),vulturno(),new SlimSelect({select:"#select-city",searchPlaceholder:"Busca tu ciudad"}),new SlimSelect({select:"#select-scatter-city",searchPlaceholder:"Busca tu ciudad"}),new SlimSelect({select:"#select-city-tropical",searchPlaceholder:"Busca tu ciudad"}),new SlimSelect({select:"#select-ext",searchPlaceholder:"Selecciona temperatura"}),maxvul(),tropicalTotal(),frostyTotal(),minvul(),tempExt();