export default async function AsyncSleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
