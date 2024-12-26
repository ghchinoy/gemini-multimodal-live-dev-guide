/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class StatusHandler {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.functionInfo = document.getElementById('functionInfo');
    });
  }

  update(functionName, params = {}) {
    const functionInfo = document.getElementById('functionInfo');
    if (functionInfo) {
      const timestamp = new Date().toLocaleTimeString();
      const paramsString = JSON.stringify(params, null, 2);
      functionInfo.textContent = `[${timestamp}] Function: ${functionName}\nParameters: ${paramsString}`;
      console.log(`updating: [${timestamp}] Function: ${functionName}\nParameters: ${paramsString}`);
    }
  }
}

export const statusHandler = new StatusHandler(); 