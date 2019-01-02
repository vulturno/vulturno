#!/bin/bash

<<comentario
Dependencias: csvkit - sed(linux)
Un pequeño script para obtener la el año y la temperatura máxima y mínima.
Ordenamos con CSVSORT la columna de la temperatura que es la número 2.
Lo guardamos en un csv temporal.
Ahora eliminamos todas las líneas a excepción de la primera y la segunda.
Volvemos a repetir la operación para obtener la máxima.
El único cambio que hacemos es usar el flag -r(reverse) con CSVSORT.
Guardamos todos los archivos en su respectiva carpeta.
Eliminamos todos los temporales
comentario

cities=('Albacete' 'Alicante' 'Almeria' 'Avila' 'Badajoz' 'Barcelona' 'Bilbao' 'Burgos' 'Caceres' 'Castellon' 'Ciudad-Real' 'Cordoba' 'Coruña' 'Cuenca' 'Donostia' 'Girona' 'Granada' 'GranCanaria' 'Huelva' 'Huesca' 'Jerez' 'Leon' 'Lleida' 'Logroño' 'Madrid' 'Malaga' 'Melilla' 'Murcia' 'Ourense' 'Oviedo' 'Palma' 'Pamplona' 'Pontevedra' 'Reus' 'Salamanca' 'Santander' 'Santiago' 'Segovia' 'Sevilla' 'Soria' 'Tenerife' 'Toledo' 'Valencia' 'Valladolid' 'Zaragoza')

# Recorremos el array de ciudades
for (( i=0; i<${#cities[@]}; ++i )); do
    # Ordenamos de menor a mayor la columna de temperatura
    csvsort -c 2 ${cities[$i]}.csv >  ${cities[$i]}-temp.csv &&
    # Eliminamos todas las líneas excepto la primera y la segunda
    sed '1,2!d' ${cities[$i]}-temp.csv > min/${cities[$i]}-min.csv &&
    # Ahora ordenamos en orden ascendente
    csvsort -c 2 -r ${cities[$i]}.csv >  ${cities[$i]}-temp-max.csv &&
    sed '1,2!d' ${cities[$i]}-temp-max.csv > max/${cities[$i]}-max.csv
done

find . -name '*-temp*' -delete
