type Platform = {
  isEnterprise(): boolean
  // branch name might not be available when resolving from DOM and URL
  resolvePartialMetaData(): PartialMetaData | null
  // resolveMetaData(metaData: PartialMetaData, accessToken?: string): Async<MetaData>
  getDefaultBranchName(
    metaData: Pick<MetaData, 'userName' | 'repoName'>,
    accessToken?: string,
  ): Promise<string>
  resolveUrlFromMetaData(metaData: Pick<MetaData, 'userName' | 'repoName'>): {
    userUrl: string
    repoUrl: string
  }
  getTreeData(
    metaData: Pick<MetaData, 'userName' | 'repoName' | 'branchName'>,
    path?: string,
    recursive?: boolean,
    accessToken?: string,
  ): Promise<{ root: TreeNode; defer?: boolean }>
  shouldShow(): boolean
  shouldExpandAll?(): boolean
  getCurrentPath(branchName: string): string[] | null
  setOAuth(code: string): Promise<string | null>
  getOAuthLink(): string
  usePlatformHooks?(): void
}
