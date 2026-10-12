const slug = "[a-z0-9]+(?:-[a-z0-9]+)*";
const version = "(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*)";

export function pullRequestBranchError(head, base) {
  if (new RegExp(`^(?:feature|bugfix)/${slug}$`).test(head)) {
    return base === "develop"
      ? null
      : `${head} pull requests must target develop`;
  }

  if (new RegExp(`^release/${version}$`).test(head)) {
    return base === "main" ? null : `${head} pull requests must target main`;
  }

  if (new RegExp(`^hotfix/${slug}$`).test(head)) {
    return base === "main" ? null : `${head} pull requests must target main`;
  }

  return `Unsupported branch name: ${head}`;
}
