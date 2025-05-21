import { createTag, getVersion } from "./utils";
import { execSync } from "child_process";

const run = () => {
  try {
    const tag = createTag(getVersion());
    // Execute Git commands to create and push the tag
    console.log(`Creating Git tag: ${tag}`);

    execSync(`git tag -a ${tag} -m "Release ${tag}"`);
    execSync("git push --follow-tags");
    console.log(`Changes committed and tagged as ${tag}`);

    console.log(`${tag} pushed to remote successfully`);
  } catch (error) {
    console.error("Error creating Git tag:", error.message);
    process.exit(1);
  }
};

run();
