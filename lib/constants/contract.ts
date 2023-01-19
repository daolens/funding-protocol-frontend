import WorkspaceContractAbi from '@lib/abi/WorkspaceAbi.json'
import GrantContractAbi from '@lib/abi/GrantsAbi.json'
import ApplicationContractAbi from '@lib/abi/ApplicationAbi.json'
import IndiviaulGrantAbi from '@lib/abi/IndividualGrantAbi.json'
import { ContractNameType, ContractType } from '@lib/types/contract'
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains'

export const CONTRACT_NAMES = [
  'workspace',
  'application',
  'grant',
  'individualGrant',
] as const

export const CONTRACT_FUNCTION_NAME_MAP = {
  workspace: {
    /** args: [] */
    fetchWorkSpaces: 'fetchWorkSpaces',
    /** args: [workspaceId, grantContractAddress] */
    fetchWorkSpaceDetails: 'fetchWorkSpaceDetails',
    /** args: [ipfsHash, multisigAddress, networkId] */
    createWorkspace: 'createWorkspace',
    /** args: [workspaceId, ipfsHash] */
    updateWorkspaceMetadata: 'updateWorkspaceMetadata',
  },
  grant: {
    /** args: [workspaceId, ipfsHash, workspaceContractAddress, applicationContractAddress, reviewerAddress[], recommendedAmount, tokenAddress, fundingMethod] */
    createGrant: 'createGrant',
    /** args: [grantAddress, workspaceId, workspaceReg, metadataHash, reviewers] */
    updateGrant: 'updateGrant',
  },
  application: {
    /** args: [applicationId] */
    getApplicationDetail: 'getApplicationDetail',
    /** args: [grantAddress, workspaceId, ipfsHash, milestoneCount, milestonePayments[], seekingFunds] */
    submitApplication: 'submitApplication',
    /** args: [grantAddress, numberOfApplications] */
    getGrantApplications: 'getGrantApplications',
    /**
     * args: [applicationId, workspaceId, applicationState, reasonMetadataHash, grantAddress]
     *
     * applicationState: {
     *  Submitted,
     *  Resubmit,
     *  Approved,
     *  Rejected,
     *  Complete
     * }
     * */
    updateApplicationState: 'updateApplicationState',
    /**
     * args: [applicationId, metadataHash, milestoneCount]
     */
    updateApplicationMetadata: 'updateApplicationMetadata',
    /**
     * args: [applicationId, milestoneId, reasonMetadataHash, workspaceId, grantAddress]
     */
    requestMilestoneApproval: 'requestMilestoneApproval',
    /**
     * args: [applicationId, milestoneId, workspaceId, grantAddress, reasonMetadataHash]
     */
    approveMilestone: 'approveMilestone',
    /**
     * args: [applicationId, milestoneId, workspaceId, grantAddress, reasonMetadataHash]
     */
    submitMilestoneFeedback: 'submitMilestoneFeedback',
    /** Call client side */
    fetchMyApplications: 'fetchMyApplications',
    /** To reject: args: [applicationId, grantAddress]
     */
    revertTransactions: 'revertTransactions',
  },
  individualGrant: {
    /** To approve: args: [applicationId] */
    revertTransactions: 'revertTransactions',
    /** To revert approved milestone: args: [applicationId, milestoneId] */
    revertMilestoneTransactions: 'revertMilestoneTransactions',
  },
} as const

export const CONTRACTS: Record<ContractNameType, ContractType> = {
  workspace: {
    address: '0xBe8798Eca09463B75B32D722C87c0B74ea1b383E',
    polygonMumbaiAddress: '0x2dFf55913e013dFD95820EB1d28045daF765A025',
    polygonAddress: '0xFf8A37aB53F50E81AB8c881d7DF98cD39Cb974b8',
    abi: WorkspaceContractAbi,
  },
  application: {
    address: '0xE39d992aA742CDcb9bb458AB16be8082cAb01888',
    polygonMumbaiAddress: '0xA6CbC144e22bd1944ac3E5f360A3aD0df98ed0D9',
    polygonAddress: '0x30a475B7d5b68f0D2D5Cae6aa57bC8dad60C722E',
    abi: ApplicationContractAbi,
  },
  grant: {
    address: '0x45eF4E00A71ddB7A6e04a1eebdF1344bbD076ada',
    polygonMumbaiAddress: '0x160De3DCEEC1146ACA7aeEd5811BBD46b71f8610',
    polygonAddress: '0xB297117501E716721890669238fa16613167dfb8',
    abi: GrantContractAbi,
  },
  // address will be the grantAddress of the grant
  individualGrant: {
    address: '',
    polygonMumbaiAddress: '',
    polygonAddress: '',
    abi: IndiviaulGrantAbi,
  },
}

export const SUPPORTED_CHAINS = [polygon, polygonMumbai, mainnet]
