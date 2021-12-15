// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const MODEL_VIEWER_KEY = "ModelViewer";

class StorageService {

  getLocalStoragePrimitive = name => localStorage.getItem(name)

  getLocalStorageObject = name => JSON.parse(localStorage.getItem(name))

  setLocalStorageObject = (name, dataObj) => localStorage.setItem(name, JSON.stringify(dataObj))

  removeLocalStorageObject = name => localStorage.removeItem(name)

  saveModelViewerNodesPosition = (id, x, y) => {
    let currentGraphViewPositions = this.getLocalStorageObject(MODEL_VIEWER_KEY);
    if (!currentGraphViewPositions) {
      currentGraphViewPositions = {};
    }
    currentGraphViewPositions[id] = { x, y };
    this.setLocalStorageObject(MODEL_VIEWER_KEY, currentGraphViewPositions);
  }

  getModelViewerNodesPositions = () => localStorage.getItem(MODEL_VIEWER_KEY) ? JSON.parse(localStorage.getItem(MODEL_VIEWER_KEY)) : {}

}

export const storageService = new StorageService();
