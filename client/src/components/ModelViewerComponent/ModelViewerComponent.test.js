import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { findByText, findByLabelText, waitFor, findByTestId, fireEvent, screen } from "@testing-library/react";
import user from '@testing-library/user-event';
import ModelViewerComponent from "./ModelViewerComponent";
import { apiService } from "../../services/ApiService";
import { configService } from "../../services/ConfigService";
import { ModelService } from "../../services/ModelService";
import { ConsoleComponent } from "../ConsoleComponent/ConsoleComponent";

jest.mock("../../services/ApiService");
jest.mock("../../services/ConfigService");
jest.mock("../../services/ModelService");

const retrieveModels = jest.spyOn(apiService, "queryModels");
const deleteModel = jest.spyOn(apiService, "deleteModel");
const uploadModel = jest.spyOn(apiService, "addModels");
const addTwin = jest.spyOn(apiService, "addTwin");
const getModel = jest.spyOn(apiService, "getModelById");

const models = [
  {
    "displayName": {
      "en": "Floor"
    },
    "description": {},
    "id": "dtmi:com:example:adtexplorer:Floor;1",
    "uploadTime": "2022-02-10T19:57:28.372Z",
    "decommissioned": false,
    "model": {
      "@id": "dtmi:com:example:adtexplorer:Floor;1",
      "@type": "Interface",
      "@context": [
        "dtmi:dtdl:context;2"
      ],
      "displayName": "Floor",
      "contents": [
        {
            "@type": "Relationship",
            "name": "contains",
            "target": "dtmi:com:example:adtexplorer:Room;1"
        },
        {
            "@type": "Property",
            "name": "AverageTemperature",
            "schema": "double",
            "writable": true
        }
      ]
    }
  }
];

const mockSuccesResponse = { "Status": "Success"};

const uploadValue = [
  {
    "@id": "dtmi:com:example:adtexplorer:Floor;1",
    "@type": "Interface",
    "displayName": "Floor",
    "contents": [
      {
        "@type": "Relationship",
        "name": "contains",
        "target": "dtmi:com:example:adtexplorer:Room;1"
      },
      {
        "@type": "Property",
        "name": "AverageTemperature",
        "schema": "double",
        "writable": true
      }
    ],
    "@context": "dtmi:dtdl:context;2"
  }
];

const modelData = {
  "model": {
      "@id": "dtmi:com:example:adtexplorer:Floor;1",
      "@type": "Interface",
      "displayName": "Floor",
      "contents": [
          {
              "@type": "Relationship",
              "name": "contains",
              "target": "dtmi:com:example:adtexplorer:Room;1"
          },
          {
              "@type": "Property",
              "name": "AverageTemperature",
              "schema": "double",
              "writable": true
          }
      ],
      "@context": [
          "dtmi:dtdl:context;2"
      ]
  }
}


let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// console.log(screen.debug(null,20000));

test("renders model List", async () => {
  // The <ModelViewerComponent /> component calls the config service and won't call the API unless the appAdtUrl is set
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  act(() => {render(<ModelViewerComponent showItemMenu="true" />, container);});

  await findByText(container, "Floor");
  const nodeList = container.querySelectorAll(".mv_listItem");
  expect(nodeList.length).toBe(1);
  expect(retrieveModels).toHaveBeenCalledTimes(1);
});

test("renders model Information", async () => {
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  apiService.getModelById.mockResolvedValue(modelData);
  act(() => {render(<ModelViewerComponent showItemMenu="true" />, container);});

  await findByText(container, "Floor");
  const button = container.querySelector(".ms-CommandBar-overflowButton");
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  const options = await screen.findByLabelText("modelViewerItemCommandBarComponent.farItems.viewModel");
  act(() => {
    options.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  await screen.findByText("modelViewerViewComponent.defaultButton");
  expect(getModel).toHaveBeenCalledTimes(1);
});

test("delete model", async () => {
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  apiService.deleteModel.mockResolvedValue(modelData);
  act(() => {render(<ModelViewerComponent showItemMenu="true" />, container);});

  await findByText(container, "Floor");
  const button = container.querySelector(".ms-CommandBar-overflowButton");
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  const options = await screen.findByLabelText("modelViewerItemCommandBarComponent.farItems.deleteModels");
  act(() => {
    options.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  const confirm = await screen.getByTestId("confirm");
  act(() => {
    confirm.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  expect(deleteModel).toHaveBeenCalledTimes(1);
});

test("delete all models", async () => {
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  ModelService.prototype.deleteAll.mockResolvedValue(mockSuccesResponse);
  act(() => {
    render(<ModelViewerComponent showItemMenu="true" />, container);
  });

  await findByText(container, "Floor");
  const button = await findByLabelText(container, "modelViewerCommandBarComponent.farItems.deleteModels.ariaLabel");
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await findByText(container, "Are you sure?");
  const deleteButton = container.querySelector(".save-button");
  act(() => {
    deleteButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  expect(ModelService.prototype.deleteAll.mock.calls.length).toBe(1);
});
