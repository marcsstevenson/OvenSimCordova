/// <reference path="Lib/knockout-3.1.0.js" />

function TemperatureConfig() {
    var self = this;

    self.Id = ko.observable();
    self.Name = ko.observable();
    self.Unit = ko.observable();

    self.DefaultTargetTemperature = ko.observable(1);
    self.DefaultTargetCoreTemperature = ko.observable();
    self.MaxTargetTemperature = ko.observable();
    self.MinTargetTemperature = ko.observable();
    self.MaxTargetCoreTemperature = ko.observable();
    self.MinTargetCoreTemperature = ko.observable();
    self.TemperatureIncrement = ko.observable();

    //Converts between celsius and fahrenheit
    //eg, 150°C to 325°F
    self.ConvertTemperatureFunction = null;

    return self;
}