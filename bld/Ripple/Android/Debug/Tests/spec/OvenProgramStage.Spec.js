/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../../OvenProgramFactory.js" />

describe("OvenProgramStage", function () {
    var ovenProgramFactory;
    var testOvenPrograms;

    beforeEach(function () {
        ovenProgramFactory = new OvenProgramFactory();
        testOvenPrograms = ovenProgramFactory.BuildEmptyOvenPrograms();
    });
    
    describe("with a blank OvenProgramStage", function () {
        var testProgramStage;

        beforeEach(function () {
            testProgramStage = new OvenProgramStage();
        });

        it("DisplayingProgramStage shall not be manual stage", function () {
            expect(testProgramStage.IsManualModeStep()).not.toBeTruthy();
        });

        it("EditingIndex shall be -1 by default", function () {
            expect(testProgramStage.EditingIndex()).toEqual(-1);
        });

        describe("on NextEditingValue", function () {
            beforeEach(function () {
                testProgramStage.NextEditingValue();
            });

            it("EditingIndex shall be 0", function () {
                expect(testProgramStage.EditingIndex()).toEqual(0);
            });

            describe("on NextEditingValue", function () {
                beforeEach(function () {
                    testProgramStage.NextEditingValue();
                });

                it("EditingIndex shall be 1", function () {
                    expect(testProgramStage.EditingIndex()).toEqual(1);
                });

                describe("on NextEditingValue", function () {
                    beforeEach(function () {
                        testProgramStage.NextEditingValue();
                    });

                    it("EditingIndex shall be 3 because the timer is not set to CP", function () {
                        expect(testProgramStage.EditingIndex()).toEqual(3);
                    });
                    
                    describe("on NextEditingValue", function () {
                        beforeEach(function () {
                            testProgramStage.NextEditingValue();
                        });

                        it("EditingIndex shall be 4", function () {
                            expect(testProgramStage.EditingIndex()).toEqual(4);
                        });

                        describe("on NextEditingValue", function () {
                            beforeEach(function () {
                                testProgramStage.NextEditingValue();
                            });

                            it("EditingIndex shall be 5", function () {
                                expect(testProgramStage.EditingIndex()).toEqual(5);
                            });

                            describe("on NextEditingValue", function () {
                                beforeEach(function () {
                                    testProgramStage.NextEditingValue();
                                });

                                it("EditingIndex shall be -1", function () {
                                    expect(testProgramStage.EditingIndex()).toEqual(-1);
                                });
                            });
                        });
                    });
                });
            });

        });
    });
});
