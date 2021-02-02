"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generated using theia-extension-generator
 */
var assistance_contribution_1 = require("./assistance-contribution");
var inversify_1 = require("inversify");
var frontend_application_1 = require("@theia/core/lib/browser/frontend-application");
exports.default = new inversify_1.ContainerModule(function (bind) {
    // add your contribution bindings here
    bind(frontend_application_1.FrontendApplicationContribution).to(assistance_contribution_1.markingElements);
});
//# sourceMappingURL=assistance-frontend-module.js.map