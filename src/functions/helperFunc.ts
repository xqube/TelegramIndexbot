export function bytesToMegabytes(bytes: number) {
    return bytes / (1024 * 1024);
}

export function cleanFileName(fileName:any) {
    // Define a regular expression pattern to match characters to be removed
    const pattern = /[^a-zA-Z0-9]/g;
    // Replace matched characters with an empty string
    return fileName.replace(pattern, " ");
}



export function extractSearchTerm(searchString: string) {
    // Define a regular expression pattern to match the term after "Searched For:"
    const regexPattern = /Searched For:\s*(.+)/i;

    // Use the match method with the regular expression pattern
    const match = searchString.match(regexPattern);

    // Extract the term after "Searched For:"
    const termAfterSearchedFor = match ? match[1] : null;

    return termAfterSearchedFor;
}
