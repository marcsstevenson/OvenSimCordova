/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />
/// <reference path="Lib/knockout-3.1.0.js" />

function OvenProgramManagement(self) {

    self.EditingOvenProgram = ko.computed(function () {
        return self.OvenPrograms()[self.EditingOvenProgramIndex()];
    });

    self.EditingOvenProgramStage = ko.computed(function () {
        return self.EditingOvenProgram().OvenProgramStages()[self.EditingOvenProgramStageIndex()];
    });

    self.ProgramDown = function () {
        self.IsWaitingForEditProgramStartInterval(true);
        self.StartEditProgramStartIntervalTimer();
    };

    self.ProgramUp = function () {
        if (self.IsWaitingForEditProgramStartInterval()) {
            self.ProgrammingShortClick();
        }

        self.ClearEditProgramStartTimer();
        self.IsWaitingForEditProgramStartInterval(false);
    };

    //  Display Programs - Start
    self.ProgrammingShortClick = function () {
        if (self.ProgrammingArea() === 0)
            self.SetProgrammingArea(1); //From none to display
        else if (self.ProgrammingArea() === 1)
            self.SetProgrammingArea(0); //From display to none
        else if (self.ProgrammingArea() === 2)
            self.SetProgrammingArea(3); //From edit to edit stage values
        else if (self.ProgrammingArea() === 3)
            self.NextEditProgramStageValue(); //Move to the next edit stage value
    };

    self.ProgrammingLongClick = function () {
        if (self.ProgrammingArea() === 0)
            ; //Twiddle thumbs
        else if (self.ProgrammingArea() === 1)
            self.SetProgrammingArea(2); //From display to edit
        else if (self.ProgrammingArea() === 2)
            self.SetProgrammingArea(1); //From edit back to display
        else if (self.ProgrammingArea() === 3)
            self.NextEditProgramStageValue(1); //From edit stage values back to display
    };

    self.SetForDisplayProgramTargetTemperature = function () {
        //Are we at target temperature already?
        if (self.AtTargetTemperature()) {
            self.IsPreheating(false);
        } else {
            self.StartPreheating();
        }
        
        self.BottomDisplayFunction(function () {
            if (self.AtTargetTemperature()) {
                //Lower Display will show rdY when oven is up to pre-heat temperature
                return 'rdY';
            } else {
                //Lower Display will show PrH, oven is ‘Pre-Heating’.
                return 'PrH';
            }
        });
    };

    self.SetProgrammingArea = function (value) {
        //0 = Not, 1 = Display Program, 2 = Edit Program, 3 = Edit Program Stage Values

        //Set by default
        self.ProgramButtonIsBlinking(false);
        self.TopDisplayIsBlinking(false);

        self.DisplayingProgramStage(self.EditingOvenProgramStage());

        if (value === 0) {
            //Restore defaults
            self.SetDefaults_TempUi();
            self.SetDefaults_TimerUi();
            self.DisplayingProgramStage(self.ManualModeProgramStage());
            self.IsManualMode(true);
        } else if (value === 1) {
            //Display Program
            
            //Set the temp knob to change display program 
            self.Temp_MinusClickFunction(self.DisplayPreviousProgram);
            self.Temp_PlusClickFunction(self.DisplayNextProgram);

            //Set the top display to show the currently displayed program
            self.TopDisplayFunction(self.DisplayProgramsValue);

            self.SetForDisplayProgramTargetTemperature();

            self.TimerButtonDownFunction(self.StartRunningProgram);
            self.TimerButtonUpFunction(null);

            //Stop with the flashing
            self.ProgramButtonIsBlinking(false);

            //Set the display program stage to the first
            self.ChangeDisplayProgramStageIndex(0);

            self.IsManualMode(false);
        } else if (value === 2) {
            //Edit Program

            //Set the temp knob to change display program 
            self.Temp_MinusClickFunction(self.DisplayPreviousProgramStage);
            self.Temp_PlusClickFunction(self.DisplayNextProgramStage);

            //Set the top display to show the currently displayed program
            self.TopDisplayFunction(self.EditProgramValue);

            //Set the bottom display to show the on/off status of the program
            self.BottomDisplayFunction(self.EditProgramStageIsOn);

            //The timer buttons toggle the IsOnValue of the stage
            self.Timer_MinusClickFunction(function() {
                self.EditingOvenProgram().SetProgramStageOff(self.EditingOvenProgramStageIndex());
            });
            self.Timer_PlusClickFunction(function () {
                self.EditingOvenProgramStage().IsOnValue(true);
            });

            self.Beep();

            //Start with the flashing
            self.ProgramButtonIsBlinking(true);
        } else if (value === 3) {
            //Edit Program Stage Values

            self.ProgramButtonIsBlinking(true);

            self.EditingOvenProgramStage().SetToNoEditingValue();

            self.NextEditProgramStageValue();
        }

        self.ProgrammingArea(value);
    };

    self.NextEditProgramStageValue = function () {
        //Move to temp, timer, steam etc
        var programStage = self.EditingOvenProgramStage();
        programStage.NextEditingValue();
        
        //Set UI as needed
        if (programStage.EditingIndex() === -1) {
            // -1: None
            self.SetProgrammingArea(2);

            self.TopDisplayIsBlinking(false);
            self.BottomDisplayIsBlinking(false);
        }
        else if (programStage.EditingIndex() === 0) {

            //console.clear();
            //console.log(self.EditingOvenProgramStage());
            //console.log(self.ManualModeProgramStage());

            // 0: Target Temp
            //Top display has target temp of stage - blinking
            //Temp +/- adjusts the target temp
            self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
            self.TopDisplayIsBlinking(true);
            self.Temp_MinusClickFunction(self.DecreaseTargetTemperature);
            self.Temp_PlusClickFunction(self.IncreaseTargetTemperature);
            
            //Bottom display is "timer value"
            //Timer +/- does nothing
            self.BottomDisplayFunction(self.TimerDisplayValue);
            self.BottomDisplayIsBlinking(false);
            self.Timer_MinusClickFunction(null);
            self.Timer_PlusClickFunction(null);
        }
        else if (programStage.EditingIndex() === 1) {
            // 1: Timer
            //Top display has target temp of stage
            //Temp +/- does nothing
            self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
            self.TopDisplayIsBlinking(false);
            self.Temp_MinusClickFunction(null);
            self.Temp_PlusClickFunction(null);

            //Bottom display is timer value - blinking
            //Timer +/- adjusts the target temp
            self.BottomDisplayFunction(self.TimerDisplayValue);
            self.BottomDisplayIsBlinking(true);
            self.Timer_MinusClickFunction(self.DecreaseTimer);
            self.Timer_PlusClickFunction(self.IncreaseTimer);
        }
        else if (programStage.EditingIndex() === 2) {
            // 2: Target Core Temperature (if timer is CP(-2))
            //Top display has target temp of stage
            //Temp +/- does nothing
            self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
            self.TopDisplayIsBlinking(false);
            self.Temp_MinusClickFunction(null);
            self.Temp_PlusClickFunction(null);

            //Bottom display is Target Core Temperature - blinking
            //Timer +/- adjusts Target Core Temperature
            self.BottomDisplayFunction(function () {
                return String(self.DisplayingProgramStage().TargetCoreTemperature());
            });
            self.BottomDisplayIsBlinking(true);
            self.Timer_MinusClickFunction(function () {
                self.DisplayingProgramStage().DecreaseTargetCoreTemperature();
            });
            self.Timer_PlusClickFunction(function () {
                self.DisplayingProgramStage().IncreaseTargetCoreTemperature();
            });
        }
        else if (programStage.EditingIndex() === 3) {
            // 3: Steam
            //Top display has moisture mode - blinking
            //Temp +/- adjusts the moisture mode
            self.TopDisplayFunction(self.MoistureModeDisplay);
            self.TopDisplayIsBlinking(true);
            self.Temp_MinusClickFunction(self.MoistureModeDown);
            self.Temp_PlusClickFunction(self.MoistureModeUp);

            //Bottom display is blank
            //Timer +/- does nothing
            self.BottomDisplayFunction(null);
            self.BottomDisplayIsBlinking(false);
            self.Timer_MinusClickFunction(null);
            self.Timer_PlusClickFunction(null);
        }
        else if (programStage.EditingIndex() === 4) {
            // 4: Fan
            //Top display has target "FAn"
            //Temp +/- does nothing
            self.TopDisplayFunction(function () {
                return 'FAn';
            });
            self.TopDisplayIsBlinking(false);
            self.Temp_MinusClickFunction(null);
            self.Temp_PlusClickFunction(null);

            //Bottom display is Fan Mode - blinking
            //Timer +/- adjusts Fan Mode: - sets LO, + sets Hi
            self.BottomDisplayFunction(function() {
                return self.DisplayingProgramStage().IsFanLow() ? 'LO' : 'H1';
            });
            self.BottomDisplayIsBlinking(true);
            self.Timer_MinusClickFunction(function () {
                self.DisplayingProgramStage().IsFanLow(1);
            });
            self.Timer_PlusClickFunction(function () {
                self.DisplayingProgramStage().IsFanLow(0);
            });
        }
        else if (programStage.EditingIndex() === 5) {
            // 5: Alarm
            //Top display has target "ALr"
            //Temp +/- does nothing
            self.TopDisplayFunction(function () {
                return 'ALr';
            });
            self.TopDisplayIsBlinking(false);
            self.Temp_MinusClickFunction(null);
            self.Temp_PlusClickFunction(null);

            //Bottom display is Alarm value - blinking
            //Timer +/- adjusts Alarm: - sets off, + sets on
            self.BottomDisplayFunction(function () {
                return self.DisplayingProgramStage().AlarmOn() ? 'On' : 'OFF';
            });
            self.BottomDisplayIsBlinking(true);
            self.Timer_MinusClickFunction(function () {
                self.DisplayingProgramStage().AlarmOn(false);
            });
            self.Timer_PlusClickFunction(function () {
                self.DisplayingProgramStage().AlarmOn(true);
            });
        }
    };

    //  Display Programs - Start

    self.DisplayNextProgram = function () {
        self.ChangeDisplayProgram(1);
    }

    self.DisplayPreviousProgram = function () {
        self.ChangeDisplayProgram(-1);
    }

    self.ChangeDisplayProgram = function (delta) {
        var newIndex = self.EditingOvenProgramIndex() + delta;

        if (newIndex > self.OvenPrograms().length - 1) return; //It doesn't loop
        if (newIndex < 0) return; //It doesn't loop
        
        self.ChangeDisplayProgramIndex(newIndex);
    }

    self.ChangeDisplayProgramIndex = function (newIndex) {
        self.EditingOvenProgramIndex(newIndex);
        self.SetForDisplayProgramTargetTemperature(); //The target temperature may have changed
    }

    self.DisplayNextProgramStage = function () {
        self.ChangeDisplayProgramStage(1);
    }

    self.DisplayPreviousProgramStage = function () {
        self.ChangeDisplayProgramStage(-1);
    }

    self.HasNextProgramStage = function () {
        var lastOnProgramStage = self.EditingOvenProgram().GetLastOnProgramStage();
        var currentProgramStageIndex = self.EditingOvenProgramStageIndex();

        return currentProgramStageIndex < lastOnProgramStage.Index();
    };

    self.ChangeDisplayProgramStage = function (delta) {
        var newIndex = self.EditingOvenProgramStageIndex() + delta;

        if (newIndex < 0) return; //It doesn't loop

        var lastOnProgramStage = self.EditingOvenProgram().GetLastOnProgramStage();

        if (!lastOnProgramStage) return; //There are no stages so there is nowhere to go

        if (newIndex > self.EditingOvenProgram().OvenProgramStages().length - 1) return; //It doesn't loop
        if (newIndex > lastOnProgramStage.Index() + 1) return; //We cannot move one past the last on stage

        self.ChangeDisplayProgramStageIndex(newIndex);
    }

    self.ChangeDisplayProgramStageIndex = function (newIndex) {
        self.EditingOvenProgramStageIndex(newIndex);
        self.SetForDisplayProgramTargetTemperature(); //The target temperature may have changed
    }

    self.DisplayProgramsValue = function () {
        return self.EditingOvenProgram().GetPName();
    };

    //  Display Programs - End

    //  Edit Programs - Start
    self.EditProgramValue = function () {
        var ovenProgram = self.EditingOvenProgram();
        var ovenProgramStage = self.EditingOvenProgramStage();
        var display = ovenProgram.Name() + '.' + ovenProgramStage.Name();
        return display;
    };

    self.EditProgramStageIsOn = function () {
        var ovenProgram = self.OvenPrograms()[self.EditingOvenProgramIndex()];
        var ovenProgramStage = ovenProgram.OvenProgramStages()[self.EditingOvenProgramStageIndex()];
        return ovenProgramStage.IsOn() ? 'On' : 'OFF';
    };

    //  Edit Programs - End

    self.SetBottomDisplayForProgramDisplay = function () {

        self.TimerButtonDownFunction(self.StartRunningProgram);
        self.TimerButtonUpFunction(null);

        //Lower Display will show PrH, oven is ‘Pre-Heating’.
        //Program cannot be started until pre-heating is completed.
        self.EnsureHeating();
        self.IsPreheating(true);

        self.BottomDisplayFunction(function () {
            return 'PrH';
        });
    };

    self.StartRunningProgram = function () {
        if (self.AtTargetTemperature()) {
            //Display timer in bottom display
            self.BottomDisplayFunction(self.TimerDisplayValue);

            //Start timer
            self.StartTimer();

            //Set the timer buttons back to normal
            self.SetDefaults_TimerButtons();

            //Restore the bottom display value
            self.BottomDisplayFunction(self.TimerDisplayValue);

            //Stop with the beeping already
            self.StopAlarm();
        } else {
            //Continue heating until rdY
            self.Log('We are not at target temperature');
        }
    };
}
