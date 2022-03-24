import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { findByText, findByLabelText, waitFor, findByTestId, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PubSub from "pubsub-js";
import PropertyInspectorComponent from "./PropertyInspectorComponent";

import { configService } from "../../services/ConfigService";
import { eventService } from "../../services/EventService";
import { apiService } from "../../services/ApiService";

import initIcons from "../../services/IconService/IconService";

initIcons();


jest.mock("../../services/ConfigService");
jest.mock("../../services/EventService");
jest.mock("../../services/ApiService");

const queryModels = jest.spyOn(apiService, "queryModels");

const mockSuccesResponse = { "Status": "Success"};

const twinSelection = {
  selection:{
  "$dtId": "Test",
  "$etag": "W/\"e7a889ed-0603-4e24-bd4e-1f4b510e6d82\"",
  "$metadata": {
      "$model": "dtmi:com:example:adtexplorer:Building;1"
    }
  },
  selectionType: "twin"
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


test("render component", async () => {
    // The <ModelViewerComponent /> component calls the config service and won't call the API unless the appAdtUrl is set
    configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
    apiService.queryModels.mockResolvedValue(mockSuccesResponse);

    act(() => {render(<PropertyInspectorComponent isOpen={true} />, container);});

    eventService.publishSelection(twinSelection);

    await waitFor(() => expect(eventService.publishSelection).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(eventService.subscribeSelection).toHaveBeenCalledTimes(2));


  });