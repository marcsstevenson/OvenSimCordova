/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />

function OvenProgramStage(isManualModeStep) {
    var defaultTargetTemperature = 150; //Oven Temperature is set to 150°C (325°F)
    var defaultTargetCoreTemperature = 65; //Oven Temperature is set to 150°C (325°F) - TODO: Confirm

    var self = this;

    self.MaxTargetTemperature = 240; //+ to increase the temperature (Max. 260°C / 500°F)
    self.MinTargetTemperature = 80; //- to decrease the temperature (Min. 60°C / 140°F)

    self.MaxTargetCoreTemperature = 90; //+ to increase temperature (Max. 90°C / 194°F)
    self.MinTargetCoreTemperature = 50; //- to decrease temperature (Min. 50°C / 122°F)
    self.DefaultTimerValue = 0;

    self.Name = ko.observable();
    self.Index = ko.observable();
    self.IsManualModeStep = ko.observable(isManualModeStep);

    self.IsFanLow = ko.observable();
    self.TargetTemperature = ko.observable(0);
    self.TargetCoreTemperature = ko.observable(0);
    self.TargetCoreTemperatureSet = ko.observable(false);
    self.MoistureMode = ko.observable(); //1-5

    self.TimerStartValue = ko.observable(); //CP (-2), InF (-1), --- (0), 1-180
    self.TimerDirectionUp = ko.observable(true);
    self.TimerCurrentValue = ko.observable(0); //moment.duration

    self.AlarmOn = ko.observable(false);

    self.EditingIndex = ko.observable(-1);

    //Persistent status values (these remain after power on/off and are therefore not reset by default)
    self.CurrentMoistureMode = ko.observable(0); //0-5 are the valid values

    self.IsOnValue = ko.observable(false);
    self.IsValid = ko.computed(function () {
        //Eg, a step is not valid if the TimerStartValue is ---
        return self.TimerStartValue() != 0;

        //TODO Validate core probe settings
    });
    //The program step can be turned on if it is valid and if the user has set it to on
    self.IsOn = ko.computed(function () {
        return self.IsOnValue() && self.IsValid();
    });

    self.SetDefaults = function () {
        self.IsFanLow(false);
        self.TargetTemperature(defaultTargetTemperature);
        self.TargetCoreTemperature(defaultTargetCoreTemperature);

        if (self.IsManualModeStep())
            self.TimerStartValue(self.DefaultTimerValue);
        else
            self.TimerStartValue(0);

        self.TimerCurrentValue(moment.duration(0, 'minutes'));
        self.TimerDirectionUp(true);
    };

    //*** Fan
    self.ToggleFanValue = function () {
        self.IsFanLow(!self.IsFanLow());
    };

    self.FanSpeed = ko.observable(); //1 is high, 0 is low

    //*** Temperature Setting - Start

    self.SetTemperature = function (newValue) {
        if (self.OvenIsOn() && newValue >= self.TargetTemperature()) //Ensure that we do not go above our target
        {
            self.ActualTemperature(self.TargetTemperature());

            return;
        }
        else if (!self.OvenIsOn() && newValue <= self.StartTemperature) //Ensure that we do not go below ambient
        {
            self.ClearTimer(); //We may as well turn off the timer
            self.ActualTemperature(self.StartTemperature);

            return;
        }

        self.ActualTemperature(newValue);
    };

    self.IncreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TargetTemperature() + 10);
    };

    self.DecreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TargetTemperature() - 10);
    };

    self.SetTargetTemperature = function (newValue) {
        if (newValue >= self.MaxTargetTemperature) //Ensure that we do not go above our max target
        {
            self.TargetTemperature(self.MaxTargetTemperature);
            return;
        }
        else if (newValue <= self.MinTargetTemperature) //Ensure that we do not go below min target
        {
            self.TargetTemperature(self.MinTargetTemperature);
            return;
        }

        self.TargetTemperature(newValue);
    };

    //*** Temperature Setting - End

    //*** Core Temperature SEtting - Start

    self.DecreaseTargetCoreTemperature = function () {
        self.SetTargetCoreTemperature(self.TargetCoreTemperature() - 1);
        //self.IsHeating(true);
    };

    self.IncreaseTargetCoreTemperature = function () {
        self.SetTargetCoreTemperature(self.TargetCoreTemperature() + 1);
        //self.IsHeating(true);
    };

    self.SetTargetCoreTemperature = function (newValue) {
        self.TargetCoreTemperatureSet(true); //The value has been changed
        
        if (newValue >= self.MaxTargetCoreTemperature) //Ensure that we do not go above our max target
        {
            self.TargetCoreTemperature(self.MaxTargetCoreTemperature);
            return;
        }
        else if (newValue <= self.MinTargetCoreTemperature) //Ensure that we do not go below min target
        {
            self.TargetCoreTemperature(self.MinTargetCoreTemperature);
            return;
        }

        self.TargetCoreTemperature(newValue);
    };

    //*** Core Temperature SEtting - End

    //*** Timer Section - Start

    self.IncreaseTimer = function () {
        self.IsOnValue(true); //Always set to on when this value changes

        if (self.TimerStartValue() >= 180) {
            self.TimerStartValue(self.IsManualModeStep() ? -1 : -2);

            return; //We were at the max
        }

        self.TimerStartValue(self.TimerStartValue() + 1);
    };

    self.DecreaseTimer = function () {
        self.IsOnValue(true); //Always set to on when this value changes

        if (self.TimerStartValue() === (self.IsManualModeStep() ? -1 : -2)) {
            self.TimerStartValue(180);
            return; //We were at the min
        }

        self.TimerStartValue(self.TimerStartValue() - 1);
    };

    //*** Timer Section - End

    //*** Moisture mode - start

    self.MoistureModeDown = function () {
        self.CurrentMoistureMode(self.CurrentMoistureMode() === 0 ? 5 : self.CurrentMoistureMode() - 1);
    };

    self.MoistureModeUp = function () {
        self.CurrentMoistureMode(self.CurrentMoistureMode() === 5 ? 0 : self.CurrentMoistureMode() + 1);
    };

    //*** Moisture mode - end

    //*** Editing Values
    self.SetToNoEditingValue = function () {
        self.EditingIndex(-1); //Fin
    };

    self.NextEditingValue = function () {
        // -1: None
        // 0: Target Temp
        // 1: Timer
        // 2: Target Core Temperature (if timer is CP(-2))
        // 3: Steam
        // 4: Fan
        // 5: Alarm
        if (self.EditingIndex() >= 5) {
            self.EditingIndex(-1); //Fin
            return;
        }

        if (self.EditingIndex() === 1) {
            if (self.TimerStartValue() === -2)
                self.EditingIndex(2); //Target Core Temperature
            else
                self.EditingIndex(3); //Steam
        } else 
            self.EditingIndex(self.EditingIndex() + 1); //Just add 1
            
    };

    self.SetDefaults();

    return self;
}