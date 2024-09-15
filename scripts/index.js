import fetch from "node-fetch";
import fs from "fs";

const toc = async () => {
  // Fetch from the GitHubAPI
  const data = await fetch(
    "https://api.github.com/repos/yashksaini-coder/September-Leetcode-Daily-2024/contents?ref=main"
  )
    .then((response) => response.json())
    .then((data) => data);
  
  var arr = Object.values(data);
  
  // Filter out the folders
  const folders = arr.filter(
    (item) => item.type === "dir" && item.name[0] !== "."
  );
  
  // Make a table of contents
  var toc = [];
  folders.forEach((item) => {
    var num = parseInt(item.name.split("-")[0]);
    toc[num] = item.name;
  });
  
  // Sort toc by key
  var sorted = Object.keys(toc)
    .sort()
    .reduce((obj, key) => {
      obj[key] = toc[key];
      return obj;
    }, {});

  // Generate the table of solutions
  let solutionsTable = `
<!-- SOLUTIONS TABLE BEGIN -->
| Leetcode Problem | Problem Statement | Solution |
|---:|:-----|:----:|
`;
  for (var key in sorted) {
    var str = sorted[key].split("-");
    var name = str.slice(1).join(" ");
    var num = key;
    solutionsTable += `| [${num}](https://leetcode.com/problems/${str.slice(1).join("-")}/) | ${name} | [Solution](./${str.join("-")}/${str.join("-")}.java) |\n`;
  }
  solutionsTable += "<!-- SOLUTIONS TABLE END -->";

  // Read the existing README content
  let readmeContent = fs.readFileSync("README.md", "utf8");

  // Checking whether the solutions table already exists
  if (readmeContent.includes("<!-- SOLUTIONS TABLE BEGIN -->")) {
    // Replacing the existing table
    readmeContent = readmeContent.replace(
      /<!-- SOLUTIONS TABLE BEGIN -->[\s\S]*<!-- SOLUTIONS TABLE END -->/,
      solutionsTable
    );
  } else {
    // Find the "## Solutions" heading and insert the table after it. It is necessary the heading matches exactly.
    const solutionsHeading = "## Solutions";
    const headingIndex = readmeContent.indexOf(solutionsHeading);
    if (headingIndex !== -1) {
      const insertIndex = headingIndex + solutionsHeading.length;
      readmeContent = readmeContent.slice(0, insertIndex) + "\n\n" + solutionsTable + readmeContent.slice(insertIndex);
    } else {
      console.error("Could not find '## Solutions' heading in README.md");
      return;
    }
  }

  // Write the updated content back to README.md
  fs.writeFileSync("README.md", readmeContent);
  console.log("README.md has been updated with the solutions table!");
};

toc();