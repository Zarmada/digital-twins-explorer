import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import ModelViewerComponent from "./ModelViewerComponent";
import { waitFor } from '@testing-library/react'
import MockedApiService from "../../services/ApiService";;

jest.mock("../../services/ApiService", () => {
  return function queryModels(bypassCache){
    return (
          [
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
      ]
    )
  }
})

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
  await act(async () =>{
      render(<ModelViewerComponent
        showItemMenu="true" />, container);
  });
  console.log("Console Info");
  const menulist = container.querySelector("[class='ms-OverflowSet-item']");
  await waitFor(() => expect(menulist).toBe(!null) );
  const nodelist = container.querySelectorAll("[class='mv_listItem']");
  console.log(nodelist.length);
  console.log(menulist);
  console.log(container.querySelector("[class='mv-toolbar']"));

})