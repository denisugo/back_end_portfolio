const { assert } = require("chai");
const {
  loginVerification,
  userIdVerification,
} = require("../handlers/loginHandlers");

describe("Handlers", () => {
  describe("loginVerification", () => {
    const res = {
      status: (code) => {
        return {
          send: (message) => {
            sendUsed = `${code} ${message}`;
          },
        };
      },
    };
    const next = () => {
      nextUsed = true;
    };

    let nextUsed;
    let sendUsed;

    beforeEach(() => {
      nextUsed = false;
      sendUsed = false;
    });

    it("Should call next if user is already logged in", () => {
      // req.user should be an object
      const req = { user: {} };

      loginVerification(req, res, next);

      assert.strictEqual(nextUsed, true);
    });

    it("Should send 401 status code and 'Unauthorized' if user is not logged in", () => {
      const req = {};

      loginVerification(req, res, next);

      assert.strictEqual(nextUsed, false);
      assert.strictEqual(sendUsed, "401 Unathorized");
    });
  });
  describe("userIdVerification", () => {
    const res = {
      status: (code) => {
        return {
          send: (message) => {
            sendUsed = `${code} ${message}`;
          },
        };
      },
    };
    const next = () => {
      nextUsed = true;
    };

    let nextUsed;
    let sendUsed;

    beforeEach(() => {
      nextUsed = false;
      sendUsed = false;
    });

    it("Should call next if user id from request and user id from cookie are the same", () => {
      // req.user should be an object
      const req = { user: { id: 1 }, params: { id: "1" } };

      userIdVerification(req, res, next);

      assert.strictEqual(nextUsed, true);
      assert.strictEqual(sendUsed, false);
    });

    it("Should send 401 status code and 'Unauthorized' if user id from request and user id from cookie are not the samen", () => {
      const req = { user: { id: 1 }, params: { id: "2" } };

      userIdVerification(req, res, next);

      assert.strictEqual(nextUsed, false);
      assert.strictEqual(sendUsed, "401 Unathorized");
    });
  });
});
