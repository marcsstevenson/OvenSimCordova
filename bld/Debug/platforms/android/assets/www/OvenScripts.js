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
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingLongClick();
            ovenViewModel.ProgrammingShortClick();

            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTimer_PlusClick(); //Increase the timer
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTemp_PlusClick(); //Next Stage
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTimer_PlusClick(); //Increase the timer
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTemp_PlusClick(); //Next Stage
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTimer_PlusClick(); //Increase the timer
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();

            //Back to Display Program
            ovenViewModel.ProgrammingLongClick();
            //Back home
            ovenViewModel.ProgrammingShortClick();
        },
        Setup3StageProgram_All240WithTime_BackToHome: function (ovenViewModel) {
            //Setup all three stages of a program
            ovenViewModel.ProgrammingShortClick();

            //Change to program 2
            ovenViewModel.btnTemp_PlusClick();

            ovenViewModel.ProgrammingLongClick();
            ovenViewModel.ProgrammingShortClick();

            //Increase the Temperature x 9
            for (var i = 0; i < 9; i++) ovenViewModel.btnTemp_PlusClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTimer_PlusClick(); //Increase the timer
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTemp_PlusClick(); //Next Stage
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTimer_PlusClick(); //Increase the timer
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTemp_PlusClick(); //Next Stage
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTimer_PlusClick(); //Increase the timer
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();

            //Back to Display Program
            ovenViewModel.ProgrammingLongClick();
            //Back home
            ovenViewModel.ProgrammingShortClick();
        },
        SetProgram1_1TempToCP: function (ovenViewModel) {
            //Display program
            ovenViewModel.ProgrammingShortClick();

            //Edit Program
            ovenViewModel.ProgrammingLongClick();

            //Edit Temp on 1.1
            ovenViewModel.ProgrammingShortClick();

            //Edit time on 1.1
            ovenViewModel.ProgrammingShortClick();

            //Set time to INF
            ovenViewModel.btnTimer_MinusClick(); //Decrease the timer

            //Set time to CP
            ovenViewModel.btnTimer_MinusClick(); //Decrease the timer
        },
        SetProgram1To150DegreesAnd5MinutesThenBackToHome: function (ovenViewModel) {
            //Display program
            ovenViewModel.ProgrammingShortClick();

            //Edit Program
            ovenViewModel.ProgrammingLongClick();

            //Edit Temp on 1.1
            ovenViewModel.ProgrammingShortClick();

            //Edit time on 1.1
            ovenViewModel.ProgrammingShortClick();

            for (var i = 0; i < 5; i++) {
                ovenViewModel.btnTimer_PlusClick(); //Increase the timer
            }

            //Back to display 1.1
            for (var k = 0; k < 4; k++) {
                ovenViewModel.ProgrammingShortClick(); //Increase the timer
            }

            //Display program
            ovenViewModel.ProgrammingLongClick();

            //Display home
            ovenViewModel.ProgrammingShortClick();
        },
        DisplayProgram1: function (ovenViewModel) {
            //Display program
            ovenViewModel.ProgrammingShortClick();
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

            ovenViewModel.ProgrammingShortClick(); //Select P01

            ovenViewModel.StartRunningProgram();
        },
        SetTimerTo1Second: function (ovenViewModel) {
            var duration = moment.duration(1, 'seconds');
            ovenViewModel.DisplayingProgramStage().TimerCurrentValue(duration);
        }
    }
}());