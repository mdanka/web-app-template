import "es6-shim";
import * as React from "react";
import * as ReactDOM from "react-dom";

const appElement = document.getElementById("app");

if (appElement != null) {
    ReactDOM.render((
        <div>Hello Template</div>
    ), appElement);
}
