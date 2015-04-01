/// <reference path="Lib/knockout-3.1.0.js" />

function OvenProgram() {
    var self = this;

    self.Name = ko.observable();
    self.Index = ko.observable();
    self.OvenProgramStages = ko.observableArray();

    self.GetPName = function () {
        var pName = 'P';
        if (self.Index() < 10) pName += '0';
        pName += self.Name();

        return pName;
    };

    self.AddOvenProgramStage = function (ovenProgramStage) {
        self.OvenProgramStages.push(ovenProgramStage);
    };

    self.SetProgramStageOn = function (index) {
        if (index < 0 || index > self.OvenProgramStages().length - 1) return; //Out of bounds
        var ovenProgramStage;

        if (index > 0) {
            //Ensure that all previous steps are on also

            for (var i = index - 1; i >= 0; i--) {
                ovenProgramStage = self.OvenProgramStages()[i];
                if (!ovenProgramStage.IsOn()) return; //Fail
            }
        }

        ovenProgramStage = self.OvenProgramStages()[index];

        if (!ovenProgramStage.IsValid()) return; //Fail - we cannot turn the step on if its not valid

        ovenProgramStage.IsOnValue(true);
    };
    
    self.GetLastOnProgramStage = function () {
        //Work down from the top of the list and return the first on stage
        for (var i = self.OvenProgramStages().length - 1; i >= 0; i--) {
            var ovenProgramStage = self.OvenProgramStages()[i];
            if (ovenProgramStage.IsOn()) return ovenProgramStage; //Fail
        }

        return null; //None are IsOn
    };

    self.SetProgramStageOff = function (index) {
        //Get the last on program stage - only this stage can be turned off
        var lastOnProgramStage = self.GetLastOnProgramStage();

        if (!lastOnProgramStage) return; //None are IsOn

        if (lastOnProgramStage.Index() != index) return; //Only the last can be turned off

        if (lastOnProgramStage.Index() === index) //Only turn off if the index argument is for the last on stage
            lastOnProgramStage.IsOnValue(false);
    };

    return self;
}
