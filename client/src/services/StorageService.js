// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const GRAPH_VIEW_KEY = "GraphView";
const MODEL_VIEW_KEY = "ModelView";

class StorageService {

  getLocalStoragePrimitive = name => localStorage.getItem(name)

  getLocalStorageObject = name => JSON.parse(localStorage.getItem(name))

  setLocalStorageObject = (name, dataObj) => localStorage.setItem(name, JSON.stringify(dataObj))

  removeLocalStorageObject = name => localStorage.removeItem(name)

  saveGraphViewNodePosition = (id, x, y) => {
    let currentGraphViewPositions = this.getLocalStorageObject(GRAPH_VIEW_KEY);
    if (!currentGraphViewPositions) {
      currentGraphViewPositions = {};
    }
    currentGraphViewPositions[id] = { x, y };
    this.setLocalStorageObject(GRAPH_VIEW_KEY, currentGraphViewPositions);
  }

  getGraphViewNodesPositions = () => localStorage.getItem(GRAPH_VIEW_KEY) ? JSON.parse(localStorage.getItem(GRAPH_VIEW_KEY)) : {}

  saveModelViewNodePosition = (query, id, x, y) => {
    const encodedQuery = btoa(query);
    let currentModelViewPositions = this.getLocalStorageObject(MODEL_VIEW_KEY);
    if (!currentModelViewPositions) {
      currentModelViewPositions = {};
    }
    const queryStoragedPositions = Object.keys(currentModelViewPositions).includes(encodedQuery) ? currentModelViewPositions[encodedQuery] : {};
    queryStoragedPositions[id] = { x, y };
    currentModelViewPositions[encodedQuery] = queryStoragedPositions;
    this.setLocalStorageObject(MODEL_VIEW_KEY, currentModelViewPositions);
  }

  getModelViewNodesPositionsForQuery = query => {
    const encodedQuery = btoa(query);
    const currentModelViewPositions = localStorage.getItem(MODEL_VIEW_KEY) ? JSON.parse(localStorage.getItem(MODEL_VIEW_KEY)) : {};
    return Object.keys(currentModelViewPositions).includes(encodedQuery) ? currentModelViewPositions[encodedQuery] : {};
  }

}

export const storageService = new StorageService();
