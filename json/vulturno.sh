#!/bin/bash

<<comentario
Dependencias: jq - json2csv - sed(linux)
Vamos a quedarnos solamente con el resumen anual de cada año.
Y de ese resumen solamente con la temperatura media del año.
Recorremos todas las estaciones con un for sobre el array de station.
Con jq creamos un JSON solamente con la fecha y la temperatura.
Con sed eliminamos el -13 de la fecha.
Convertimos el json a csv.
Y por último eliminamos todos los archivos que hemos creado con el nombre limpio.
comentario

# Array con todos los indicativos de todas las estaciones de la AEMET
station=('1484' '1484C' '5270' '5000C' '1249X' '4410X' '0370B' '4121C' '3168C' '8501' '9771' '9381' '2444C' '3168A' '6297' '3469' '2401' '2465A' '3259' '9087' '5000A' '4605' '2465' '8368U' '4642E' '1505' '2444' '9771C' '9262' '3260B' '3469A' '8500A' '1690A' '1690B' '9263D' '0367' '8096' '5530E' '4121' '1249I' '6000A' '6325O' '8019' '5402' 'B278' '1109' '5960' '9898' '2614' '0076' '8175' '5514' 'C649I' '0016A' 'C447A' '2661' '6155A' '4452' '2030' '2539' '9170' '5783' '7031' '8416' '2331' '1428' '2867' '3195' '1387' '8025' '1082' '1024E')

# Recorremos el array stations
for (( i=0; i<${#station[@]}; ++i )); do
    jq -c 'map(select(.fecha | contains("-13")) |  {"year": .fecha, "temp": .tm_mes} )' ${station[$i]}-total-anual.json >> ${station[$i]}-limpio.json &&
    sed -i 's/\-13//g' ${station[$i]}-limpio.json &&
    json2csv -i ${station[$i]}-limpio.json -o csv/${station[$i]}.csv -q '' &&

    echo "${station[$i]}"

done &&

find . -name '*-limpio*' -delete
