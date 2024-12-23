export async function fetchAndConvertToBinary(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const binaryFile = new Uint8Array(arrayBuffer);
    return binaryFile;
  } catch (error) {
    console.error("Error converting file:", error);
    return null;
  }
}
