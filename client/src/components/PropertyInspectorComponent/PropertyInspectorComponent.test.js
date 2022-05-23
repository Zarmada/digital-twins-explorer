import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import PubSub from "pubsub-js";
import PropertyInspectorComponent from "./PropertyInspectorComponent";

import { configService } from "../../services/ConfigService";
import { eventService } from "../../services/EventService";
import { apiService } from "../../services/ApiService";

import initIcons from "../../services/IconService/IconService";

initIcons();


jest.mock("../../services/ConfigService");
jest.mock("../../services/ApiService");

const mockSuccessResponse = { "Status": "Success" };

const twinSelection = {
    "$dtId": "Floor02",
    "$etag": "W/\"1608a49d-ed5f-4757-9c89-d37d51c8a8b0\"",
    "AverageTemperature": 0,
    "$metadata": {
        "$model": "dtmi:com:example:adtexplorer:Floor;1",
        "AverageTemperature": {
            "lastUpdateTime": "2022-03-08T00:43:20.5332261Z"
        }
    }
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
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(mockSuccessResponse);

  act(() => {
    render(<PropertyInspectorComponent isOpen />, container);
  });

  act(() => {
    eventService.publishSelection(twinSelection, "twin");
  });

  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(screen.debug(null,20000));
});
