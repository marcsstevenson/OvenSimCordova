/// <reference path="Lib/knockout-3.1.0.js" />

function UserInterface(self) {
    //Steam
    self.SteamButtonTap = function () {
        if (!self.OvenIsOn()) return;

        self.SteamTap();
    };

    self.SteamButtonTapHold = function () {
        if (!self.OvenIsOn()) return;

        self.SteamTapHold();
    };

    self.LightOn_Steam = ko.computed(function () {
        if (!self.OvenIsOn()) return false; //The oven is off

        if (self.SteamButtonIsBlinking() && !self.MasterBlinkOn())
            return false; //The blink is off

        return self.MoistureModeOn() || self.DisplayingMoistureSetup() || self.SteamShooting();
    });

    //Program
    self.ProgramButtonTap = function () {
        if (!self.OvenIsOn()) return;

        self.ProgramTap();
    };

    self.ProgramButtonTapHold = function () {
        if (!self.OvenIsOn()) return;

        self.ProgramTapHold();
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
    self.TempButtonTap = function () {
        if (!self.OvenIsOn() || !self.TempButtonTapFunction()) return;

        self.TempButtonTapFunction()();
    };

    self.TempButtonTapHold = function () {
        if (!self.OvenIsOn()) return;

        //Not used
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
    self.LightPowerButtonTap = function () {
        self.LightPowerTap();
    };

    self.LightPowerButtonTapHold = function () {       
        self.LightPowerTapHold();
    };

    self.LightOn_LightPower = ko.computed(function () {
        if (!self.OvenIsOn()) return false; //The oven is off

        if (self.LightPowerButtonIsBlinking() && !self.MasterBlinkOn())
            return false; //The blink is off

        return self.LightIsOn();
    });

    //Fan
    self.FanButtonTap = function () {
        if (!self.OvenIsOn()) return;

        self.DisplayingProgramStage().ToggleFanValue();
    };

    self.FanButtonTapHold = function () {
        if (!self.OvenIsOn()) return;

        //Not used
    };

    self.LightOn_Fan = ko.computed(function () {
        if (!self.OvenIsOn() || self.IsProgramming()) return false; //The oven is off

        if (self.FanButtonIsBlinking() && !self.MasterBlinkOn())
            return false; //The blink is off

        return self.DisplayingProgramStage().IsFanLow();
    });

    //Timer
    //self.TimerButtonDown = function () {
    //    if (!self.OvenIsOn() || !self.TimerButtonDownFunction()) return;

    //    self.TimerButtonDownFunction()();
    //};

    //self.TimerButtonUp = function () {
    //    if (!self.OvenIsOn() || !self.TimerButtonUpFunction()) return;

    //    self.TimerButtonUpFunction()();
    //};

    self.TimerButtonTap = function () {
        if (!self.OvenIsOn() || !self.TimerButtonTapFunction()) return;

        self.TimerButtonTapFunction()();
    };

    self.TimerButtonTapHold = function () {
        if (!self.OvenIsOn() || !self.TimerButtonTapHoldFunction()) return;

        self.TimerButtonTapHoldFunction()();
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

    self.DialTempCss = ko.observable();
    self.btnTemp_MinusOver = function () {
        //self.DialTempCss("dialLeft");
    };
    self.btnTemp_MinusOut = function () {
        self.DialTempCss("");
    };
    self.btnTemp_PlusOver = function () {
        //self.DialTempCss("dialRight");
    };
    self.btnTemp_PlusOut = function () {
        self.DialTempCss("");
    };
    
    self.btnTemp_MinusButtonDown = function () {
        self.DialTempCss("dialLeft");

        if (!self.OvenIsOn() || !self.Temp_MinusClickFunction()) return;

        self.Temp_MinusClickFunction()();
    };

    self.btnTemp_MinusButtonUp = function () {
        self.DialTempCss("");
    };

    self.btnTemp_PlusButtonDown = function () {
        self.DialTempCss("dialRight");

        if (!self.OvenIsOn() || !self.Temp_PlusClickFunction()) return;

        self.Temp_PlusClickFunction()();
    };

    self.btnTemp_PlusButtonUp = function () {
        self.DialTempCss("");
    };

    //Timer Plus/Minus
    
    self.DialTimerCss = ko.observable();
    self.btnTimer_MinusOver = function () {
        //self.DialTimerCss("dialLeft");
    };
    self.btnTimer_MinusOut = function () {
        self.DialTimerCss("");
    };
    self.btnTimer_PlusOver = function () {
        //self.DialTimerCss("dialRight");
    };
    self.btnTimer_PlusOut = function () {
        self.DialTimerCss("");
    };

    self.btnTimer_MinusButtonDown = function () {
        self.DialTimerCss("dialLeft");

        if (!self.OvenIsOn() || !self.Timer_MinusClickFunction()) return;

        self.Timer_MinusClickFunction()();
    };

    self.btnTimer_MinusButtonUp = function () {
        self.DialTimerCss("");
    };

    self.btnTimer_PlusButtonDown = function () {
        self.DialTimerCss("dialRight");

        if (!self.OvenIsOn() || !self.Timer_PlusClickFunction()) return;

        self.Timer_PlusClickFunction()();
    };

    self.btnTimer_PlusButtonUp = function () {
        self.DialTimerCss("");
    };

    //Dials - End

    //Displays - Start

    self.TopDisplay = ko.computed(function () {
        if (!self.OvenIsOn() || (self.TopDisplayIsBlinking() && !self.MasterBlinkOn()))
            return ''; //The oven or the blink is off
        
        return self.TopDisplayFunction() ? self.TopDisplayFunction()() : '';
    });

    self.BottomDisplay = ko.computed(function () {    
        if (!self.OvenIsOn() || (self.BottomDisplayIsBlinking() && !self.MasterBlinkOn()))
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