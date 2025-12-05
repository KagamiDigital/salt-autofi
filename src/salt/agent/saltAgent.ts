import { BigNumber, Signer } from "ethers";
import { NudgeListener, Salt, SaltAccount } from "salt-sdk";
import { broadcasting_network_provider } from "../../config";

export interface Deposit {
  accountAddress: string;
  accountId: string;
  balance: BigNumber;
  depositAmount: BigNumber;
}

export interface Strategy {
  sweepFunction: ({
    accountAddress,
    accountId,
    amount,
  }: {
    accountAddress: string;
    accountId?: string;
    amount?: BigNumber;
  }) => Promise<void>;
}

export type AgentState = "watching" | "sweeping" | "sleeping";

export class SaltAgent {
  private signer: Signer;

  private nudgeListener: NudgeListener | null = null;

  private depositsQueue: Deposit[];

  private salt: Salt;

  private strategy: Strategy;

  private managedAccounts: SaltAccount[];

  private state: AgentState;

  private minBalance: BigNumber;

  constructor(signer: Signer, strategy: Strategy, minBalance: BigNumber) {
    this.signer = signer;
    this.depositsQueue = [];
    this.strategy = strategy;
    this.managedAccounts = [];
    this.salt = new Salt({ environment: "TESTNET" });
    this.state = "watching";
    this.minBalance = minBalance;
  }

  getAgentState() {
    return this.state;
  }

  getDepositsQueue() {
    return this.depositsQueue;
  }

  sleepAgent() {
    this.state = "sleeping";
  }

  async init() {
    await this.salt.authenticate(this.signer);
    this.nudgeListener = await this.salt.listenToAccountNudges(this.signer);

    setInterval(async () => {
      try {
        if (this.state !== "sleeping") {
          this.syncInvitations();
          this.syncManagedAccounts();
          this.syncNewDeposits();
        }
      } catch (error) {
        console.error("error fetching API information", error);
      }
    }, 60 * 1000);
  }

  async run() {
    this.state = "sweeping";

    while (this.depositsQueue.length > 0) {
      await this.sweepDeposit();
    }

    this.state = "watching";
  }

  async syncInvitations() {
    const response = await this.salt.getOrganisationsInvitations();
    const invitations = response.invitations;

    // accept new invitations
    for (let i = 0; i < invitations.length; i++) {
      await this.salt.acceptOrganisationInvitation(invitations[i]._id);
    }
  }

  async syncManagedAccounts() {
    const signerAddress = await this.signer.getAddress();
    const organisations = await this.salt.getOrganisations();

    for (let i = 0; i < organisations.length; i++) {
      const orgAccounts = await this.salt.getAccounts(organisations[i]._id);
      orgAccounts.forEach(
        (acc) =>
          acc.publicKey !== null &&
          acc.signers.some(
            (s) => s.toLowerCase() === signerAddress.toLowerCase()
          ) &&
          (this.managedAccounts[acc.publicKey] = acc)
      );
    }
  }

  async syncNewDeposits() {
    const accountAddresses = Object.keys(this.managedAccounts);

    for (let i = 0; i < accountAddresses.length; i++) {
      try {
        const balance = await broadcasting_network_provider.getBalance(
          accountAddresses[i]
        );
        if (balance.gt(this.minBalance)) {
          this.handleNewDeposit({
            accountAddress: accountAddresses[i],
            accountId: this.managedAccounts[accountAddresses[i]].id,
            balance: balance,
          });
        }
        if (this.state === "watching") this.run();
      } catch (error) {
        console.error(
          `Failed to get balance for account ${accountAddresses[i]}:`,
          error
        );
      }
    }
  }

  handleNewDeposit({
    accountAddress,
    accountId,
    balance,
  }: {
    accountAddress: string;
    accountId: string;
    balance: BigNumber;
  }): void {
    const idx = this.depositsQueue.findIndex((d) => d.accountId === accountId);
    if (idx !== -1) {
      this.depositsQueue[idx].balance = balance;
      this.depositsQueue[idx].depositAmount = balance.sub(this.minBalance);
    } else {
      const deposit: Deposit = {
        accountAddress: accountAddress,
        accountId: accountId,
        balance: balance,
        depositAmount: balance.sub(this.minBalance),
      };
      this.depositsQueue.push(deposit);
    }
  }

  async sweepDeposit() {
    if (this.depositsQueue.length === 0) return;

    if (this.nudgeListener.getIsProcessingNudge()) return;

    const deposit = this.depositsQueue.shift();

    try {
      await this.strategy.sweepFunction({
        accountAddress: deposit.accountAddress,
        accountId: deposit.accountId,
        amount: deposit.depositAmount,
      });
    } catch (err) {
      console.error("Funds could not be staked", err);
    }
  }
}
