#!/bin/bash

cities=('Zaragoza' 'Barcelona')

# Recorremos el array de ciudades
for (( i=0; i<${#cities[@]}; ++i )); do
    csvsort -c 2 ${cities[$i]}.csv >  ${cities[$i]}-temp.csv &&
    sed '2!d' ${cities[$i]}-temp.csv > ${cities[$i]}-min.csv

done
