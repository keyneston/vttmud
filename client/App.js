"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
require("./App.css");
var CraftTemplate_1 = require("./CraftTemplate");
function App() {
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement(CraftTemplate_1.CraftTemplate, null)));
}
exports.default = App;
