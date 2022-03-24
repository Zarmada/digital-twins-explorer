import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { findByText, findByLabelText, waitFor, findByTestId, fireEvent, screen } from "@testing-library/react";
import user from '@testing-library/user-event';
import PubSub from "pubsub-js";
import QueryComponent from "./QueryComponent";
import { configService } from "../../services/ConfigService";
import initIcons from "../../services/IconService/IconService";
import { settingsService } from "../../services/SettingsService";

initIcons();

jest.mock("../../services/ConfigService");
jest.mock("../../services/SettingsService");

const mockQueriesResponse = [{ name: "FloorQuery", query: "SELECT * FROM digitaltwins T where T.$dtId in ['Floor01', 'Floor04']"}];

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

// console.log(screen.debug(null,20000));


test("load saved query", async () => {
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  settingsService.queries = mockQueriesResponse;
  act(() => {render(<QueryComponent/>, container);});
  
  const savedDropdown = await screen.getByTestId("savedQueryDropdown");

  act(() => {
    savedDropdown.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const dropdownOption = await screen.findByTitle("FloorQuery");

  act(() => {
    dropdownOption.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });  
  
  const queryInput = await screen.getByTestId("queryInput");

  expect(queryInput.value).toBe("SELECT * FROM digitaltwins T where T.$dtId in ['Floor01', 'Floor04']");

})

test("save query", async () => {
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  settingsService.queries = mockQueriesResponse;
  act(() => {render(<QueryComponent/>, container);});

  const savedDropdown = await screen.getByTestId("savedQueryDropdown");

  act(() => {
    savedDropdown.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  
  let dropdownOption = await screen.queryAllByTitle("TestQuery");

  expect(dropdownOption.length).toBe(0);

  let saveButton = await screen.getByTestId("saveQueryButton");

  act(() => {
    saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  let input = await screen.findByTestId("queryNameField");
  input.value = "TestQuery";
  Simulate.change(input);
  expect(input.value).toBe("TestQuery");
  saveButton = await screen.findByTestId("saveQuery");
  act(() => {
    saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  act(() => {
    savedDropdown.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  dropdownOption = await screen.queryAllByTitle("TestQuery");

  expect(dropdownOption.length).toBe(1);


})

test("delete query", async () => {
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  settingsService.queries = mockQueriesResponse;
  act(() => {render(<QueryComponent/>, container);});

  const savedDropdown = await screen.getByTestId("savedQueryDropdown");

  act(() => {
    savedDropdown.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  
  let dropdownOption = await screen.queryAllByTitle("Remove query");

  expect(dropdownOption.length).toBe(1);

  act(() => {
    dropdownOption[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const deleteQueryButton = await screen.findByTestId("deleteQueryButton");

  act(() => {
    deleteQueryButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  act(() => {
    savedDropdown.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  dropdownOption = await screen.queryAllByTitle("Remove query");

  expect(dropdownOption.length).toBe(0);

})