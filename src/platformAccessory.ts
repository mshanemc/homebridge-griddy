import {
    Service,
    PlatformAccessory,
    CharacteristicValue,
    CharacteristicSetCallback,
    CharacteristicGetCallback
} from 'homebridge';
import { GriddyResponse, getData } from './griddy-api';
import { ExampleHomebridgePlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ExamplePlatformAccessory {
    private priceService: Service;
    private intensityService: Service;
    private latestGriddyData: GriddyResponse | undefined = undefined;
    /**
     * These are just used to create a working example
     * You should implement your own code to track the state of your accessory
     */

    constructor(
        private readonly platform: ExampleHomebridgePlatform,
        private readonly accessory: PlatformAccessory
    ) {
        // set accessory information
        this.accessory
            .getService(this.platform.Service.AccessoryInformation)!
            .setCharacteristic(
                this.platform.Characteristic.Manufacturer,
                'Default-Manufacturer'
            )
            .setCharacteristic(
                this.platform.Characteristic.Model,
                'Default-Model'
            )
            .setCharacteristic(
                this.platform.Characteristic.SerialNumber,
                'Default-Serial'
            );

        // we use a fake light sensor to represent the real-time price in cents
        this.priceService =
            this.accessory.getService(this.platform.Service.LightSensor) ||
            this.accessory.addService(this.platform.Service.LightSensor);
        this.intensityService =
            this.accessory.getService(this.platform.Service.Lightbulb) ||
            this.accessory.addService(this.platform.Service.Lightbulb);

        // set the service name, this is what is displayed as the default name on the Home app
        // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
        this.priceService.setCharacteristic(
            this.platform.Characteristic.Name,
            // accessory.context.device.priceServiceName
            'Griddy Price'
        );

        this.intensityService.setCharacteristic(
            this.platform.Characteristic.Name,
            // accessory.context.device.intensityServiceName
            'Griddy High Price'
        );

        // each service must implement at-minimum the "required characteristics" for the given service type
        // see https://developers.homebridge.io/#/service/Lightbulb

        // register handlers for the On/Off Characteristic
        this.priceService
            .getCharacteristic(
                this.platform.Characteristic.CurrentAmbientLightLevel
            )
            .on('get', this.getLevel.bind(this));

        // // register handlers for the Brightness Characteristic
        this.priceService
            .getCharacteristic(this.platform.Characteristic.StatusActive)
            .on('get', this.getStatus.bind(this)); // SET - bind to the 'setBrightness` method below

        this.intensityService
            .getCharacteristic(this.platform.Characteristic.Brightness)
            .on('get', this.getIntensity.bind(this));

        this.intensityService
            .getCharacteristic(this.platform.Characteristic.On)
            .on('get', this.getIsHigh.bind(this));

        this.update();
    }

    async update() {
        console.log('running update');
        this.latestGriddyData = await getData();
        console.log(
            `update finished. Next in ${this.latestGriddyData.seconds_until_refresh} seconds`
        );
        console.log(this.latestGriddyData.now);
        console.log(
            `intensity is ${this.calculateIntensity(this.latestGriddyData)}`
        );
        if (this.latestGriddyData) {
            this.priceService.updateCharacteristic(
                this.platform.Characteristic.StatusActive,
                true
            );
            this.priceService.updateCharacteristic(
                this.platform.Characteristic.CurrentAmbientLightLevel,
                Math.round(this.latestGriddyData.now.price_ckwh * 1000) / 1000
            );
            // TODO: read the price vs. the high/low and set the level
            this.intensityService.updateCharacteristic(
                this.platform.Characteristic.Brightness,
                this.calculateIntensity(this.latestGriddyData)
            );
            setTimeout(
                async () => this.update(),
                this.latestGriddyData.seconds_until_refresh * 1000
            );
        } else {
            this.priceService.updateCharacteristic(
                this.platform.Characteristic.StatusActive,
                false
            );
            setTimeout(async () => this.update(), 10000);
        }
    }

    /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   * 
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   * 
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
    getStatus(callback: CharacteristicGetCallback) {
        // you must call the callback function
        // the first argument should be null if there were no errors
        // the second argument should be the value to return
        callback(null, this.latestGriddyData ? true : false);
    }

    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, changing the Brightness
     */
    getLevel(callback: CharacteristicSetCallback) {
        // you must call the callback function
        if (this.latestGriddyData) {
            callback(
                null,
                Math.round(this.latestGriddyData.now.price_ckwh * 1000) / 1000
            );
        } else {
            callback(Error('No information available'));
        }
    }

    getIntensity(callback: CharacteristicSetCallback) {
        // you must call the callback function
        if (this.latestGriddyData) {
            callback(null, this.calculateIntensity(this.latestGriddyData));
        } else {
            callback(Error('No information available'));
        }
    }

    getIsHigh(callback: CharacteristicSetCallback) {
        if (this.latestGriddyData) {
            callback(
                null,
                this.latestGriddyData.now.price_ckwh > 2 &&
                    this.calculateIntensity(this.latestGriddyData) > 60
            );
        } else {
            callback(Error('No information available'));
        }
    }

    calculateIntensity(data: GriddyResponse) {
        return (
            ((data.now.price_ckwh - data.now.low_ckwh) /
                (data.now.high_ckwh - data.now.low_ckwh)) *
            100
        );
    }
}
