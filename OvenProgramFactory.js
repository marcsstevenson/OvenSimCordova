/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="OvenProgram.js" />
/// <reference path="OvenProgramStage.js" />

function OvenProgramFactory() {
    var self = this;

    self.BuildEmptyOvenPrograms = function () {
        var ovenPrograms = [];

        //Default to 30 oven programs for now
        for (var i = 0; i < 20; i++) {
            ovenPrograms.push(self.BuildEmptyOvenProgram(i));
        }

        return ovenPrograms;
    };

    self.BuildEmptyOvenProgram = function (index) {
        var ovenProgram = new OvenProgram();

        ovenProgram.Name(index + 1);
        ovenProgram.Index(index);

        //Default to 3 steps for now
        for (var i = 0; i < 3; i++) {
            ovenProgram.AddOvenProgramStage(self.BuildEmptyOvenProgramStage(i));
        }

        return ovenProgram;
    };

    self.BuildEmptyOvenProgramStage = function (index) {
        var ovenProgramStage = new OvenProgramStage(false);
        
        ovenProgramStage.Name(index + 1);
        ovenProgramStage.Index(index);

        //TODO
        ovenProgramStage.Temperature = ko.observable();
        ovenProgramStage.DurationSeconds = ko.observable();
        ovenProgramStage.MoistureMode = ko.observable(); //1-5

        return ovenProgramStage;
    };

    return self;
}
