"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraftTemplate = void 0;
var react_1 = require("react");
require("./CraftTemplate.css");
function CraftTemplate() {
    var _a = (0, react_1.useState)(""), name = _a[0], setName = _a[1];
    var _b = (0, react_1.useState)(""), item = _b[0], setItem = _b[1];
    var _c = (0, react_1.useState)(0), level = _c[0], setLevel = _c[1];
    var _d = (0, react_1.useState)(4), days = _d[0], setDays = _d[1];
    (0, react_1.useEffect)(function persistForm() {
        localStorage.setItem("craftTemplateForm", name);
    });
    var date = new Date();
    return (react_1.default.createElement("div", { className: "crafting-template" },
        react_1.default.createElement("div", { id: "template-output" },
            react_1.default.createElement("em", null, "Character: "),
            " ",
            name,
            " ",
            react_1.default.createElement("br", null),
            react_1.default.createElement("em", null, "Activity: "),
            " Craft ",
            item,
            " (",
            level ? level : 0,
            ")",
            react_1.default.createElement("br", null),
            react_1.default.createElement("em", null, "Days: "),
            " ",
            formatDate(subDate(date, days)),
            "-",
            formatDate(date),
            react_1.default.createElement("br", null),
            react_1.default.createElement("em", null, "DC: "),
            " ",
            craftDC(level),
            react_1.default.createElement("br", null),
            react_1.default.createElement("em", null, "Result: Success Assurance"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("br", null)),
        react_1.default.createElement("form", null,
            react_1.default.createElement("div", { className: "box" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { htmlFor: "name", className: "template-label" }, "Character Name")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("input", { type: "Text", id: "name", onChange: function (x) { return setName(x.target.value); } })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { htmlFor: "item", className: "template-label" }, "Item Name")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("input", { type: "Text", id: "Item", onChange: function (x) { return setItem(x.target.value); } })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { htmlFor: "level", className: "template-label" }, "Item Level")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("input", { type: "number", min: "-1", max: "20", onChange: function (x) { return setLevel(x.target.valueAsNumber); } })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { htmlFor: "days", className: "template-label" }, "Days")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("input", { type: "number", min: "0", max: "7", onChange: function (x) { return setDays(x.target.valueAsNumber); } })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "template-label" }, "Formula Cost")),
                react_1.default.createElement("div", null,
                    formulaCost(level),
                    " gp")))));
}
exports.CraftTemplate = CraftTemplate;
function subDate(date, days) {
    if (isNaN(days)) {
        days = 0;
    }
    var d2 = new Date(date);
    d2.setDate(d2.getDate() - days);
    return d2;
}
function formatDate(date) {
    return "".concat(date.getMonth() + 1, "/").concat(date.getDate());
}
function formulaCost(level) {
    if (level < 0 || isNaN(level)) {
        level = 0;
    }
    if (level > 20) {
        level = 20;
    }
    return [0.5, 1, 2, 3, 5, 8, 13, 18, 25, 35, 50, 70, 100, 150, 225, 325, 500, 750, 1200, 2000, 3500][level];
}
function craftDC(level) {
    if (level < 0 || isNaN(level)) {
        level = 0;
    }
    if (level > 20) {
        level = 20;
    }
    return [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40][level];
}
