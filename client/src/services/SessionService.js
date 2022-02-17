// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

class SessionService {

  modelsLayouts = {}

  graphLayouts = {}

  getModelsLayoutPositions = () => this.modelsLayouts

  getCurrentModelsLayoutPositions = layout => {
    if (!this.modelsLayouts[layout]) {
      this.modelsLayouts[layout] = {};
    }
    return this.modelsLayouts[layout];
  }

  getCurrentNodePositions = (layout, modelId) => this.modelsLayouts[layout][modelId];

  setInitialModelsLayoutPositions = (layout, initialPositions) => {
    this.modelsLayouts[layout] = initialPositions;
  }

  saveModelsLayoutNodesPosition = (layout, modelId, x, y) => {
    if (!this.modelsLayouts[layout]) {
      this.modelsLayouts[layout] = {};
    }
    this.modelsLayouts[layout][modelId] = { x, y };
  }

  clearModelsLayout = layout => this.modelsLayouts[layout] = null

  getGraphLayoutPositions = () => this.graphLayouts

  getCurrentGraphLayoutPositions = (layout, query) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    this.setInitialEmptyGraphLayout(layout, encodedQuery);
    return this.graphLayouts[layout][encodedQuery];
  }

  setInitialGraphLayoutPositions = (layout, query, initialPositions) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    if (this.graphLayouts[layout]) {
      this.graphLayouts[layout][encodedQuery] = initialPositions;
    } else {
      this.graphLayouts[layout] = {
        encodedQuery: initialPositions
      };
    }
  }

  setInitialEmptyGraphLayout = (layout, encodedQuery) => {
    if (!this.graphLayouts[layout]) {
      this.graphLayouts[layout] = {};
    }
    if (!this.graphLayouts[layout][encodedQuery]) {
      this.graphLayouts[layout][encodedQuery] = {};
    }
  }

  saveGraphLayoutNodesPosition = (layout, query, modelId, x, y) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    this.setInitialEmptyGraphLayout(layout, encodedQuery);
    this.graphLayouts[layout][encodedQuery][modelId] = { x, y};
  }

  getGraphLayoutNodesPosition = (layout, query, modelId) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    return this.graphLayouts[layout][encodedQuery][modelId];
  }

  clearGraphLayout = (layout, query) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    if (this.graphLayouts[layout] && this.graphLayouts[layout][encodedQuery]) {
      this.graphLayouts[layout][encodedQuery] = {};
    }
  }

}

export const sessionService = new SessionService();
