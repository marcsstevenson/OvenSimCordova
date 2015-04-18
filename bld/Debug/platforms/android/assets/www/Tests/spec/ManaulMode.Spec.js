
/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js"/>
/// <reference path="../../OvenViewModel.js" />

describe("ManaulMode", function () {
    var ovenViewModel;

    beforeEach(function () {
        ovenViewModel = new OvenViewModel();
    });
    
    describe("when TurnOvenOn", function () {
        beforeEach(function () {
            ovenViewModel.TurnOvenOn();
        });
        
        it("Top Display shall be the default target temperature - 150", function () {
            var topDisplayValue = ovenViewModel.TopDisplayFunction()();

            expect(topDisplayValue).toEqual(150);
        });
        
        describe("when Temp_PlusClick", function () {
            beforeEach(function () {
                ovenViewModel.Temp_PlusClickFunction()();
            });

            it("Top Display shall be the new target temperature - 160", function () {
                var topDisplayValue = ovenViewModel.TopDisplayFunction()();

                expect(topDisplayValue).toEqual(160);
            });
        });

        describe("when Temp_MinusClick", function () {
            beforeEach(function () {
                ovenViewModel.Temp_MinusClickFunction()();
            });

            it("Top Display shall be the new target temperature - 140", function () {
                var topDisplayValue = ovenViewModel.TopDisplayFunction()();

                expect(topDisplayValue).toEqual(140);
            });
        });

        it("Bottom Display shall be the default timer value - '---'", function () {
            var topDisplayValue = ovenViewModel.BottomDisplayFunction()();

            expect(topDisplayValue).toEqual('---');
        });
    });
});

