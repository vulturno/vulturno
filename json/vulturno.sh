#!/bin/bash

<<comentario
Vamos a quedarnos solamente con el resumen anual de cada año.
Y de ese resumen solamente con la temperatura media del año.
Recorremos todas las estaciones con un for sobre el array de station.
Con jq  creamos un JSON solamente con la fecha y la temperatura.
Con sed eliminamos el -13 de la fecha.
Y por último convertimos el json a csv
comentario

# Array con todos los indicativos de todas las estaciones de la AEMET
station=('1387' '8416' '5783' '6155A' '7031' 'B278' 'C649I' '1082' '8025' '5402' '2539' '9087' '5514' '1249I' 'C447A' '9262' '1024E' '2331' '8175' '1109' '8501' '9170' '4452' '4605' '2867' '9771' '0016A' '2661' '5960' '5270' '1690B' '0370B' '1505' '1428' '3469' '6000A' '5000A' '3168A' '3259' '1484' '2401' '4121C' '2614' '4410X' '2444C' '8096' '9898' '2465A' '2030' '9381' '6297')

# Recorremos el array de numeros
for (( i=0; i<${#station[@]}; ++i )); do
    jq -c 'map(select(.fecha | contains("-13")) |  {"year": .fecha, "temp": .tm_mes} )' ${station[$i]}-total-anual.json >> ${station[$i]}-limpio.json &&
    sed -i 's/\-13//g' ${station[$i]}-limpio.json &&
    json2csv -i ${station[$i]}-limpio.json -o csv/${station[$i]}.csv -q ''
done
