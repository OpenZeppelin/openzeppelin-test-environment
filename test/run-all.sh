#!/bin/bash

for dir in */
do
  ./run-test.sh ${dir%*/}
done
