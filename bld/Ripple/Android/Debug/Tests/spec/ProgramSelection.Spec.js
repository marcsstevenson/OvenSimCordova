/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js"/>
/// <reference path="../../OvenViewModel.js" />

describe("ProgramSelection", function () {
    var ovenViewModel;

    beforeEach(function () {
        ovenViewModel = new OvenViewModel();
        ovenViewModel.LogFunction = null;
        ovenViewModel.TurnOvenOn();
    });
    
    //Display Program
    describe("When programming, only the last on program shall be able to be turned off", function () {
        beforeEach(function () {
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
            ovenViewModel.btnTemp_PlusClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTimer_PlusClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTemp_PlusClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.btnTimer_PlusClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.ProgrammingShortClick();
        });

        it("Trying to turn off stage 2 of 3 - the bottom display shall be On", function () {
            //Go back to stage 2
            ovenViewModel.btnTemp_MinusClick();
            //Try to turn stage off
            ovenViewModel.btnTimer_MinusClick();

            var display = ovenViewModel.BottomDisplay();
            expect(display).toEqual('On');
        });

        it("Trying to turn off stage 3 of 3 - the bottom display shall be OFF", function () {
            //Try to turn stage off
            ovenViewModel.btnTimer_MinusClick();

            var display = ovenViewModel.BottomDisplay();
            expect(display).toEqual('OFF');
        });
    });

    //Display Program
    describe("On ProgrammingShortClick", function () {
        beforeEach(function () {
            ovenViewModel.ProgrammingShortClick();
        });

        it("the top display shall be P01", function () {
            var display = ovenViewModel.TopDisplay();
            expect(display).toEqual('P01');
        });

        describe("On Temp_PlusClick", function () {
            beforeEach(function () {
                ovenViewModel.btnTemp_PlusClick();
            });

            it("the top display shall be P02", function () {
                var display = ovenViewModel.TopDisplay();
                expect(display).toEqual('P02');
            });

            //Edit Program
            describe("On ProgrammingLongClick", function () {

                beforeEach(function () {
                    ovenViewModel.ProgrammingLongClick();
                });

                it("the top display shall be 2.1", function () {
                    var display = ovenViewModel.TopDisplay();
                    expect(display).toEqual('2.1');
                });

                it("the bottom display shall be OFF", function () {
                    var display = ovenViewModel.BottomDisplay();
                    expect(display).toEqual('OFF');
                });

                //Edit Program Stage Values

                it("DisplayingProgramStage shall not be our manual stage", function () {
                    expect(ovenViewModel.DisplayingProgramStage().IsManualModeStep()).not.toBeTruthy();
                });

                //Edit Program Stage Values
                describe("On ProgrammingShortClick", function () {
                    beforeEach(function () {
                        //Set to temp edit
                        ovenViewModel.ProgrammingShortClick();
                    });

                    it("the top display shall be the default target temperature - 150", function () {
                        var topDisplay = ovenViewModel.TopDisplay();
                        expect(String(topDisplay)).toEqual('150');
                    });

                    it("the top display shall be blinking", function () {
                        expect(ovenViewModel.TopDisplayIsBlinking()).toBeTruthy();
                    });

                    it("the bottom display shall be the default timer value - '---'", function () {
                        var bottomDisplay = ovenViewModel.BottomDisplay();
                        expect(String(bottomDisplay)).toEqual('---');
                    });

                    it("the bottom display shall not be blinking", function () {
                        expect(ovenViewModel.BottomDisplayIsBlinking()).not.toBeTruthy();
                    });

                    describe("On ProgrammingShortClick", function () {
                        beforeEach(function () {
                            //Set to timer edit
                            ovenViewModel.ProgrammingShortClick();
                        });

                        it("the top display shall be the default target temperature - 150", function () {
                            var topDisplay = ovenViewModel.TopDisplay();
                            expect(String(topDisplay)).toEqual('150');
                        });

                        it("the top display shall not be blinking", function () {
                            expect(ovenViewModel.TopDisplayIsBlinking()).not.toBeTruthy();
                        });

                        //TODO: Move to the end of this sequence (once we are back at EditingIndex = -1)
                        describe("with a valid stage, clicking timer plus", function () {
                            beforeEach(function () {
                                ovenViewModel.Timer_PlusClickFunction()(); //Change to the UI function

                                ovenViewModel.ProgrammingShortClick();
                                ovenViewModel.ProgrammingShortClick();
                                ovenViewModel.ProgrammingShortClick();
                                ovenViewModel.ProgrammingShortClick();
                            });

                            it("shall set the stage to On", function () {
                                var topDisplay = ovenViewModel.BottomDisplay();
                                expect(String(topDisplay)).toEqual('On');
                            });

                            describe("after Temp_MinusClick", function () {
                                beforeEach(function () {
                                    console.clear();
                                    ovenViewModel.btnTimer_MinusClick();
                                    console.log(ovenViewModel.ProgrammingArea());
                                    console.log(ovenViewModel.EditingOvenProgramStage().IsOnValue());
                                });

                                it("shall set the stage to OFF", function () {
                                    var topDisplay = ovenViewModel.BottomDisplay();
                                    expect(String(topDisplay)).toEqual('OFF');
                                });
                            });
                        });


                        //TODO - expand for the other values, timer etc
                    });
                });

                //Back to Display Program
                describe("On ProgrammingLongClick", function () {

                    beforeEach(function () {
                        ovenViewModel.ProgrammingLongClick();
                    });

                    it("the top display shall be P02", function () {
                        var topDisplay = ovenViewModel.TopDisplay();
                        expect(topDisplay).toEqual('P02');
                    });
                });
            });
        });
    });
});

