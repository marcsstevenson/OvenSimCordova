/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />
/// <reference path="Lib/knockout-3.1.0.js" />

function OvenManager(self) {
    //Power
    self.TurnOvenOn = function () {
        self.TopDisplayFunction(self.TargetTemperature);
        self.OvenIsOn(true);

        //Ensure that the oven is heating
        self.EnsureHeating();
    }

    self.TurnOvenOff = function () {
        //Turn everything off
        self.SetDefaults();
        self.TopDisplayFunction(null);
    }



    //*** Steam - Start

    //Press and hold the ‘Steam’ Key until the ‘H-X’ level is
    //displayed and flashing in the upper display.
    //Rotate the ‘Temp’ Knob -/+ to select Moisture Mode
    //level required.
    //Press the STEAM Key to confirm setting.
    self.SteamTap = function () {
        if (self.DisplayingMoistureSetup()) {
            //Stop DisplayingMoistureSetup
            self.StopDisplayingMoistureMode();
        } else {
            //Manual steam shot if steam is set to H-0
            if (self.DisplayingProgramStage().MoistureIsManual()) {
                self.SteamShot();
            }
        }
    };

    self.GetSteamLightIsOn = function () {
        if (self.MoistureModeOn()) return true;
        if (self.DisplayingMoistureSetup()) return true;
        if (self.SteamShooting()) return true;

        return self.DisplayingProgramStage().MoistureIsAuto();
    };

    self.SteamTapHold = function () {
        self.StartDisplayingMoistureModeSetup();
    };

    self.ToggleMoistureMode = function () {
        self.MoistureModeOn(!self.MoistureModeOn());
    };

    self.MoistureModeDown = function () {
        self.DisplayingProgramStage().MoistureModeDown();
    };

    self.MoistureModeUp = function () {
        self.DisplayingProgramStage().MoistureModeUp();
    };

    self.SteamShot = function () {
        self.SteamShooting(true);
        self.StartSteamShotModeIntervalTimer();
    };

    self.StartDisplayingMoistureModeSetup = function () {
        self.DisplayingMoistureSetup(true);

        self.SteamButtonIsBlinking(true);
        self.TopDisplayIsBlinking(true);

        self.TopDisplayFunction(self.MoistureModeDisplay);
        self.Temp_MinusClickFunction(self.MoistureModeDown);
        self.Temp_PlusClickFunction(self.MoistureModeUp);
    };

    self.StopDisplayingMoistureMode = function () {
        self.DisplayingMoistureSetup(false);

        self.SteamButtonIsBlinking(false);
        self.TopDisplayIsBlinking(false);

        self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
        self.Temp_MinusClickFunction(self.DecreaseTargetTemperature);
        self.Temp_PlusClickFunction(self.IncreaseTargetTemperature);
    };

    //*** Steam - End
    
    //*** Temperature Display - Start

    self.ToggleTempDisplay = function () {
        var currentValue = self.DisplayingActualTemperature();

        if (currentValue)
            self.StopDisplayingActualTemperature();
        else
            self.StartDisplayingActualTemperature();
    }

    self.StartDisplayingActualTemperature = function () {
        //Stop the temp display timers
        self.TempButtonIsBlinking(true);
        self.DisplayingActualTemperature(true);
        self.StartTempDisplayIntervalTimer();

        self.TopDisplayFunction(self.ActualTemperatureRounded);
    };

    self.StopDisplayingActualTemperature = function () {
        //Stop the temp display timers

        self.TempButtonIsBlinking(false);

        self.DisplayingActualTemperature(false);

        self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
    };

    //*** Temperature Display - End

    //*** LightPower - Start

    //Press ‘On-Off/Light’ key once to turn
    //the oven ‘On’
    //When oven is turned ‘On’, press ‘On-Off/Light’
    //key to switch oven light ‘On-Off’.
    //Press and hold ‘On-Off/Light’ key for 1.5 seconds
    //to turn the oven ‘Off’.

    self.ToggleLight = function () {
        self.LightIsOn(!self.LightIsOn());
    }

    self.LightPowerTap = function () {
        if (self.OvenIsOn())
            self.ToggleLight();
        else
            self.TurnOvenOn(); //Just turn the oven on
    };

    self.LightPowerTapHold = function () {
        self.TurnOvenOff(); //Power off the oven
    };

    //*** LightPower - End

    //*** Core Probe Section - Start

    self.ConnectCoreProbe = function () {
        self.CoreProbeConnected(true);
        self.CoreTemperatureCookingStarted(false);
        self.TargetCoreTemperatureSet(false);

        //Configure for core temp operation
        self.BottomDisplayFunction(self.CoreProbeDisplayValue);
        self.Timer_MinusClickFunction(self.DecreaseTargetCoreTemperature);
        self.Timer_PlusClickFunction(self.IncreaseTargetCoreTemperature);

        self.TimerButtonTapFunction(self.StartCoreProbeCooking);
        self.TimerButtonTapHoldFunction(function () { }); //Just stub this

        self.LightOn_TimerFunction(function () { return self.CoreTemperatureCookingStarted(); });

        self.TempButtonTapFunction(self.ToggleCoreTemperatureDisplay);
    };

    self.DisconnectCoreProbe = function () {
        self.CoreProbeConnected(false);
        self.CoreTemperatureCookingStarted(false);

        //Reset
        self.TempButtonTapFunction(self.ToggleTempDisplay);
        self.SetDefaults_TimerUi();
    };

    self.DecreaseTargetCoreTemperature = function () {
        self.SetTargetCoreTemperature(self.DisplayingProgramStage().TargetCoreTemperature() - 1);
    };

    self.IncreaseTargetCoreTemperature = function () {
        self.SetTargetCoreTemperature(self.DisplayingProgramStage().TargetCoreTemperature() + 1);
    };

    self.SetTargetCoreTemperature = function (newValue) {
        var originalTargetCoreTemperatureSet = self.DisplayingProgramStage().TargetCoreTemperatureSet();
        
        self.DisplayingProgramStage().SetTargetCoreTemperature(newValue);
        
        //Start with the blinking if TargetCoreTemperatureSet has changed
        if (originalTargetCoreTemperatureSet != self.DisplayingProgramStage().TargetCoreTemperatureSet()) 
            self.StartCoreTemperatureModeBlinkIntervalTimer();
    };

    self.StartCoreProbeCooking = function () {
        self.CoreTemperatureCookingStarted(true);
        self.IsHeating(true);

        //When Core Probe Set Temperature is reached, an alarm will sound and the Lower Display will flash.
        //- Press ‘Timer-Start/Stop’ key to cancel alarm, oven will continue cooking at Oven Set Temperature. Display will show Oven
        //Set Temperature and Core Probe Set Temperature
    };

    self.CoreProbeCookingComplete = function () {
        //When Core Probe Set Temperature is reached, an alarm will sound and the Lower Display will flash.

    };

    self.CoreProbeCookingReset = function () {
        //- Press ‘Timer-Start/Stop’ key to cancel alarm, oven will continue cooking at Oven Set Temperature. Display will show Oven
        //Set Temperature and Core Probe Set Temperature.
    };

    self.ToggleCoreTemperatureDisplay = function () {
        var currentValue = self.DisplayingActualCoreTemperature();

        if (currentValue)
            self.StopDisplayingActualCoreTemperature();
        else
            self.StartDisplayingActualCoreTemperature();
    }

    self.StartDisplayingActualCoreTemperature = function () {
        //Stop the temp display timers
        self.StartCoreTemperatureDisplayIntervalTimer();
        self.DisplayingActualCoreTemperature(true);
    };

    self.StopDisplayingActualCoreTemperature = function () {
        //Stop the temp display timers
        self.ClearCoreTemperatureDisplayTimer();
        self.DisplayingActualCoreTemperature(false);
    };

    //*** Core Probe Section - End
}
