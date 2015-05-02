
/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js"/>
/// <reference path="../../OvenViewModel.js" />

describe("Oven", function () {
    var ovenViewModel;

    beforeEach(function () {
        ovenViewModel = new OvenViewModel();
    });

    it("The oven shall have 20 programs to use", function () {
        expect(ovenViewModel.OvenPrograms().length).toEqual(20);
    });

    it("The oven shall not be heating", function () {
        expect(ovenViewModel.IsHeating()).toEqual(false);
    });

    describe("when TurnOvenOn", function () {
        beforeEach(function () {
            ovenViewModel.TurnOvenOn();
        });

        it("OvenIsOn shall be true", function () {
            expect(ovenViewModel.OvenIsOn()).toEqual(true);
        });

        it("Top Display shall be the default target temperature - 150", function () {
            var topDisplayValue = ovenViewModel.TopDisplayFunction()();

            expect(topDisplayValue).toEqual(150);
        });

        it("Bottom Display shall be the default timer value - '---'", function () {
            var topDisplayValue = ovenViewModel.BottomDisplayFunction()();

            expect(topDisplayValue).toEqual('---');
        });

        it("The oven shall be heating", function () {
            expect(ovenViewModel.IsHeating()).toEqual(true);
        });
    });
});

