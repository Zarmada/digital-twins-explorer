// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const MODEL_VIEWER_KEY = "models-layout";
const GRAPH_VIEWER_KEY = "graph-layout";

class StorageService {

  getLocalStoragePrimitive = name => localStorage.getItem(name)

  getLocalStorageObject = name => JSON.parse(localStorage.getItem(name))

  setLocalStorageObject = (name, dataObj) => localStorage.setItem(name, JSON.stringify(dataObj))

  removeLocalStorageObject = name => localStorage.removeItem(name)

  getModelsLayoutPositions = layout => localStorage.getItem(`${MODEL_VIEWER_KEY}-${layout}`) ? JSON.parse(localStorage.getItem(`${MODEL_VIEWER_KEY}-${layout}`)) : {}

  saveModelsLayoutPositions = allLayoutPositions => {
    Object.keys(allLayoutPositions).forEach(key => this.setLocalStorageObject(`${MODEL_VIEWER_KEY}-${key}`, allLayoutPositions[key]));
  }

  clearModelsLayout = layout => {
    this.removeLocalStorageObject(`${MODEL_VIEWER_KEY}-${layout}`);
  }

  getGraphLayoutPositions = layout => localStorage.getItem(`${GRAPH_VIEWER_KEY}-${layout}`)
    ? JSON.parse(localStorage.getItem(`${GRAPH_VIEWER_KEY}-${layout}`)) : {};

  getGraphLayoutPositionsByQuery = (layout, query) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    const graphLayoutPositions = this.getGraphLayoutPositions(layout);
    return graphLayoutPositions[encodedQuery] ? graphLayoutPositions[encodedQuery] : {};
  };

  saveGraphLayoutPositions = (layout, query, positions) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    const graphLayoutPositions = this.getGraphLayoutPositions(layout);
    graphLayoutPositions[encodedQuery] = positions;
    this.setLocalStorageObject(`${GRAPH_VIEWER_KEY}-${layout}`, graphLayoutPositions);
  }

  clearGraphLayout = (layout, query) => {
    const encodedQuery = Buffer.from(query).toString("base64");
    const graphLayoutPositions = this.getGraphLayoutPositions(layout);
    graphLayoutPositions[encodedQuery] = {};
    this.setLocalStorageObject(`${GRAPH_VIEWER_KEY}-${layout}`, graphLayoutPositions);
  }

}

export const storageService = new StorageService();
