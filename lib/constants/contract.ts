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
    address: '0x5266679B13fc94CF9DE0818D15E60A9c225e4668',
    polygonMumbaiAddress: '0x765166979620Dab42eb68a1f71cF7754e94e0932',
    abi: WorkspaceContractAbi,
  },
  application: {
    address: '0xB1873E7234199E864F9619562c058465C0085ac8',
    polygonMumbaiAddress: '0xdb86A3D241FE1EDb7d59288240EB25C888b14afC',
    abi: ApplicationContractAbi,
  },
  grant: {
    address: '0x49aD31dA5B105789C8737c9c98c0D97AA69fE996',
    polygonMumbaiAddress: '0xB86386DDE4553b7829377f28c35AFC742984B32C',
    abi: GrantContractAbi,
  },
  // address will be the grantAddress of the grant
  individualGrant: {
    address: '',
    polygonMumbaiAddress: '',
    abi: IndiviaulGrantAbi,
  },
}
