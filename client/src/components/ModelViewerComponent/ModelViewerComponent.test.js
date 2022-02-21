import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { findByText, findByLabelText, waitFor, findByTestId, fireEvent } from "@testing-library/react";
import user from '@testing-library/user-event';
import ModelViewerComponent from "./ModelViewerComponent";
import { apiService } from "../../services/ApiService";
import { configService } from "../../services/ConfigService";

jest.mock("../../services/ApiService");
jest.mock("../../services/ConfigService");

const retrieveModels = jest.spyOn(apiService, "queryModels");
const deleteModels = jest.spyOn(apiService, "deleteModel");
const uploadModel = jest.spyOn(apiService, "addModels");
const addTwin = jest.spyOn(apiService, "addTwin");

const models = [
  {
    "displayName": {
      "en": "SaltMachine"
    },
    "description": {},
    "id": "dtmi:assetGen:SaltMachine;1",
    "uploadTime": "2022-02-10T19:57:28.372Z",
    "decommissioned": false,
    "model": {
      "@id": "dtmi:assetGen:SaltMachine;1",
      "@type": "Interface",
      "@context": [
        "dtmi:dtdl:context;2"
      ],
      "displayName": "SaltMachine",
      "contents": [
        {
          "@type": "Property",
          "name": "InFlow",
          "schema": "double"
        },
        {
          "@type": "Property",
          "name": "OutFlow",
          "schema": "double"
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


test("renders model List", async () => {
  // The <ModelViewerComponent /> component calls the config service and won't call the API unless the appAdtUrl is set
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  act(() => render(<ModelViewerComponent showItemMenu="true" />, container));

  await findByText(container, "SaltMachine");
  const nodeList = container.querySelectorAll(".mv_listItem");
  expect(nodeList.length).toBe(1);
  expect(retrieveModels).toHaveBeenCalledTimes(1);
});

test("renders model Information", async () => {
  const clicked = jest.fn();
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  await act(() => render(<ModelViewerComponent showItemMenu="true" />, container));

  await findByText(container, "SaltMachine");
  const button = container.querySelector(".ms-CommandBar-overflowButton");
  console.log(button);
  expect(clicked).toHaveBeenCalledTimes(0);
  await act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  expect(clicked).toHaveBeenCalledTimes(1);
  await findByText(container, "View Model");
  const options = container.querySelectorAll(".ms-ContextualMenu-link");
  await act(() => {
    options[1].dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  await findByText(container, "Model Information");

});

test("delete model", async () => {
  const clicked = jest.fn();
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  apiService.deleteModel.mockResolvedValue(mockSuccesResponse);
  await act(() => render(<ModelViewerComponent showItemMenu="true" />, container));

  await findByText(container, "SaltMachine");
  const button = container.querySelector(".ms-CommandBar-overflowButton");
  console.log(button);
  expect(clicked).toHaveBeenCalledTimes(0);
  await act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  expect(clicked).toHaveBeenCalledTimes(1);
  await findByText(container, "Delete Model");
  const options = container.querySelectorAll(".ms-ContextualMenu-link");
  await act(() => {
    options[3].dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  await findByText(container, "Are you sure?");
  const confirm = container.querySelector(".confirm-button");
  await act(() => {
    confirm.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  expect(deleteModels).toHaveBeenCalledTimes(1);
});

test("delete all models", async () => {
  const clicked = jest.fn();
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  apiService.deleteModel.mockResolvedValue(mockSuccesResponse);
  await act(() => render(<ModelViewerComponent showItemMenu="true" />, container));

  await findByText(container, "SaltMachine");
  const button = await findByLabelText(container, "modelViewerCommandBarComponent.farItems.deleteModels.text");
  console.log(button);
  expect(clicked).toHaveBeenCalledTimes(0);
  await act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  expect(clicked).toHaveBeenCalledTimes(1);
  await findByText(container, "Are you sure?");
  const confirm = container.querySelector(".confirm-button");
  await act(() => {
    confirm.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  expect(deleteModels).toHaveBeenCalledTimes(1);
});

test("upload model", async () => {
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  apiService.addModels.mockResolvedValue(mockSuccesResponse);
  await act(() => render(<ModelViewerComponent showItemMenu="true" />, container));

  await findByText(container, "SaltMachine");
  const button = await findByLabelText(container, "modelViewerCommandBarComponent.farItems.uploadModel.text");
  expect(uploadModel).toHaveBeenCalledTimes(0);
  await act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  const str = JSON.stringify(uploadValue);
  const blob = new Blob([str]);
  const file = new File([blob], "values.json", {
    type: "application/JSON",
  });
  File.prototype.text = jest.fn().mockResolvedValueOnce(str);
  const input = container.querySelectorAll(".mv-fileInput");
  console.log(input[0]);
  user.upload(input[0], file);
  expect(uploadModel).toHaveBeenCalledTimes(1);
});

test("upload model", async () => {
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  apiService.addModels.mockResolvedValue(mockSuccesResponse);
  await act(() => render(<ModelViewerComponent showItemMenu="true" />, container));

  await findByText(container, "SaltMachine");
  const button = await findByLabelText(container, "modelViewerCommandBarComponent.farItems.uploadModel.text");
  expect(uploadModel).toHaveBeenCalledTimes(0);
  await act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  const str = JSON.stringify(uploadValue);
  const blob = new Blob([str]);
  const file = new File([blob], "values.json", {
    type: "application/JSON",
  });
  File.prototype.text = jest.fn().mockResolvedValueOnce(str);
  const input = container.querySelectorAll(".mv-fileInput");
  console.log(input[1]);
  user.upload(input[1], file);
  expect(uploadModel).toHaveBeenCalledTimes(1);
});

test("create a twin", async () => {
  const clicked = jest.fn();
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  apiService.addTwin.mockResolvedValue(mockSuccesResponse);
  await act(() => render(<ModelViewerComponent showItemMenu="true" />, container));

  await findByText(container, "SaltMachine");
  const button = container.querySelector(".ms-CommandBar-overflowButton");
  console.log(button);
  expect(clicked).toHaveBeenCalledTimes(0);
  await act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  expect(clicked).toHaveBeenCalledTimes(1);
  await findByText(container, "View Model");
  const options = container.querySelectorAll(".ms-ContextualMenu-link");
  await act(() => {
    options[0].dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  await findByText(container, "New Twin Name");
  const input = container.querySelector(".ms-TextField-field");
  fireEvent.change(input, {target: {value: "Test Twin"}});
  const confirm = container.querySelector(".confirm-button");
  await act(() => {
    confirm.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });
  expect(addTwin).toHaveBeenCalledTimes(1);
});