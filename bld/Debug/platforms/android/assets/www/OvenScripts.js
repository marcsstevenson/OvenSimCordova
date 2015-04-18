/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Timers.js" />
/// <reference path="StatusProperties.js" />
/// <reference path="UserInterface.js" />
/// <reference path="Subscriptions.js" />
/// <reference path="OvenManager.js" />

window.OvenScripts = (function () {
    //function OvenScripts() {
    return {
        Setup3StageProgram_All150WithTime_BackToHome: function (ovenViewModel) {
            //Setup all three stages of a program
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTapHold();
            ovenViewModel.ProgramTap();

            ovenViewModel.ProgramTap();
            ovenViewModel.Timer_MinusClickFunction()(); //Increase the timer
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.Temp_PlusClickFunction()(); //Next Stage
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.Timer_MinusClickFunction()(); //Increase the timer
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.Temp_PlusClickFunction()(); //Next Stage
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.Timer_MinusClickFunction()(); //Increase the timer
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();

            //Back to Display Program
            ovenViewModel.ProgramTapHold();
            //Back home
            ovenViewModel.ProgramTap();
        },
        Setup3StageProgram_All240WithTime_BackToHome: function (ovenViewModel) {
            //Setup all three stages of a program
            ovenViewModel.ProgramTap();

            //Change to program 2
            ovenViewModel.Temp_PlusClickFunction()();

            ovenViewModel.ProgramTapHold();
            ovenViewModel.ProgramTap();

            //Increase the Temperature x 9
            for (var i = 0; i < 9; i++) ovenViewModel.Temp_PlusClickFunction()();
            ovenViewModel.ProgramTap();
            ovenViewModel.Timer_MinusClickFunction()(); //Increase the timer
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.Temp_PlusClickFunction()(); //Next Stage
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.Timer_MinusClickFunction()(); //Increase the timer
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.Temp_PlusClickFunction()(); //Next Stage
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.Timer_MinusClickFunction()(); //Increase the timer
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();
            ovenViewModel.ProgramTap();

            //Back to Display Program
            ovenViewModel.ProgramTapHold();
            //Back home
            ovenViewModel.ProgramTap();
        },
        SetProgram1_1TempToCP: function (ovenViewModel) {
            //Display program
            ovenViewModel.ProgramTap();

            //Edit Program
            ovenViewModel.ProgramTapHold();

            //Edit Temp on 1.1
            ovenViewModel.ProgramTap();

            //Edit time on 1.1
            ovenViewModel.ProgramTap();

            //Set time to INF
            ovenViewModel.btnTimer_MinusClick(); //Decrease the timer

            //Set time to CP
            ovenViewModel.btnTimer_MinusClick(); //Decrease the timer
        },
        SetProgram1To150DegreesAnd5MinutesThenBackToHome: function (ovenViewModel) {
            //Display program
            ovenViewModel.ProgramTap();

            //Edit Program
            ovenViewModel.ProgramTapHold();

            //Edit Temp on 1.1
            ovenViewModel.ProgramTap();

            //Edit time on 1.1
            ovenViewModel.ProgramTap();

            for (var i = 0; i < 5; i++) {
                ovenViewModel.Timer_MinusClickFunction()(); //Increase the timer
            }

            //Back to display 1.1
            for (var k = 0; k < 4; k++) {
                ovenViewModel.ProgramTap(); //Increase the timer
            }

            //Display program
            ovenViewModel.ProgramTapHold();

            //Display home
            ovenViewModel.ProgramTap();
        },
        DisplayProgram1: function (ovenViewModel) {
            //Display program
            ovenViewModel.ProgramTap();
        },
        SetActualTemperatureToTarget: function (ovenViewModel) {
            ovenViewModel.SetTemperature(1000); //This just needs to be greater than the target
        },
        SetActualTemperatureToTargetLess5: function (ovenViewModel) {
            ovenViewModel.SetTemperature(ovenViewModel.TargetTemperature() - 5); //This just needs to be greater than the target
        },
        StartAlarm: function (ovenViewModel) {
            ovenViewModel.StartAlarm();
        },
        StopAlarm: function (ovenViewModel) {
            ovenViewModel.StopAlarm();
        },
        StartRunningProgram: function (ovenViewModel) {
            ovenViewModel.StartRunningProgram();
        },
        SelectProgram1PreHeatAndStart: function (ovenViewModel) {
            OvenScripts.SetActualTemperatureToTarget(ovenViewModel);

            ovenViewModel.ProgramTap(); //Select P01

            ovenViewModel.StartRunningProgram();
        },
        SetTimerTo1Second: function (ovenViewModel) {
            var duration = moment.duration(1, 'seconds');
            ovenViewModel.DisplayingProgramStage().TimerCurrentValue(duration);
        }
    }
}());