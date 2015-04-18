
/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js"/>
/// <reference path="../../Lib/moment-2.8.4.min.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js" />


describe("Oven", function () {
    var ovenViewModel;

    beforeEach(function () {
        ovenViewModel = new OvenViewModel();
    });

    afterEach(function () {
        ovenViewModel.SetDefaults();
    });

    describe("when power is On", function () {
        describe("when time is running", function () {
            it("Oven shall be heating", function () {

                ovenViewModel.TimerStartValue(10);

                ovenViewModel.StartTimer();

                expect(ovenViewModel.IsHeating()).toEqual(true);
            });

            it("TimerRunning shall be true", function () {

                ovenViewModel.TimerStartValue(10);
                ovenViewModel.StartTimer();

                expect(ovenViewModel.TimerRunning()).toEqual(true);
            });

            it("TimerStarted shall be true", function () {

                ovenViewModel.TimerStartValue(10);
                ovenViewModel.StartTimer();

                expect(ovenViewModel.TimerStarted()).toEqual(true);
            });

            it("Timer shall not exceed the max time when timing up", function () {
                ovenViewModel.TimerStartValue(-1);
                ovenViewModel.StartTimer();
                ovenViewModel.ClearTimerCountdownTimer(); //We don't want a live timer

                var duration = moment.duration('16:38:58'); ///999 minutes less a second

                ovenViewModel.TimerCurrentValue(duration); //Shortcut

                //Now tick 62 times and make sure that we're not over 999 minutes
                for (var i = 0; i <= 62; i++) {
                    ovenViewModel.SetTimerTimerNextValue();
                }

                var nowInMinutes = ovenViewModel.TimerCurrentValue().asMinutes();

                expect(nowInMinutes).toEqual(999);
            });

            it("Timer shall not go below 0 seconds when timing down", function () {
                ovenViewModel.TimerStartValue(1);
                ovenViewModel.StartTimer();
                ovenViewModel.ClearTimerCountdownTimer(); //We don't want a live timer

                //Now tick 62 times and make sure that we're not over 999 minutes
                for (var i = 0; i <= 62; i++) {
                    ovenViewModel.SetTimerTimerNextValue();
                }

                var nowInSeconds = ovenViewModel.TimerCurrentValue().asSeconds();

                expect(nowInSeconds).toEqual(0);
            });
        });
    });
});
