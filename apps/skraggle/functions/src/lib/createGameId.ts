export function createGameId(): string {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let counter = 0;
  while (counter < 4) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
}
