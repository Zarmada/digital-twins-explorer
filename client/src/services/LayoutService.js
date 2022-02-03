// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { storageService } from "./StorageService";
import { sessionService } from "./SessionService";

class LayoutService {

clearGraphLayout = (layout, query) => {
  storageService.clearGraphLayout(layout, query);
  sessionService.clearGraphLayout(layout, query);
}

clearModelsLayout = layout => {
  storageService.clearModelsLayout(layout);
  sessionService.clearModelsLayout(layout);
}

}

export const layoutService = new LayoutService();
