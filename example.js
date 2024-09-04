function removePAfterNumber(str) {
  return str.replace(/(\d+)p\b/g, '$1');
}

// Example usage
let test1 = "1080p";
let test2 = "3434p";
let test3 = "355p";
let test4 = "interstallr 1080p 2014 imax 720p";
let test5 = "4p5p6p7p"; // won't be affected

console.log(removePAfterNumber(test1)); // Output: "1080"
console.log(removePAfterNumber(test2)); // Output: "3434"
console.log(removePAfterNumber(test3)); // Output: "355"
console.log(removePAfterNumber(test4)); // Output: "hello 123 world"
console.log(removePAfterNumber(test5)); // Output: "4p5p6p7p"