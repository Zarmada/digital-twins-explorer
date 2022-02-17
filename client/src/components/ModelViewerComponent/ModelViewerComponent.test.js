import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { findByText } from "@testing-library/react";
import ModelViewerComponent from "./ModelViewerComponent";
import { apiService } from "../../services/ApiService";
import { configService } from "../../services/ConfigService";

jest.mock("../../services/ApiService");
jest.mock("../../services/ConfigService");

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


test("renders model information", async () => {
  // The <ModelViewerComponent /> component calls the config service and won't call the API unless the appAdtUrl is set
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  apiService.queryModels.mockResolvedValue(models);
  act(() => render(<ModelViewerComponent showItemMenu="true" />, container));

  // The findByText method is a combination of waitFor and a query by text
  await findByText(container, "SaltMachine");
  const nodeList = container.querySelectorAll(".mv_listItem");
  expect(nodeList.length).toBe(1);
});
