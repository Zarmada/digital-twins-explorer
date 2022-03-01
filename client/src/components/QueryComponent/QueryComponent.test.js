import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { findByText, findByLabelText, waitFor, findByTestId, fireEvent, screen } from "@testing-library/react";
import user from '@testing-library/user-event';
import PubSub from "pubsub-js";
import QueryComponent from "./QueryComponent";
import { configService } from "../../services/ConfigService";

jest.mock("../../services/ConfigService");

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

test("simple query", async () => {
  configService.getConfig.mockResolvedValue({ appAdtUrl: "https://foo" });
  act(() => {render(<QueryComponent/>, container);});

  const queryButton = screen.getByTestId("queryButton");
  act(() => {
    queryButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  });

})