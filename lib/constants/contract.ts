import WorkspaceContractAbi from '@lib/abi/WorkspaceAbi.json'
import GrantContractAbi from '@lib/abi/GrantsAbi.json'
import ApplicationContractAbi from '@lib/abi/ApplicationAbi.json'
import { ContractNameType, ContractType } from '@lib/types/contract'

export const CONTRACT_NAMES = ['workspace', 'application', 'grant'] as const

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
    /** args: [grantAddress, workspaceId, ipfsHash, milestoneCount, milestonePayments[]] */
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
  },
} as const

export const CONTRACTS: Record<ContractNameType, ContractType> = {
  workspace: {
    address: '0x5266679B13fc94CF9DE0818D15E60A9c225e4668',
    polygonMumbaiAddress: '0xA521264D40289B20ee7cA89c2cb4D54C3b6918A3',
    abi: WorkspaceContractAbi,
  },
  application: {
    address: '0xB1873E7234199E864F9619562c058465C0085ac8',
    polygonMumbaiAddress: '0xAe1A8C853EC992309Bcca1bA4D9794Bd0b833939',
    abi: ApplicationContractAbi,
  },
  grant: {
    address: '0x49aD31dA5B105789C8737c9c98c0D97AA69fE996',
    polygonMumbaiAddress: '0xe561BF9EE2cAF74E502dE79e97c7A0C0392dFD10',
    abi: GrantContractAbi,
  },
}
