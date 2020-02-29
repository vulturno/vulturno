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

export default quotes;
