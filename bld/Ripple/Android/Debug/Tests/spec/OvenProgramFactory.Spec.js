/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../../OvenProgramFactory.js" />

describe("OvenProgramFactory", function () {
    var ovenProgramFactory;
    var testOvenPrograms;

    beforeEach(function () {
        ovenProgramFactory = new OvenProgramFactory();
        testOvenPrograms = ovenProgramFactory.BuildEmptyOvenPrograms();
    });
    
    describe("BuildEmptyOvenPrograms", function () {
        it("shall return 20 programs", function () {

            expect(testOvenPrograms.length).toEqual(20);
        });

        it("each program shall have 3 steps", function () {
            for (var i = 0; i < testOvenPrograms.length; i++) {
                expect(testOvenPrograms[i].OvenProgramStages().length).toEqual(3);
            }
        });

        describe("With the first program", function () {
            var testProgram;

            beforeEach(function () {
                testProgram = testOvenPrograms[0];
            });

            it("GetLastOnProgramStage shall be null because not stages are on", function () {
                var lastOnProgramStage = testProgram.GetLastOnProgramStage();

                expect(lastOnProgramStage).toBeNull();
            });

            it("SetProgramStageOn for index 0 shall not turn on the stage because the stage is not valid", function () {
                testProgram.SetProgramStageOn(0);
                var lastOnProgramStage = testProgram.GetLastOnProgramStage();
                expect(lastOnProgramStage).toBeNull();
            });

            describe("With the first program stage", function () {
                var testProgramStage;

                beforeEach(function () {
                    testProgramStage = testProgram.OvenProgramStages()[0];
                });

                describe("Setting TimerStartValue to 1", function () {
                    beforeEach(function () {
                        testProgramStage.TimerStartValue(1);
                    });

                    it("shall make the stage valid", function () {
                        expect(testProgramStage.IsValid()).toBeTruthy();
                    });

                    it("SetProgramStageOn for index 0 shall turn on the stage because the stage is valid", function () {
                        testProgram.SetProgramStageOn(0);
                        var lastOnProgramStage = testProgram.GetLastOnProgramStage();
                        expect(lastOnProgramStage).not.toBeNull();
                    });

                    describe("Setting SetProgramStageOff", function () {
                        beforeEach(function () {
                            testProgram.SetProgramStageOff();
                        });

                        it("GetLastOnProgramStage shall be null because there are no on stages", function () {
                            var lastOnProgramStage = testProgram.GetLastOnProgramStage();
                            expect(lastOnProgramStage).toBeNull();
                        });
                    });
                });
            });
        });
    });
});
