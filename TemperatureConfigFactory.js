/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="TemperatureConfig.js" />

function TemperatureConfigFactory() {
    var self = this;

    self.BuildCelsius = function () {
        var temperatureConfig = new TemperatureConfig();

        temperatureConfig.Id = ko.observable(1);
        temperatureConfig.Name = ko.observable('Celsius');
        temperatureConfig.Unit = ko.observable('°C');

        temperatureConfig.DefaultTargetTemperature(150);
        temperatureConfig.Test(false);
        temperatureConfig.DefaultTargetCoreTemperature(65);
        temperatureConfig.MaxTargetTemperature(260);
        temperatureConfig.MinTargetTemperature(60);
        temperatureConfig.MaxTargetCoreTemperature(90);
        temperatureConfig.MinTargetCoreTemperature(50);
        temperatureConfig.TemperatureIncrement(5);


        //Converts between fahrenheit to celsius
        //eg, 325°F to 150°C
        temperatureConfig.ConvertTemperatureFunction = function (fahrenheit) {
            var celsius = (fahrenheit - 32) * 5 / 9;

            Math.round(celsius); //Round this to 5?

            return celsius;
        };

        return temperatureConfig;
    };

    self.BuildFahrenheit = function () {
        var temperatureConfig = new TemperatureConfig();

        temperatureConfig.Id(2);
        temperatureConfig.Name('Fahrenheit');
        temperatureConfig.Unit('°F');

        temperatureConfig.DefaultTargetTemperature(150);
        temperatureConfig.DefaultTargetCoreTemperature(65);
        temperatureConfig.MaxTargetTemperature(260);
        temperatureConfig.MinTargetTemperature(60);
        temperatureConfig.MaxTargetCoreTemperature(90);
        temperatureConfig.MinTargetCoreTemperature(50);
        temperatureConfig.TemperatureIncrement(5);
        
        //Converts between celsius and fahrenheit
        //eg, 150°C to 325°F
        temperatureConfig.ConvertTemperatureFunction = function (celsius) {
            var fahrenheit = celsius * 9 / 5 + 32;

            Math.round(fahrenheit); //Round this to 10?

            return fahrenheit;
        };

        return temperatureConfig;
    };

    self.BuildAll = function() {
        return [ self.BuildCelsius(), self.BuildFahrenheit() ];
    };

    return self;
}
