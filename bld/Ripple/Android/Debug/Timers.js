/// <reference path="Lib/knockout-3.1.0.js" />

function Timers(self) {
    var blinkInterval = 300;

    //***Steam - Start

    //MoistureMode
    self.MoistureModeTimerId = 0;
    self.IsWaitingForMoistureModeOffInterval = ko.observable(false);
    self.MoistureModeOffInterval = 1500; //ms

    self.ClearMoistureModeTimer = function () {
        if (self.MoistureModeTimerId !== 0)
            clearInterval(self.MoistureModeTimerId);
    };

    self.StartMoistureModeIntervalTimer = function () {
        self.ClearMoistureModeTimer(); //Stop the timer
        self.MoistureModeTimerId = setInterval(function () { self.NextMoistureModeInterval(); }, self.MoistureModeOffInterval);
    };

    self.NextMoistureModeInterval = function () {
        self.IsWaitingForMoistureModeOffInterval(false); //Always reset this
        self.ClearMoistureModeTimer(); //Stop the timer
        self.StartDisplayingMoistureModeSetup(); //MoistureMode off the oven
    };

    //SteamShot

    self.SteamShotModeTimerId = 1;
    self.IsWaitingForSteamShotModeOffInterval = false;
    self.SteamShotModeOffInterval = 1000; //ms

    self.ClearSteamShotModeTimer = function () {
        if (self.SteamShotModeTimerId !== 1)
            clearInterval(self.SteamShotModeTimerId);
    };

    self.StartSteamShotModeIntervalTimer = function () {
        self.ClearSteamShotModeTimer(); //Stop the timer
        self.SteamShotModeTimerId = setInterval(function () { self.NextSteamShotModeInterval(); }, self.SteamShotModeOffInterval);
        self.SteamShooting(true);
    };

    self.NextSteamShotModeInterval = function () {
        self.IsWaitingForSteamShotModeOffInterval = false; //Always reset this
        self.ClearSteamShotModeTimer(); //Stop the timer
        self.SteamShooting(false);
    };

    //*** Steam - End

    //*** Programming - Start

    //EditProgramStart
    self.EditProgramStartTimerId = 11;
    self.IsWaitingForEditProgramStartInterval = ko.observable(false);
    self.EditProgramStartInterval = 2000; //ms

    self.ClearEditProgramStartTimer = function () {
        if (self.EditProgramStartTimerId !== 11)
            clearInterval(self.EditProgramStartTimerId);
    };

    self.StartEditProgramStartIntervalTimer = function () {
        self.ClearEditProgramStartTimer(); //Stop the timer
        self.EditProgramStartTimerId = setInterval(function () { self.NextEditProgramStartInterval(); }, self.EditProgramStartInterval);
    };

    self.NextEditProgramStartInterval = function () {
        self.IsWaitingForEditProgramStartInterval(false); //Always reset this
        self.ClearEditProgramStartTimer(); //Stop the timer

        self.ProgrammingLongClick();
    };

    //*** Programming - End

    //***TempDisplay - Start

    self.TempDisplayTimerId = 3;
    self.IsWaitingForTempDisplayInterval = false;
    self.TempDisplayInterval = 5000; //ms

    self.ClearTempDisplayTimer = function () {
        if (self.TempDisplayTimerId !== 3)
            clearInterval(self.TempDisplayTimerId);
    };

    self.StartTempDisplayIntervalTimer = function () {
        self.ClearTempDisplayTimer(); //Stop the timer
        self.TempDisplayTimerId = setInterval(function () { self.NextTempDisplayInterval(); }, self.TempDisplayInterval);
    };

    self.NextTempDisplayInterval = function () {
        self.IsWaitingForTempDisplayInterval = false; //Always reset this
        
        self.StopDisplayingActualTemperature(); //TempDisplay off the oven
    };

    //***TempDisplay - End

    //*** Power - Start

    self.PowerTimerId = 2;
    self.IsWaitingForPowerOffInterval = false;
    self.PowerOffInterval = 1500; //ms - this is used to turn the oven off

    self.ClearPowerTimer = function () {
        if (self.PowerTimerId !== 2)
            clearInterval(self.PowerTimerId);
    };

    self.StartPowerIntervalTimer = function () {
        self.ClearPowerTimer(); //Stop the timer
        self.PowerTimerId = setInterval(function () { self.NextPowerInterval(); }, self.PowerOffInterval);
    };

    self.NextPowerInterval = function () {
        self.IsWaitingForPowerOffInterval = false; //Always reset this
        self.ClearPowerTimer(); //Stop the timer
        self.TurnOvenOff(); //Power off the oven
    };

    //*** Power - End

    //*** Timer - Start

    //Reset

    self.TimerLongClickTimerId = 6;
    self.IsWaitingForTimerLongClickInterval = ko.observable(false);
    self.TimerLongClickInterval = 3000; //ms

    self.ClearTimerLongClickTimer = function () {
        if (self.TimerLongClickTimerId !== 6)
            clearInterval(self.TimerLongClickTimerId);
    };

    self.StartTimerLongClickIntervalTimer = function () {
        if (self.IsWaitingForTimerLongClickInterval()) return; //Don't start another

        self.IsWaitingForTimerLongClickInterval(true);
        self.ClearTimerLongClickTimer(); //Stop the timer
        self.TimerLongClickTimerId = setInterval(function () { self.NextTimerLongClickInterval(); }, self.TimerLongClickInterval);
    };
    
    self.NextTimerLongClickInterval = function () {
        self.ClearTimerLongClickTimer();
        //self.TimerLongClickInterval();
        self.TimerLongClick();

        //self.IsWaitingForTimerCountdownInterval(false); //Always reset this
        //self.ClearTimerLongClickTimer(); //Stop the timer
        //self.LongClickTimer();
    };

    //Countdown

    self.TimerCountdownTimerId = 7;
    self.IsWaitingForTimerCountdownInterval = ko.observable(false);
    self.TimerCountdownInterval = 1000; //ms

    self.ClearTimerCountdownTimer = function () {
        if (self.TimerCountdownTimerId !== 7)
            clearInterval(self.TimerCountdownTimerId);
    };

    self.StartTimerCountdownIntervalTimer = function () {
        self.ClearTimerCountdownTimer(); //Stop the timer

        var interval = self.TimerCountdownInterval / self.TimeDilation();
        self.TimerCountdownTimerId = setInterval(function () { self.NextTimerCountdownInterval(); }, interval); //
    };

    self.NextTimerCountdownInterval = function () {

        //Update timer current value
        self.ClearTimerCountdownTimer();

        if (!self.TimerRunning()) return;

        self.StartTimerCountdownIntervalTimer();

        self.SetTimerTimerNextValue();
    };
    
    //*** Timer - End

    //*** Status Values

    //Heating

    self.SetIntervalHeatingTimer = function () {
        self.ClearHeatingTimer();

        self.HeatingTimerId = setInterval(function () { self.NextHeatingInterval(); }, 50);
    };

    self.ClearHeatingTimer = function () {
        if (self.HeatingTimerId !== 0)
            clearInterval(self.HeatingTimerId);
    };

    self.StartIntervalHeatingTimer = function () {
        self.ClearHeatingTimer(); //Stop the timer
        self.SetIntervalHeatingTimer();
    };

    self.NextHeatingInterval = function () {
        //TODO: Cooling when not heating
        self.IncreaseTemperatureFromHeating();
        self.IncreaseCoreTemperatureFromHeating();
    };

    //*** Core Temperature - Start
    /// KEEP THIS ------------------------------------------------------------------------
    var coreTemperatureModeBlinkCount = 0;
    self.CoreTemperatureModeBlinkTimerId = 9;
    self.CoreTemperatureModeBlinkOffInterval = blinkInterval;

    self.ClearCoreTemperatureModeBlinkTimer = function () {
        if (self.CoreTemperatureModeBlinkTimerId !== 9)
            clearInterval(self.CoreTemperatureModeBlinkTimerId);
    };

    self.StartCoreTemperatureModeBlinkIntervalTimer = function () {
        self.ClearCoreTemperatureModeBlinkTimer(); //Stop the timer
        self.CoreTemperatureModeBlinkTimerId = setInterval(function () { self.NextCoreTemperatureModeBlinkInterval(); }, self.CoreTemperatureModeBlinkOffInterval);
    };

    self.NextCoreTemperatureModeBlinkInterval = function () {
        self.TargetCoreTemperatureBlinkOn(!self.TargetCoreTemperatureBlinkOn());
        
        //Set the based on every 2nd on blink
        
        self.TargetCoreTemperatureAlternate(coreTemperatureModeBlinkCount == 0);

        coreTemperatureModeBlinkCount++;
        if (coreTemperatureModeBlinkCount >= 4) coreTemperatureModeBlinkCount = 0; //Loop
    };


    //Actual Core Temp Display

    self.CoreTemperatureDisplayTimerId = 10;
    self.IsWaitingForCoreTemperatureDisplayInterval = false;
    self.CoreTemperatureDisplayInterval = 5000; //ms

    self.ClearCoreTemperatureDisplayTimer = function () {
        if (self.CoreTemperatureDisplayTimerId !== 10)
            clearInterval(self.CoreTemperatureDisplayTimerId);
    };

    self.StartCoreTemperatureDisplayIntervalTimer = function () {
        self.ClearCoreTemperatureDisplayTimer(); //Stop the timer
        self.CoreTemperatureDisplayTimerId = setInterval(function () { self.NextCoreTemperatureDisplayInterval(); }, self.CoreTemperatureDisplayInterval);
    };

    self.NextCoreTemperatureDisplayInterval = function () {
        self.IsWaitingForCoreTemperatureDisplayInterval = false; //Always reset this
        self.ClearCoreTemperatureDisplayTimer(); //Stop the timer
        self.StopDisplayingActualCoreTemperature(); //CoreTemperatureDisplay off the oven
    };

    //*** Core Temperature - End

    //MasterBlink - the blink to blink them all

    self.MasterBlinkTimerId = 100;
    self.MasterBlinkOffInterval = blinkInterval; //ms - this is used to turn the oven off
    
    self.StartMasterBlinkIntervalTimer = function () {
        self.MasterBlinkTimerId = setInterval(function () { self.NextMasterBlinkInterval(); }, self.MasterBlinkOffInterval);
    };

    self.NextMasterBlinkInterval = function () {
        self.MasterBlinkOn(!self.MasterBlinkOn());
    };

    if (self.BlinkingEnabled === true)
        self.StartMasterBlinkIntervalTimer(); //The master blink always blinks
}