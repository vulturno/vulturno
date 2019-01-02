# Vulturno

La evolución de las temperaturas media anual en 45 estaciones de la AEMET en España.


## Lista de estaciones 

| Ciudad        | Número        | Año     | Máxima  | Mínima  |
| ------------- |:-------------:| -------:| -------:| -------:|
| A coruña      | 1387          |  1950   | 1997    | 1956    |
| Valencia      | 8416          |  1950   | 2014    | 1956    |
| Zaragoza      | 9434          |  1950   | 2014    | 1956    |
| Madrid(Retiro)| 3195          |  1950   | 2017    | 1956    |
| Barcelona     | 0076          |  1950   | 2017    | 1972    |
| Sevilla       | 5783          |  1951   |         |         |
| Malaga        | 6155A         |  1950   |         |         |
| Murcia        | 7031          |  1950   | 2014    | 1956    |
| Palma         | B278          |  1951   | 2014    | 1956    |
| Gran Canaria  | C649I         |  1951   | 1998    | 1954    |
| Bilbao        | 1082          |  1950   | 2011    | 1956    |
| Alicante      | 8025          |  1950   | 1955    | 1972    |
| Cordoba       | 5402          |  1960   | 2014    | 1956    |
| Valladolid    | 2539          |  1950   | 2011    | 1956    |
| Vitoria(X)    | 9087          |  1950   |
| Granada       | 5514          |  1950   | 2017    | 1971    |
| Oviedo        | 1249I         |  1972   | 2014    | 1956    |
| Tenerife      | C447A         |  1950   | 2017    | 1950    |
| Pamplona      | 9771          |  1954   | 2011    | 1972    |
| Donostia      | 1024E         |  1950   | 1997    | 1956    |
| Burgos        | 2331          |  1950   | 2014    | 1956    |
| Albacete      | 8175          |  1950   | 2014    | 1971    |
| Santander     | 1109          |  1954   | 2014    | 1962    |
| Castellón     | 8501          |  1950   | 2014    | 1976    |
| Logroño       | 9170          |  1950   | 2011    | 1956    |
| Badajoz       | 4452          |  1955   | 2017    | 1956    |
| Huelva        | 4642E         |  1950   | 1961    | 1956    |
| Salamanca     | 2867          |  1950   | 1995    | 1956    |
| Lleida        | 9771C         |  1960   | 2014    | 1972    |
| Reus          | 0016A         |  1950   | 2015    | 1972    |
| León          | 2661          |  1950   | 2017    | 1956    |
| Jerez         | 5960          |  1950   | 2011    | 1956    |
| Jaen          | 5270          |  1950   |         |         |
| Ourense       | 1690B         |  1952   |
| Girona        | 0370B         |  1950   | 2011    | 1980    |
| Lugo          | 1505          |  1951   | 2014    | 1956    |
| Santiago      | 1428          |  1950   | 1997    | 1956    |
| Caceres       | 3469A         |  1950   | 2017    | 1972    |
| Melilla       | 6000A         |  1971   | 1989    | 1972    |
| Ceuta(X)      | 5000A         |  1950   |         |         |
| Guadalajara   | 3168A         |  1950   |         |         |
| Toledo(?)     | 3260B         |  1950   | 2017    | 1956    |
| Pontevedra    | 1484          |  1964   |
| Palencia      | 2401          |  1950   | 1981    | 1956    |
| Ciudad Real   | 4121          |  1950   | 2017    | 1972    |
| Zamora        | 2614          |  1956   |         |         |
| Merida        | 4410X         |  1990   |  
| Avila         | 2444          |  1953   | 2017    | 1972    |
| Cuenca        | 8096          |  1951   | 2017    | 1956    |
| Huesca        | 9898          |  1950   | 2014    | 1956    |
| Segovia       | 2465          |  1950   | 2017    | 1972    |
| Soria         | 2030          |  1950   | 2017    | 1956    |
| Teruel(X)     | 9381          |  1950   |
| Almería(X)    | 6325O         |  1950   | 2015    | 1956    |


## Datos

Todos los datos provienen de [open data de la AEMET](https://opendata.aemet.es/centrodedescargas/inicio).

## Limpiando datos

Todos los scripts que he utilizado para limpiar y extraer datos están disponibles en la carpeta ```scripts```

Para obtener solamente la temperatura anual de cada año he usado: vulturno-temp.sh

Seleccionamos el resumen anual del año, este es el número del año acabado en -13. Ahora nos quedamos solamente con la fecha y con tm_mes que corresponde a la temperatura media del año.
```
jq -c 'map(select(.fecha | contains("-13")) |  {"year": .fecha, "temp": .tm_mes} )' 1082-total-anual.json >> prueba.json
```

Eliminamos de la fecha el -13
```
sed -i 's/\-13//g' prueba.json
```

Lo convertimos a CSV
```
json2csv -i prueba.json -o prueba.csv
```


Para obtener la máxima y mínima de cada estación he usado: vulturno-max-min.sh

## Estaciones unificadas

Almería unificar 6325O(desde 1980) y 6297() - **Hecho**
Avila unificar 2444(desde 1983) y 2444C **Hecho**
Caceres unificar 3469A(desde 1983) y 3469 **Hecho**
Castellón unificar 8500A y 8501. Falta la 8500A desde 1976 **Hecho**
Ciudad Real unificar 4121(desde 1970) y 4121C **Hecho**
Guadalajara no tiene datos suficientes unificar 3168C(desde 1985) y 3168A
Huelva unificar 4642E(desde 1985) y 4605 **Hecho**
Jaen unificar 5270(desde 1985) y 5270B **no tiene datos suficientes**
Lleida unificar 9771C(desde 1985) y 9771 **Hecho**
Merida no tiene datos suficientes
Segovia unificar 2465(desde 1989) y 2465A **Hecho**
Toledo unificar 3260B y 3259 **Hecho**
Vitoria no tiene datos suficientes.
Lugo consultar otras estaciones, no tiene datos suficientes.
Palencia consultar otras estaciones, no tiene datos suficientes.
Pontevedra desde 1964 en la 1484.
Ourense desde 1952 en la 1690B **Hecho**
Sevilla desde 1950(error en los años 1988,1989) en la 5783 **Hecho**
Malaga desde 1950(error en los años 1958 y 1959) en la 6155A **Hecho**
