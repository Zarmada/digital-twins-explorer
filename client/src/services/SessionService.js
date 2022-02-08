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
    return this.graphLayouts[layout] ? this.graphLayouts[layout][encodedQuery] : null;
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

  saveGraphLayoutNodesPosition = (layout, query, modelId, x, y) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    const modelData = {};
    modelData[modelId] = { x, y };
    if (this.graphLayouts[layout]) {
      this.graphLayouts[layout][encodedQuery] = modelData;
    } else {
      const encodedQueryObj = {};
      encodedQueryObj[encodedQuery] = modelData;
      this.graphLayouts[layout] = encodedQueryObj;
    }
  }

  clearGraphLayout = (layout, query) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    if (this.graphLayouts[layout] && this.graphLayouts[layout][encodedQuery]) {
      this.graphLayouts[layout][encodedQuery] = {};
    }
  }

}

export const sessionService = new SessionService();
