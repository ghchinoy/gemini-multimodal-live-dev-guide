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
    }
  }
}

export const statusHandler = new StatusHandler(); 