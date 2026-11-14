import {
  encodeOutputJSON
} from "./chunk-k8pbwn3m.js";
import {
  createRixRepl
} from "./chunk-9zc7p0hf.js";
import {
  replayTutorialSourcesAsync
} from "./chunk-5ywpssbc.js";

// src/tutorial-worker.js
self.onmessage = async ({ data: sources }) => {
  try {
    const response = await replayTutorialSourcesAsync(sources, sources.length - 1, createRixRepl);
    if (!response) {
      self.postMessage({ response: null });
      return;
    }
    const { type, text, html, groups } = response;
    let valueJSON = null;
    if (html) {
      try {
        if (response.observe)
          throw new Error("Live output");
        valueJSON = encodeOutputJSON(response.value);
      } catch {
        self.postMessage({ localSessionRequired: true });
        return;
      }
    }
    self.postMessage({ response: { type, text, html, groups, valueJSON } });
  } catch (error) {
    self.postMessage({ response: { type: "error", text: error.message || String(error) } });
  }
};

//# debugId=D4385FCD5D2D947C64756E2164756E21
//# sourceMappingURL=tutorial-worker.js.map
