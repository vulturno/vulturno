function quotesTemp () {
  const list = [
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Zaragoza</strong>.</span><span class="notas-text-number">44.5ºC</span><span class="notas-text-date">07/07/2015</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Albacete</strong>.</span><span class="notas-text-number">43.3ºC</span><span class="notas-text-date">14/08/2021</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Alicante</strong>.</span><span class="notas-text-number">41.4ºC</span><span class="notas-text-date">04/07/1994</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Almería</strong>.</span><span class="notas-text-number">41.6ºC</span><span class="notas-text-date">06/07/2019</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Avila</strong>.</span><span class="notas-text-number">38.8ºC</span><span class="notas-text-date">21/08/2021</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Badajoz</strong>.</span><span class="notas-text-number">45.4ºC</span><span class="notas-text-date">13/07/2017</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Barcelona</strong>.</span><span class="notas-text-number">37.4ºC</span><span class="notas-text-date">28/08/2010</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Bilbao</strong>.</span><span class="notas-text-number">41.9ºC</span><span class="notas-text-date">04/08/2003</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Burgos</strong>.</span><span class="notas-text-number">38.8ºC</span><span class="notas-text-date">04/08/2003</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Caceres</strong>.</span><span class="notas-text-number">43.7ºC</span><span class="notas-text-date">14/08/2021</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Castellón</strong>.</span><span class="notas-text-number">40.6ºC</span><span class="notas-text-date">23/07/2009</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Ciudad Real</strong>.</span><span class="notas-text-number">43.7ºC</span><span class="notas-text-date">13/07/2017</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Cordoba</strong>.</span><span class="notas-text-number">46.9ºC</span><span class="notas-text-date">13/07/2017</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Cuenca</strong>.</span><span class="notas-text-number">41.5ºC</span><span class="notas-text-date">13/08/2021</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>A Coruña</strong>.</span><span class="notas-text-number">39.6ºC</span><span class="notas-text-date">28/08/1961</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Donostia</strong>.</span><span class="notas-text-number">39ºC</span><span class="notas-text-date">23/07/2017</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Girona</strong>.</span><span class="notas-text-number">43ºC</span><span class="notas-text-date">28/06/2019</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Gran Canaria</strong>.</span><span class="notas-text-number">44.2ºC</span><span class="notas-text-date">13/07/1952</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Granada</strong>.</span><span class="notas-text-number">43.8ºC</span><span class="notas-text-date">13/08/2021</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Huelva</strong>.</span><span class="notas-text-number">43.8ºC</span><span class="notas-text-date">25/07/2004</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Huesca</strong>.</span><span class="notas-text-number">42.6ºC</span><span class="notas-text-date">07/07/1982</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Jerez</strong>.</span><span class="notas-text-number">45.1ºC</span><span class="notas-text-date">07/08/2003</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>León</strong>.</span><span class="notas-text-number">38.2ºC</span><span class="notas-text-date">13/08/1987</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Lleida</strong>.</span><span class="notas-text-number">43.4ºC</span><span class="notas-text-date">29/06/2019</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Logroño</strong>.</span><span class="notas-text-number">42.8ºC</span><span class="notas-text-date">07/07/1982</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Madrid</strong>.</span><span class="notas-text-number">40.7ºC</span><span class="notas-text-date">28/06/2019</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Málaga</strong>.</span><span class="notas-text-number">44.2ºC</span><span class="notas-text-date">18/07/1978</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Mallorca</strong>.</span><span class="notas-text-number">41.4ºC</span><span class="notas-text-date">25/06/2001</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Melilla</strong>.</span><span class="notas-text-number">41.8ºC</span><span class="notas-text-date">06/07/1994</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Murcia</strong>.</span><span class="notas-text-number">40.5ºC</span><span class="notas-text-date">12/07/1961</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Ourense</strong>.</span><span class="notas-text-number">42.6ºC</span><span class="notas-text-date">20/07/1990</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Oviedo</strong>.</span><span class="notas-text-number">37ºC</span><span class="notas-text-date">18/07/2016</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Palencia</strong>.</span><span class="notas-text-number">40ºC</span><span class="notas-text-date">28/06/2019</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Pamplona</strong>.</span><span class="notas-text-number">40ºC</span><span class="notas-text-date">18/08/2012</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Pontevedra</strong>.</span><span class="notas-text-number">40ºC</span><span class="notas-text-date">14/06/1981</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Reus</strong>.</span><span class="notas-text-number">39.8ºC</span><span class="notas-text-date">04/08/2018</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Salamanca</strong>.</span><span class="notas-text-number">41ºC</span><span class="notas-text-date">10/08/2012</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Santander</strong>.</span><span class="notas-text-number">37.6ºC</span><span class="notas-text-date">30/06/1968</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Santiago</strong>.</span><span class="notas-text-number">39.4ºC</span><span class="notas-text-date">20/07/1990</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Segovia</strong>.</span><span class="notas-text-number">39.2ºC</span><span class="notas-text-date">15/07/1967</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Sevilla</strong>.</span><span class="notas-text-number">46.6ºC</span><span class="notas-text-date">23/07/1995</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Soria</strong>.</span><span class="notas-text-number">38.5ºC</span><span class="notas-text-date">13/08/2021</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Tenerife</strong>.</span><span class="notas-text-number">41.4ºC</span><span class="notas-text-date">31/07/2009</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Toledo</strong>.</span><span class="notas-text-number">44.2ºC</span><span class="notas-text-date">13/08/2021</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Valencia</strong>.</span><span class="notas-text-number">43ºC</span><span class="notas-text-date">27/08/2010</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Valladolid</strong>.</span><span class="notas-text-number">39.4ºC</span><span class="notas-text-date">24/07/1995</span>',
    '<span class="notas-text-temp">Temperatura más alta registrada en <strong>Vitoria</strong>.</span><span class="notas-text-number">40.8ºC</span><span class="notas-text-date">10/08/2012</span>'
  ]

  const randomQuote = Math.floor(Math.random() * list.length)
  document.getElementById('notas-temp').innerHTML = list[randomQuote]
}

export default quotesTemp
