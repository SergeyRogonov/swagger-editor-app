export async function loadTextFile(file: File): Promise<string> {
  return file.text();
}
