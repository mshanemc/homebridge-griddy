# Griddy Plugin for Homebridge

The purpose of this plugin is to make it possible to automate other things based on electricity prices for Griddy customers.

There are a few "devices" that get created. None of them accept inputs--think of them as read only.

## Griddy Price

Pretends to be a light sensor, and show the current c/kWh price **in lumens (lux)**

Will be offline if no data is available from Griddy's API

## Griddy High Price

Pretends to be a lightbulb. Turns on if the price is high and also uses its brightness to shows the current price as a % of the day's range (intensity)

## Griddy Low Price

Pretends to be a switch. Turns on if the price is low.

## How do I define high/low or pick my load zone?

See the config.schema.json (which Homebridge surfaces with a nice ui) for explanation of the options and what they mean.

## What can I do with that?

Here's what devices look like
![Device Example](https://raw.githubusercontent.com/mshanemc/homebridge-griddy/master/assets/example%20devices.png)

I use them to trigger automations when the price is very low or very high
![Automations](https://raw.githubusercontent.com/mshanemc/homebridge-griddy/master/assets/example%20automations.png)

This automation will turn off some lights and set three Nests to eco mode when the price is high
![Automation Detail](https://raw.githubusercontent.com/mshanemc/homebridge-griddy/master/assets/example%20automation%20details.png)

So now my thermostats are responding to market prices and forecast in real-time.
![DynamicThermostats](https://raw.githubusercontent.com/mshanemc/homebridge-griddy/master/assets/dynamicThermostats.png)
