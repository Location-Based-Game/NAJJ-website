import { createGameId } from "../src/lib/createGameId";

describe("createGameId function", () => {
  test("makes a 4 character game ID", () => {
    const id = createGameId();
    expect(typeof id).toEqual("string");
    expect(id.length).toEqual(4);
    expect(id).toMatch(/^[a-z0-9]{4}$/);
  });
});
