
/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js"/>
/// <reference path="../../OvenViewModel.js" />

describe("OvenLight.Spec", function () {
    var ovenViewModel;

    beforeEach(function () {
        ovenViewModel = new OvenViewModel();
    });
    
    describe("when TurnOvenOn", function () {
        beforeEach(function () {
            ovenViewModel.TurnOvenOn();
        });

        describe("when Light button is tapped", function () {
            beforeEach(function () {
                ovenViewModel.LightPowerButtonTap();
            });

            it("the oven light shall be on", function () {
                expect(ovenViewModel.LightIsOn()).toEqual(true);
            });

            describe("when Light button is tapped again", function () {
                beforeEach(function () {
                    ovenViewModel.LightPowerButtonTap();
                });

                it("the oven light shall be off", function () {
                    expect(ovenViewModel.LightIsOn()).toEqual(false);
                });
            });
        });
    });
});

