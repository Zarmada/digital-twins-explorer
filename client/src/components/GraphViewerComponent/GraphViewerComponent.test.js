import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { findByText, findByLabelText, waitFor, findByTestId, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PubSub from "pubsub-js";
import GraphViewerComponent from "./GraphViewerComponent";

import { configService } from "../../services/ConfigService";
import initIcons from "../../services/IconService/IconService";

initIcons();


jest.mock("../../services/ConfigService");


const optionalComponentsState = [{
    id: "console",
    name: "Console",
    show: false,
    showProp: "showConsole"
  },{
    id: "console",
    name: "Console",
    show: false,
    showProp: "showConsole"
  }
];

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  PubSub.clearAllSubscriptions();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


test("render component", async () => {
    // The <ModelViewerComponent /> component calls the config service and won't call the API unless the appAdtUrl is set
    configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
    //act(() => {render(<GraphViewerComponent selectedDisplayNameProperty={"$dtId"}/>, container);});
    
    console.log(screen.debug(null,20000));
  });