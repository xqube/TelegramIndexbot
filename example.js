const searchTerms = "hello all 1080p";

const termsArray = searchTerms.split(" ");
// Map over the array of terms and enclose each word in double quotes with a backslash
const formattedTermsArray = termsArray.map((term) => `\"${term}\"`);
// Join the formatted terms array back into a string with space as separator
const output = `"${searchTerms
  .split(" ")
  .map((term) => `\"${term}\"`)
  .join(" ")}"`; // Output: "\"thrones\" \"s02\" \"psa\" \"720p\""

console.log(output);
