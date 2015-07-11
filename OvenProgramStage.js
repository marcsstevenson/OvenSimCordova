/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />

function OvenProgramStage(isManualModeStep, temperatureConfig) {
    var self = this;

    self.OvenProgram = ko.observable();
    self.TargetTemperature = ko.observable(0);
    self.TemperatureConfig = ko.observable(temperatureConfig);
    
    self.TargetCoreTemperature = ko.observable(0);
    self.TargetCoreTemperatureSet = ko.observable(false);
    
    self.DefaultTimerValue = 0;

    self.Name = ko.observable();
    self.Index = ko.observable();
    self.IsManualModeStep = ko.observable(isManualModeStep);

    self.IsFanLow = ko.observable();
    self.MoistureMode = ko.observable(); //1-5

    self.TimerStartValue = ko.observable(); //CP (-2), InF (-1), --- (0), 1-180
    //self.TimerDirectionUp = ko.observable(true);
    self.TimerCurrentValue = ko.observable(0); //moment.duration

    //self.TimerStartValue.subscribe(function () {
    //    var duration = moment.duration(self.TimerStartValue(), 'minutes');
    //    self.TimerCurrentValue(duration);

    //    console.log(self.ConvertDurtaionToDisplay(duration));
    //});

    //Delete this eventually because its a copy paste for testing
    self.ConvertDurtaionToDisplay = function (duration) {
        if (duration.minutes() > 10) { return duration.minutes(); }
        
        return duration.minutes() + ':' + (duration.seconds() < 10 ? '0' : '') + duration.seconds();
    };

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
        //console.log(self.TemperatureConfig().DefaultTargetTemperature());
        self.TargetTemperature(self.TemperatureConfig().DefaultTargetTemperature());
        self.TargetCoreTemperature(self.TemperatureConfig().DefaultTargetCoreTemperature());

        if (self.IsManualModeStep())
            self.TimerStartValue(self.DefaultTimerValue);
        else
            self.TimerStartValue(0);

        self.TimerCurrentValue(moment.duration(0, 'minutes'));
        //self.TimerDirectionUp(true);
    };

    //*** Fan - Start
    self.ToggleFanValue = function () {
        self.IsFanLow(!self.IsFanLow());
    };

    self.FanSpeed = ko.observable(); //1 is high, 0 is low

    //*** Fan - End

    //*** Temperature Setting - Start

    self.IncreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TargetTemperature() + self.TemperatureConfig().TemperatureIncrement());
    };

    self.DecreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TargetTemperature() - self.TemperatureConfig().TemperatureIncrement());
    };

    self.SetTargetTemperature = function (newValue) {
        if (newValue >= self.TemperatureConfig().MaxTargetTemperature()) //Ensure that we do not go above our max target
        {
            self.TargetTemperature(self.TemperatureConfig().MaxTargetTemperature());
            return;
        }
        else if (newValue <= self.TemperatureConfig().MinTargetTemperature()) //Ensure that we do not go below min target
        {
            self.TargetTemperature(self.TemperatureConfig().MinTargetTemperature());
            return;
        }

        self.TargetTemperature(newValue);
    };

    //*** Temperature Setting - End

    //*** Core Temperature Setting - Start

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
        
        if (newValue >= self.TemperatureConfig().MaxTargetCoreTemperature()) //Ensure that we do not go above our max target
        {
            self.TargetCoreTemperature(self.TemperatureConfig().MaxTargetCoreTemperature());
            return;
        }
        else if (newValue <= self.TemperatureConfig().MinTargetCoreTemperature()) //Ensure that we do not go below min target
        {
            self.TargetCoreTemperature(self.TemperatureConfig().MinTargetCoreTemperature());
            return;
        }

        self.TargetCoreTemperature(newValue);
    };

    //*** Core Temperature Setting - End

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

        if (self.TimerStartValue() === (self.IsManualModeStep() ? -1 : -2)) { //(-2 = CP, -1 = InF)
            self.TimerStartValue(180);
            return; //We were at the min
        }

        self.TimerStartValue(self.TimerStartValue() - 1);
    };

    self.TimerIsSetToCoreProbe = ko.computed(function() {
        return self.TimerStartValue() === -2;
    });

    self.TimerIsSetToInfinite = ko.computed(function () {
        return self.TimerStartValue() === -1;
    });

    //*** Timer Section - End

    //*** Moisture mode - start

    self.MoistureModeDown = function () {
        //self.CurrentMoistureMode(self.CurrentMoistureMode() === 0 ? 5 : self.CurrentMoistureMode() - 1);
        //Change the moisture mode to no longer be circular
        self.CurrentMoistureMode(self.CurrentMoistureMode() === 0 ? 0 : self.CurrentMoistureMode() - 1);
    };

    self.MoistureModeUp = function () {
        //self.CurrentMoistureMode(self.CurrentMoistureMode() === 5 ? 0 : self.CurrentMoistureMode() + 1);
        //Change the moisture mode to no longer be circular
        self.CurrentMoistureMode(self.CurrentMoistureMode() === 5 ? 5 : self.CurrentMoistureMode() + 1);
    };

    self.MoistureIsAuto = ko.computed(function () {
        //0 is Manual
        //1-5 are auto-shots
        return self.CurrentMoistureMode() > 0;
    });

    self.MoistureIsManual = ko.computed(function () {
        //0 is Manual
        //1-5 are auto-shots
        return self.CurrentMoistureMode() === 0;
    });

    //*** Moisture mode - end

    //*** Editing Values - start

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

    self.SetTemperatureConfig = function (temperatureConfig) {
        var hadTemperatureConfig = self.TemperatureConfig();

        self.TemperatureConfig(temperatureConfig);

        if (hadTemperatureConfig) {
            //Perform conversions
        }
    };

    //*** Editing Values - end

    //*** Running - start

    //Returns true if timer is complete
    self.SetTimerTimerNextValue = function (timerDirectionUp) {
        var timerCurrentValue = self.TimerCurrentValue();

        var delta = moment.duration(1, 'seconds');

        //If timing up - add a second, if timing down - remove a second
        if (timerDirectionUp) {
            //Only add if we're before the minute limit
            if (timerCurrentValue.asMinutes() < 999) {
                timerCurrentValue.add(delta);
            } else {
                return false;
            }
        } else {

            if (timerCurrentValue.asSeconds() > 0) {
                timerCurrentValue.subtract(delta);
            } else {
                return true;
            }
        }

        self.TimerCurrentValue(timerCurrentValue);

        return false;
    };

    self.TimerDirectionUp = ko.computed(function () {
        return self.TimerStartValue() <= -1;
    });

    self.PrepareToRun = function () {
        var duration;

        if (self.TimerStartValue() <= -1) {
            //Count down
            //self.TimerDirectionUp(true); //Up

            //Set the duration to run
            duration = moment.duration(0, 'minutes');
        } else {
            //Count up
            //self.TimerDirectionUp(false); //Down

            //Set the duration to run
            duration = moment.duration(self.TimerStartValue(), 'minutes');
        }
        self.TimerCurrentValue(duration);
    };

    //*** Running - end

    self.SetDefaults();

    return self;
}