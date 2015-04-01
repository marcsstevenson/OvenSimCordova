/// <reference path="Lib/knockout-3.1.0.js" />

function Subscriptions(self) {
    //Status Subscriptions
    self.OvenIsOn.subscribe(function () {
        self.Log("OvenIsOn: " + self.OvenIsOn());
    });

    self.LightIsOn.subscribe(function () {
        self.Log("LightIsOn: " + self.LightIsOn());
    });

    self.MoistureModeOn.subscribe(function () {
        self.Log("MoistureModeOn: " + self.MoistureModeOn());
    });

    self.DisplayingProgramStage().CurrentMoistureMode.subscribe(function () {
        self.Log("CurrentMoistureMode: " + self.DisplayingProgramStage().CurrentMoistureMode());
    });

    self.DisplayingMoistureSetup.subscribe(function () {
        self.Log("DisplayingMoistureSetup: " + self.DisplayingMoistureSetup());
    });
    
    self.IsManualMode.subscribe(function () {
        self.Log("IsManualMode: " + self.IsManualMode());
    });

    self.IsCooking.subscribe(function () {
        self.Log("IsCooking: " + self.IsCooking());
    });

    self.SteamShooting.subscribe(function () {
        self.Log("SteamShooting: " + self.SteamShooting());
    });

    self.IsHeating.subscribe(function () {
        self.Log("IsHeating: " + self.IsHeating());
    });

    self.CoreTemperatureCookingStarted.subscribe(function () {
        self.Log("CoreTemperatureCookingStarted: " + self.CoreTemperatureCookingStarted());
    });

    self.IsPreheating.subscribe(function () {
        self.Log("IsPreheating: " + self.IsPreheating());
    });
    
    //Blinkingness
    self.SteamButtonIsBlinking.subscribe(function () {
        self.Log("SteamButtonIsBlinking: " + self.SteamButtonIsBlinking());
    });
    self.ProgramButtonIsBlinking.subscribe(function () {
        self.Log("ProgramButtonIsBlinking: " + self.ProgramButtonIsBlinking());
    });
    self.TempButtonIsBlinking.subscribe(function () {
        self.Log("TempButtonIsBlinking: " + self.TempButtonIsBlinking());
    });
    self.LightPowerButtonIsBlinking.subscribe(function () {
        self.Log("LightPowerButtonIsBlinking: " + self.LightPowerButtonIsBlinking());
    });
    self.FanButtonIsBlinking.subscribe(function () {
        self.Log("FanButtonIsBlinking: " + self.FanButtonIsBlinking());
    });
    self.TimerButtonIsBlinking.subscribe(function () {
        self.Log("TimerButtonIsBlinking: " + self.TimerButtonIsBlinking());
    });

    self.TopDisplayIsBlinking.subscribe(function () {
        self.Log("TopDisplayIsBlinking: " + self.TopDisplayIsBlinking());
    });
    self.BottomDisplayIsBlinking.subscribe(function () {
        self.Log("BottomDisplayIsBlinking: " + self.BottomDisplayIsBlinking());
    });
}