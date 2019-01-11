
# Vulturno

La evolución de las temperaturas media anual en 45 estaciones de la AEMET en España.

## Datos

Todos los datos provienen de [open data de la AEMET](https://opendata.aemet.es/centrodedescargas/inicio).

Para recolectar todos los datos he usado [Lurte](https://github.com/vulturno/lurte)

Los datos que he utilizado están disponibles en bruto [aquí](https://github.com/vulturno/data).

## Limpiando datos

Todos los scripts que he utilizado para limpiar y extraer datos están disponibles en la carpeta [scripts](https://github.com/vulturno/data/tree/master/scripts)

### Temperatura anual

Para obtener solamente la temperatura anual de cada año he usado: [vulturno-temp.sh](https://github.com/vulturno/data/blob/master/scripts/vulturno-temp.sh)

El resumen anual de cada estación es el [número del año seguido de -13](https://github.com/jorgeatgu/vulturno/blob/master/json/0076-total-anual.json#L240). Ahora nos quedamos solamente con la fecha y con tm_mes que corresponde a la temperatura media del año.
```
jq -c 'map(select(.fecha | contains("-13")) |  {"year": .fecha, "temp": .tm_mes} )' 1082-total-anual.json >> prueba.json
```

Ya no necesitamos el -13 así que lo eliminamos con sed.
```
sed -i 's/\-13//g' prueba.json
```

Por último lo convertimos a CSV
```
json2csv -i prueba.json -o prueba.csv
```



### Temperatura mínima

Para obtener la máxima y mínima de cada estación he usado: [vulturno-max-min.sh](https://github.com/vulturno/data/blob/master/scripts/vulturno-max-min.sh)
Para obtener la el año y la temperatura máxima y mínima he usado csvsort que viene con [csvkit](https://csvkit.readthedocs.io/en/1.0.3/).
Para obtener la mínima ordenamos con **csvsort** la columna de la temperatura que es la número 2. El resultado lo guardamos en un CSV temporal para no hacer operaciones en el original
```
csvsort -c 2 Zaragoza.csv > Zaragoza-temporal.csv
```

Ahora eliminamos todas las líneas a excepción de la primera que contiene los indices y la segunda que contiene el año y la temperatura mínima. El resultado final lo guardamos en Zaragoza-min.csv
```
sed '1,2!d' Zaragoza-temporal.csv > min/Zaragoza-min.csv &&
```

### Temperatura máxima

Volvemos a repetir la operación para obtener la máxima.

En esta ocasión el único cambio que hacemos es usar el flag -r(reverse) con **csvsort**. Así ordenamos la columna de las temperaturas en orden ascendente.

```
csvsort -c 2 -r Zaragoza.csv > Zaragoza-temporal.csv
```

Ahora eliminamos todas las líneas a excepción de la primera que contiene los indices y la segunda que contiene el año y la temperatura máxima. El resultado final lo guardamos en Zaragoza-max.csv
```
sed '1,2!d' Zaragoza-temporal.csv > min/Zaragoza-min.csv
```

Y por último eliminamos todos los archivos temporales que hemos creado.

```
find . -name '*-temp*' -delete
```

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
| Pamplona      | 9262          |  1954   | 2011    | 1972    |
| Donostia      | 1024E         |  1950   | 1997    | 1956    |
| Burgos        | 2331          |  1950   | 2014    | 1956    |
| Albacete      | 8175          |  1950   | 2014    | 1971    |
| Santander     | 1109          |  1954   | 2014    | 1962    |
| Castellón     | 8500A         |  1950   | 2014    | 1976    |
| Logroño       | 9170          |  1950   | 2011    | 1956    |
| Badajoz       | 4452          |  1955   | 2017    | 1956    |
| Huelva        | 4642E         |  1950   | 1961    | 1956    |
| Salamanca     | 2867          |  1950   | 1995    | 1956    |
| Lleida        | 9771C         |  1960   | 2014    | 1972    |
| Reus          | 0016A         |  1950   | 2015    | 1972    |
| León          | 2661          |  1950   | 2017    | 1956    |
| Jerez         | 5960          |  1950   | 2011    | 1956    |
| Jaen          | 5270          |  1950   |         |         |
| Ourense       | 1690A         |  1952   |
| Girona        | 0367          |  1950   | 2011    | 1980    |
| Lugo          | 1505          |  1951   | 2014    | 1956    |
| Santiago      | 1428          |  1950   | 1997    | 1956    |
| Caceres       | 3469A         |  1950   | 2017    | 1972    |
| Melilla       | 6000A         |  1971   | 1989    | 1972    |
| Ceuta(X)      | 5000A         |  1950   |         |         |
| Guadalajara   | 3168A         |  1950   |         |         |
| Toledo(?)     | 3260B         |  1950   | 2017    | 1956    |
| Pontevedra    | 1484C         |  1964   |
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

## Estaciones unificadas

Almería unificar 6325O(desde 1980) y 6297() - **Hecho**  
Avila unificar 2444(desde 1983) y 2444C **Hecho**  
Caceres unificar 3469A(desde 1983) y 3469 **Hecho**  
Castellón unificar 8500A y 8501. Falta la 8500A desde 1976 **Hecho**  
Ciudad Real unificar 4121(desde 1970) y 4121C **Hecho**  
Guadalajara no tiene datos suficientes unificar 3168C(desde 1985) y 3168A  
Huelva unificar 4642E(desde 1985) y 4605 **Hecho**  
Lleida unificar 9771C(desde 1985) y 9771 **Hecho**  
Segovia unificar 2465(desde 1989) y 2465A **Hecho**  
Toledo unificar 3260B y 3259 **Hecho**  
Ourense desde 1952 en la 1690B **Hecho**  
Sevilla desde 1950(error en los años 1988,1989) en la 5783 **Hecho**  
Malaga desde 1950(error en los años 1958 y 1959) en la 6155A **Hecho**  
