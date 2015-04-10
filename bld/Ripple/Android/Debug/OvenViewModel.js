/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Timers.js" />
/// <reference path="StatusProperties.js" />
/// <reference path="UserInterface.js" />
/// <reference path="Subscriptions.js" />
/// <reference path="OvenManager.js" />
/// <reference path="TemperatureManagement.js" />
/// <reference path="SoundManagement.js" />
/// <reference path="TimerManagement.js" />
/// <reference path="OvenProgramManagement.js" />

function OvenViewModel(soundEnabled, blinkingEnabled) {
    var self = this;

    self.SoundEnabled = soundEnabled;
    self.BlinkingEnabled = blinkingEnabled;

    //Expand from external files
    Timers(self);
    StatusProperties(self);
    OvenManager(self);
    TemperatureManagement(self);
    SoundManagement(self);
    TimerManagement(self);
    OvenProgramManagement(self);

    UserInterface(self);
    Subscriptions(self);

    self.ToggleLight = function () {
        self.LightIsOn(!self.LightIsOn());
    }

    self.TurnOvenOn = function () {
        self.TopDisplayFunction(self.TargetTemperature);
        self.OvenIsOn(true);
    }

    self.TurnOvenOff = function () {
        //Turn everything off
        self.SetDefaults();
        self.TopDisplayFunction(null);
    }
    
    //Time Dilation - Start

    self.IncreaseTimeDilation = function () {
        self.SetTimeDilation(self.TimeDilation() * 2);
    };

    self.DecreaseTimeDilation = function () {
        self.SetTimeDilation(self.TimeDilation() / 2);
    };

    self.SetTimeDilation = function (newValue) {
        self.Log(newValue);
        if (newValue >= self.MaxTimeDilation) //Ensure that we do not go above our max target
        {
            self.TimeDilation(self.MaxTimeDilation);
            return;
        }
        else if (newValue <= self.MinTimeDilation) //Ensure that we do not go below min target
        {
            self.TimeDilation(self.MinTimeDilation);
            return;
        }

        self.Log(newValue);
        self.TimeDilation(newValue);
    };
    
    self.Log = function (entry) {


    };
    
    //Set defaults
    self.SetDefaults();

    self.DialTestClass = ko.observable('');

    self.MinusTest = function() {
        self.DialTestClass("dialLeft");
    };

    self.PlusTest = function () {
        self.DialTestClass("dialRight");
    };

    return self;
};