class CheckLastEventStatus {}

describe("checkLastEventStatus", () => {
  it("should get last event data", () => {
    const checkLastEventStatus = new CheckLastEventStatus();

    await checkLastEventStatus.perform('any-id');
  });
});
