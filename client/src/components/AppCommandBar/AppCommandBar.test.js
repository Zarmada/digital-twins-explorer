import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { findByText, findByLabelText, waitFor, findByTestId, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PubSub from "pubsub-js";
import AppCommandBar from "./AppCommandBar";

import { configService } from "../../services/ConfigService";
import { apiService } from "../../services/ApiService";
import { eventService } from "../../services/EventService";

import initIcons from "../../services/IconService/IconService";

initIcons();

jest.mock("../../services/ConfigService");
jest.mock("../../services/ApiService");
jest.mock("../../services/EventService");

const getAllTwins = jest.spyOn(apiService, "getAllTwins");
const setConfig = jest.spyOn(configService, "setConfig");



const mockSuccesResponse = { "Status": "Success"};

const optionalComponentsState = [{
    id: "console",
    name: "Console",
    show: false,
    showProp: "showConsole"
  },{
    id: "output",
    name: "Output",
    show: false,
    showProp: "showOutput"
  }
];

let toggleCounter = 0;

const toggleOptionalComponent = () => {
  toggleCounter++;
};

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


test("delete all twins component", async () => {
    // The <ModelViewerComponent /> component calls the config service and won't call the API unless the appAdtUrl is set
    configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
    apiService.getAllTwins.mockResolvedValue(mockSuccesResponse);

    act(() => {render(<AppCommandBar optionalComponents={optionalComponentsState}
        optionalComponentsState={optionalComponentsState}/>, container);});
    
    const button = container.querySelector(".delete-button");
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    const deleteButton = await screen.findByTestId("deleteTwins");

    act(() => {
      deleteButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(getAllTwins).toHaveBeenCalledTimes(1);

  });

  test("switch environment", async () => {
    // The <ModelViewerComponent /> component calls the config service and won't call the API unless the appAdtUrl is set
    configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
    configService.setConfig.mockResolvedValue(mockSuccesResponse);

    act(() => {render(<AppCommandBar optionalComponents={optionalComponentsState}
        optionalComponentsState={optionalComponentsState}/>, container);});
    
    const button = container.querySelector(".sign-in");
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    let input = await screen.findByTestId("urlInput");
    input.value = "https://test.api.scus.digitaltwins.azure.net";
    Simulate.change(input);
    expect(input.value).toBe("https://test.api.scus.digitaltwins.azure.net");
    const saveButton = await screen.findByTestId("saveConfiguration");
    act(() => {
      saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(setConfig).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(eventService.publishEnvironmentChange).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(eventService.publishConfigure).toHaveBeenCalledTimes(1));
    
  });

  test("switch console", async () => {
    // The <ModelViewerComponent /> component calls the config service and won't call the API unless the appAdtUrl is set
    configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
    configService.setConfig.mockResolvedValue(mockSuccesResponse);

    act(() => {render(<AppCommandBar optionalComponents={optionalComponentsState}
        optionalComponentsState={optionalComponentsState}
        toggleOptionalComponent={toggleOptionalComponent}/>, container);});
    
    const button = container.querySelector(".settings-button");
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const consoleButton = await screen.findByTestId("showConsoleField");

    act(() => {
      consoleButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(toggleCounter).toBe(1);

    act(() => {
      consoleButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(toggleCounter).toBe(2);

  });

  
  test("switch output", async () => {
    // The <ModelViewerComponent /> component calls the config service and won't call the API unless the appAdtUrl is set
    configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
    configService.setConfig.mockResolvedValue(mockSuccesResponse);

    act(() => {render(<AppCommandBar optionalComponents={optionalComponentsState}
        optionalComponentsState={optionalComponentsState}
        toggleOptionalComponent={toggleOptionalComponent}/>, container);});
    
    const button = container.querySelector(".settings-button");
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const consoleButton = await screen.findByTestId("showOutputField");

    act(() => {
      consoleButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(toggleCounter).toBe(3);

    act(() => {
      consoleButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(toggleCounter).toBe(4);

  });