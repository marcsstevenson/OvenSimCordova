
/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js"/>
/// <reference path="../../OvenViewModel.js" />

describe("TempLight.Spec", function () {
    var ovenViewModel;

    beforeEach(function () {
        ovenViewModel = new OvenViewModel();
    });

    describe("with the oven on", function () {
        beforeEach(function () {
            ovenViewModel.TurnOvenOn();
        });
        
        describe("before Oven is at target temperature", function () {
            it("the oven light shall be on", function () {
                expect(ovenViewModel.LightOn_Temp()).toEqual(true);
            });
        });
        
        describe("when Oven is at target temperature", function () {
            beforeEach(function () {
                ovenViewModel.SetTemperature(1000); //This just needs to be greater than the target
            });
            
            it("the oven light shall not be on", function () {
                expect(ovenViewModel.LightIsOn()).toEqual(false);
            });
        });
    });
});