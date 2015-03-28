/// <reference path="Lib/knockout-3.1.0.js" />

function UserInterface(self) {
    //Steam
    self.SteamButtonDown = function () {
        if (!self.OvenIsOn()) return;

        self.SteamDown();
    };

    self.SteamButtonUp = function () {
        if (!self.OvenIsOn()) return;

        self.SteamUp();
    };

    self.LightOn_Steam = ko.computed(function () {
        if (!self.OvenIsOn()) return false; //The oven is off

        if (self.SteamButtonIsBlinking() && !self.MasterBlinkOn())
            return false; //The blink is off

        return self.MoistureModeOn() || self.DisplayingMoistureSetup() || self.SteamShooting();
    });

    //Program
    self.ProgramButtonUp = function () {
        if (!self.OvenIsOn()) return;

        self.ProgramUp();
    };

    self.ProgramButtonDown = function () {
        if (!self.OvenIsOn()) return;

        self.ProgramDown();
    };

    self.LightOn_Program = ko.computed(function () {
        if (!self.OvenIsOn()) return false; //The oven is off

        if (self.ProgramButtonIsBlinking() && !self.MasterBlinkOn())
            return false; //The blink is off

        if (self.ProgrammingArea() >= 1)
            return true;
        else
            return false;
    });

    //Temp
    self.TempButtonUp = function () {
        if (!self.OvenIsOn() || !self.TempButtonUpFunction()) return;

        self.TempButtonUpFunction()();
    };

    self.LightOn_Temp = ko.computed(function () {
        if (!self.OvenIsOn()) return false; //The oven is off
        
        if (self.TempButtonIsBlinking() && !self.MasterBlinkOn())
            return false; //The blink is off

        if (self.DisplayingActualTemperature()) {
            return self.DisplayingActualTemperature();
        } else {
            return self.IsHeating();
        }
    });

    //LightPower
    self.LightPowerButtonDown = function () {
        self.LightPowerDown();
    };

    self.LightPowerButtonUp = function () {
        self.LightPowerUp();
    };

    self.LightOn_LightPower = ko.computed(function () {
        if (!self.OvenIsOn()) return false; //The oven is off

        if (self.LightPowerButtonIsBlinking() && !self.MasterBlinkOn())
            return false; //The blink is off

        return self.LightIsOn();
    });

    //Fan
    self.ButtonClickFan = function () {
        if (!self.OvenIsOn()) return;

        self.DisplayingProgramStage().ToggleFanValue();
    };

    self.LightOn_Fan = ko.computed(function () {
        if (!self.OvenIsOn() || self.IsProgramming()) return false; //The oven is off

        if (self.FanButtonIsBlinking() && !self.MasterBlinkOn())
            return false; //The blink is off

        return self.DisplayingProgramStage().IsFanLow();
    });

    //Timer
    self.TimerButtonDown = function () {
        if (!self.OvenIsOn() || !self.TimerButtonDownFunction()) return;

        self.TimerButtonDownFunction()();
    };

    self.TimerButtonUp = function () {
        if (!self.OvenIsOn() || !self.TimerButtonUpFunction()) return;

        self.TimerButtonUpFunction()();
    };

    self.LightOn_Timer = ko.computed(function () {
        if (!self.OvenIsOn()) return false; //The oven is off

        if (self.TimerButtonIsBlinking() && !self.MasterBlinkOn())
            return false; //The blink is off

        if (self.LightOn_TimerFunction()) {
            return self.LightOn_TimerFunction()();
            
        }
        else
            return false;
    });

    //Dials - Start
    //Temp Plus/Minus

    self.btnTemp_MinusClick = function () {
        if (!self.OvenIsOn() || !self.Temp_MinusClickFunction()) return;

        self.Temp_MinusClickFunction()();
    };

    self.btnTemp_PlusClick = function () {
        if (!self.OvenIsOn() || !self.Temp_PlusClickFunction()) return;

        self.Temp_PlusClickFunction()();
    };

    //Timer Plus/Minus
    self.btnTimer_MinusClick = function () {
        if (!self.OvenIsOn() || !self.Timer_MinusClickFunction()) return;

        self.Timer_MinusClickFunction()();
    };

    self.btnTimer_PlusClick = function () {
        if (!self.OvenIsOn() || !self.Timer_PlusClickFunction()) return;

        self.Timer_PlusClickFunction()();
    };

    //Dials - End

    //Displays - Start

    self.TopDisplay = ko.computed(function () {
        if (!self.OvenIsOn() || (self.TopDisplayIsBlinking() && !self.MasterBlinkOn()))
            return ''; //The oven or the blink is off
        
        return self.TopDisplayFunction() ? self.TopDisplayFunction()() : '';
    });

    self.BottomDisplay = ko.computed(function () {
        if (!self.OvenIsOn() || (self.BottomDisplayIsBlinking() && !self.MasterBlinkOn() && !self.OvenIsOn()))
            return ''; //The oven or the blink is off

        return self.BottomDisplayFunction() ? self.BottomDisplayFunction()() : '';
    });

    //Displays - End

    //Computed - Start

    self.ActualTemperatureRounded = ko.computed(function () {
        //Round the value
        return Math.round(self.ActualTemperature());
    });

    self.MoistureModeDisplay = ko.computed(function () {
        return 'H-' + self.DisplayingProgramStage().CurrentMoistureMode();
    });
    
    //Computed - End

    //Display Functions - Start

    self.TargetTemperature = ko.computed(function () {
        return self.DisplayingProgramStage().TargetTemperature();
    });

    self.TimerDisplayValue = function () {
        if (self.TimerStarted()) {
            return self.ConvertDurtaionToDisplay(self.DisplayingProgramStage().TimerCurrentValue());
        } else {
            if (self.DisplayingProgramStage().TimerStartValue() <= -2) {
                return "CP";
            } else if (self.DisplayingProgramStage().TimerStartValue() === -1) {
                return "InF";
            } else if (self.DisplayingProgramStage().TimerStartValue() === 0) {
                return "---";
            } else {
                return self.DisplayingProgramStage().TimerStartValue();
            }
        }
    };
    
    self.TargetTemperatureDisplayValue = function () {
        return self.DisplayingProgramStage().TargetTemperature();
    };

    self.CoreProbeDisplayValue = function () {
        var coreProbeLabel = "CP";

        if (self.DisplayingProgramStage().TargetCoreTemperatureSet()) {
            if (self.TargetCoreTemperatureBlinkOn()) {
                if (self.TargetCoreTemperatureAlternate()) {
                    if (self.DisplayingActualCoreTemperature())
                        return self.ActualCoreTemperature();
                    else
                        return self.DisplayingProgramStage().TargetCoreTemperature();
                } else {
                    return coreProbeLabel;
                }
            }
            else
                return '';
        } else {
            return coreProbeLabel;
        }
    };

    //Display Functions - End

    //Utils

    self.ConvertDurtaionToDisplay = function (duration) {
        if (duration.minutes() > 10) { return duration.minutes(); }

        //console.log(duration.minutes + ':' + (duration.seconds < 10 ? '0' : '') + duration.seconds);

        return duration.minutes() + ':' + (duration.seconds() < 10 ? '0' : '') + duration.seconds();
    };
}