import { Contract, JsonRpcProvider, Wallet, TransactionReceipt } from 'ethers'

const anchorAbi = [
  'function anchorPreview(bytes32 previewId, bytes32 proofCid, bytes32 verdictCid, bytes32 traceId)',
  'function anchorFill(bytes32 orderId, bytes32 fillCid, int256 deltaNotional, int256 slippageBps, bytes32 traceId)'
] as const

export interface AnchorClientConfig {
  rpcUrl: string
  contractAddress: string
  privateKey: string
  timeoutMs?: number
}

/**
 * Minimal client for anchoring previews and fills on zkSync Era.
 */
export class AnchorClient {
  private contract: Contract
  private timeoutMs: number

  constructor(cfg: AnchorClientConfig) {
    const provider = new JsonRpcProvider(cfg.rpcUrl)
    const wallet = new Wallet(cfg.privateKey, provider)
    this.contract = new Contract(cfg.contractAddress, anchorAbi, wallet)
    this.timeoutMs = cfg.timeoutMs ?? 10000
  }

  private withTimeout<T>(p: Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), this.timeoutMs)
      p.then((v) => {
        clearTimeout(timer)
        resolve(v)
      }).catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
    })
  }

  async anchorPreview(
    previewId: string,
    proofCid: string,
    verdictCid: string,
    traceId: string,
  ): Promise<{ txHash: string | null }> {
    try {
      const tx = await this.withTimeout(
        this.contract.anchorPreview(previewId, proofCid, verdictCid, traceId),
      )
      const receipt = (await this.withTimeout(tx.wait())) as TransactionReceipt
      return { txHash: receipt.hash }
    } catch {
      return { txHash: null }
    }
  }

  async anchorFill(
    orderId: string,
    fillCid: string,
    deltaNotional: bigint,
    slippageBps: bigint,
    traceId: string,
  ): Promise<{ txHash: string | null }> {
    try {
      const tx = await this.withTimeout(
        this.contract.anchorFill(orderId, fillCid, deltaNotional, slippageBps, traceId),
      )
      const receipt = (await this.withTimeout(tx.wait())) as TransactionReceipt
      return { txHash: receipt.hash }
    } catch {
      return { txHash: null }
    }
  }
}
