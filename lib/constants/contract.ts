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
  },
} as const

export const CONTRACTS: Record<ContractNameType, ContractType> = {
  workspace: {
    address: '0x72597540045338CF15dEFBeaec40C54B845F5EB3',
    polygonMumbaiAddress: '0x72597540045338CF15dEFBeaec40C54B845F5EB3',
    abi: WorkspaceContractAbi,
  },
  application: {
    address: '0x04431Fa8cBe7821F2CCC3598c58e5925D05fa464',
    polygonMumbaiAddress: '0x04431Fa8cBe7821F2CCC3598c58e5925D05fa464',
    abi: ApplicationContractAbi,
  },
  grant: {
    address: '0xB9d5E7B96832C5e2DCF287433491073eA6AdFD7E',
    polygonMumbaiAddress: '0xB9d5E7B96832C5e2DCF287433491073eA6AdFD7E',
    abi: GrantContractAbi,
  },
  // address will be the grantAddress of the grant
  individualGrant: {
    address: '',
    polygonMumbaiAddress: '',
    abi: IndiviaulGrantAbi,
  },
}
