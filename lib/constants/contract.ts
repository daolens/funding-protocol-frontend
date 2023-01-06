import WorkspaceContractAbi from '@lib/abi/WorkspaceAbi.json'
import GrantContractAbi from '@lib/abi/GrantsAbi.json'
import ApplicationContractAbi from '@lib/abi/ApplicationAbi.json'
import IndiviaulGrantAbi from '@lib/abi/IndividualGrantAbi.json'
import { ContractNameType, ContractType } from '@lib/types/contract'

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
    /** Call client side */
    fetchMyApplications: 'fetchMyApplications',
    /** To reject: args: [applicationId, grantAddress]
     */
    revertTransactions: 'revertTransactions',
  },
  individualGrant: {
    /** To approve: args: [applicationId] */
    revertTransactions: 'revertTransactions',
  },
} as const

export const CONTRACTS: Record<ContractNameType, ContractType> = {
  workspace: {
    address: '0x3EE02c62E0C92c6f41649205e1812464ADC3Ea33',
    polygonMumbaiAddress: '0x3EE02c62E0C92c6f41649205e1812464ADC3Ea33',
    abi: WorkspaceContractAbi,
  },
  application: {
    address: '0x34b80105E9823da6838D2c55c1E1e314e9E7dF6A',
    polygonMumbaiAddress: '0x34b80105E9823da6838D2c55c1E1e314e9E7dF6A',
    abi: ApplicationContractAbi,
  },
  grant: {
    address: '0x792A18c6b7B1A7F6012D471cE597DAC53F5c604b',
    polygonMumbaiAddress: '0x792A18c6b7B1A7F6012D471cE597DAC53F5c604b',
    abi: GrantContractAbi,
  },
  // address will be the grantAddress of the grant
  individualGrant: {
    address: '',
    polygonMumbaiAddress: '',
    abi: IndiviaulGrantAbi,
  },
}
