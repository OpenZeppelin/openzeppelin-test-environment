#!/bin/bash

for dir in */
do
  ./run-test ${dir%*/}
done
