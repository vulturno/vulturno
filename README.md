# vulturno
La evolución de las temperaturas máximas en España


## Lista de estaciones 

| Ciudad        | Número        | Año     | 
| ------------- |:-------------:| -------:|
| A coruña      | 1387          |  1950   |
| Valencia      | 8416          |  1950   |
| Madrid(Retiro)| 3195          |  1950   |
| Barcelona     | 0076          |  1950   |
| Sevilla       | 5783          |  1951   |
| Malaga        | 6155A         |  1950   |
| Murcia        | 7031          |  1950   |
| Palma         | B278          |  1951   |
| Gran Canaria  | C649I         |  1951   |
| Bilbao        | 1082          |  1950   |
| Alicante      | 8025          |  1950   |
| Cordoba       | 5402          |  1960   |
| Valladolid    | 2539          |  1950   |
| Vitoria(X)    | 9087          |  1950   |
| Granada       | 5514          |  1950   |
| Oviedo        | 1249I         |  1972   |
| Tenerife      | C447A         |  1950   |
| Pamplona      | 9771          |  1954   |
| Donostia      | 1024E         |  1950   |
| Burgos        | 2331          |  1950   |
| Albacete      | 8175          |  1950   |
| Santander     | 1109          |  1954   |
| Castellón     | 8501          |  1950   |
| Logroño       | 9170          |  1950   |
| Badajoz       | 4452          |  1955   |
| Huelva        | 4605          |  1950   |
| Salamanca     | 2867          |  1950   |
| Lleida        | 9771          |  1960   |
| Reus          | 0016A         |  1950   |
| León          | 2661          |  1950   |
| Jerez         | 5960          |  1950   |
| Jaen          | 5270          |  1950   |
| Ourense       | 1690B         |  1952   |
| Girona        | 0370B         |  1950   |
| Lugo          | 1505          |  1951   |
| Santiago      | 1428          |  1950   |
| Caceres       | 3469          |  1950   |
| Melilla       | 6000A         |  1971   |
| Ceuta(X)      | 5000A         |  1950   |
| Guadalajara   | 3168A         |  1950   |
| Toledo(?)     | 3259          |  1950   |
| Pontevedra    | 1484          |  1964   |
| Palencia      | 2401          |  1950   |
| Ciudad Real   | 4121C         |  1950   |
| Zamora        | 2614          |  1956   |
| Merida        | 4410X         |  1990   |
| Avila         | 2444C         |  1953   |
| Cuenca        | 8096          |  1951   |
| Huesca        | 9898          |  1950   |
| Segovia       | 2465A         |  1950   |
| Soria         | 2030          |  1950   |
| Teruel(X)     | 9381          |  1950   |
| Almería(X)    | 6297          |  1950   |


## Limpiando datos

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


(?):
Toledo contiene la información de dos estaciones, la 3259 que contiene datos desde 1950 hasta 1981. Y la 3260B que contiene datos desde 1982 hasta 2017

Fuera de la lista:

Ceuta, la estación 5000A tiene datos desde 1950 hasta 1986, la 5000C desde 2009.


## Lista de ciudades con estaciones unificadas

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
Lugo consultar otras estaciones.
