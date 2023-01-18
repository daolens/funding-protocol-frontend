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
    address: '0x2dFf55913e013dFD95820EB1d28045daF765A025',
    polygonMumbaiAddress: '0x2dFf55913e013dFD95820EB1d28045daF765A025',
    polygonAddress: '0x7C3f503E4C19ee26b190114c5f63F6a834aFF05E',
    abi: WorkspaceContractAbi,
  },
  application: {
    address: '0xA6CbC144e22bd1944ac3E5f360A3aD0df98ed0D9',
    polygonMumbaiAddress: '0xA6CbC144e22bd1944ac3E5f360A3aD0df98ed0D9',
    polygonAddress: '0xB0631354E8DCE6454f131a4Fb18f38C64908352A',
    abi: ApplicationContractAbi,
  },
  grant: {
    address: '0x160De3DCEEC1146ACA7aeEd5811BBD46b71f8610',
    polygonMumbaiAddress: '0x160De3DCEEC1146ACA7aeEd5811BBD46b71f8610',
    polygonAddress: '0x168cA1c267E68cC7Ab86e53ABc4Bc6FB6220C6ce',
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
