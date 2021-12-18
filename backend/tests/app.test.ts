import { test } from "@jest/globals";

import App from "../app";

class AppTests {
  init = () =>
    test("app setup", async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }, 4000);

  destruct = () =>
    test("app end", () => {
      App.runInstance!.close();
      App.server.stop();
    });
}
export default new AppTests();
