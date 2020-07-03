# Griddy Plugin for Homebridge

The purpose of this plugin is to make it possible to automate other things based on electricity prices for Griddy customers.

There are a few "devices" that get created. None of them accept inputs--think of them as read only.

## Griddy Price

Pretends to be a light sensor, and show the current c/kWh price **in lumens (lux)**

Will be offline if no data is available from Griddy's API

## Griddy High Price

Pretends to be a lightbulb. Turns on if the price is high and also uses its brightness to shows the current price as a % of the day's range

## Griddy Low Price

Pretends to be a switch. Turns on if the price is low.
