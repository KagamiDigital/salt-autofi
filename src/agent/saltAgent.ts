import { BigNumber, Signer } from "ethers";
import { NudgeListener, Salt, SaltAccount } from "salt-sdk";
import { broadcasting_network_provider } from "../config";
import { salt } from "..";
import { AgentState, Deposit, Strategy } from "./types";

export class SaltAgent {
  /**
   * the signer running the agent
   */
  private signer: Signer;

  /**
   * the nudge listener
   */
  private nudgeListener: NudgeListener | null = null;

  /**
   * the queue of deposits.
   * Refer to {@link Deposit} for a complete description
   */
  private depositsQueue: Deposit[];

  /**
   * the salt sdk instance.
   * Refer to {@link Salt} for a complete description
   */
  private salt: Salt;

  /**
   * The strategy the agent is running.
   * Refer to {@link Strategy} for a complete description
   */
  private strategy: Strategy;

  /**
   * The list of accounts the agent is watching
   * refer to {@link SaltAcount} for a comprehensive description of a account.
   */
  private managedAccounts: SaltAccount[];

  /**
   * The state of the agent
   * refer to {@linkAgentState} for a list of all the possible states
   */
  private state: AgentState;

  /**
   * The minimum balance under which a deposit will not be swept
   */
  private minBalance: BigNumber;

  constructor(signer: Signer, strategy: Strategy, minBalance: BigNumber) {
    this.signer = signer;
    this.depositsQueue = [];
    this.strategy = strategy;
    this.managedAccounts = [];
    this.salt = salt;
    this.state = "sleeping";
    this.minBalance = minBalance;
  }

  /**
   * Returns the current state the agent is in.
   * @inlineType AgentState
   * @example
   * ```ts
   * // useful if you want to know at any point the state the agent is in
   * const agentState = saltAgent.getAgentState()
   * ```
   */
  getAgentState() {
    return this.state;
  }

  /**
   * Queues of all the deposits found by the agent.
   * @inlineType Deposit[]
   * @example
   * ```ts
   * // useful if you want to know at any point the queued deposits, i.e. the deposits that will be swept next
   * const deposits = saltAgent.depositsQueue()
   * ```
   */
  getDepositsQueue() {
    return this.depositsQueue;
  }

  /**
   * Turns the agent off, i.e. the agent will stop scanning for and sweeping deposits.
   * @example
   * ```ts
   * saltAgent.off()
   *
   * ```
   */
  off() {
    this.state = "sleeping";
  }

  /**
   * Turns the agent on, i.e. the agent will resume scanning for and sweeping deposits.
   * @example
   * ```ts
   * saltAgent.on()
   * ```
   */
  on() {
    if (this.state === "sleeping") this.state = "watching";
  }

  /**
   * Initializes the agent. Starts the invitation, account and deposit watching.
   * @example
   * ```ts
   * const saltAgent = new Agent(signer, strategy,minBalance);
   * saltAgent.init()
   *
   * ```
   */
  async init() {
    await this.salt.authenticate(this.signer);
    this.nudgeListener = await this.salt.listenToAccountNudges(this.signer);

    /*
    setInterval(async () => {
      try {
        if (this.state === "sleeping") {
          this.state = "watching";
          await this.syncInvitations();
          await this.syncManagedAccounts();
          await this.syncNewDeposits();
        }
      } catch (error) {
        console.error("error fetching API information", error);
      }
    }, 60 * 1000);
    */
  }

  /**
   * Sweeps the next deposit in the queue. It is called automatically when one or more new deposits are found.
   * @internal
   */
  private async sweepDeposit() {
    this.state = "sweeping";

    while (this.depositsQueue.length > 0) {
      await this._sweepDeposit();
    }

    this.state = "watching";
  }

  /**
   * Queries the Salt API for any pending invitations to organisations.
   * @internal
   */
  private async syncInvitations() {
    const response = await this.salt.getOrganisationsInvitations();
    const invitations = response.invitations;

    // accept new invitations
    for (let i = 0; i < invitations.length; i++) {
      await this.salt.acceptOrganisationInvitation(invitations[i]._id);
    }
  }

  /**
   * Queries the Salt API for accounts the agent is a signer on, i.e. for accounts the signer manages.
   * @internal
   */
  private async syncManagedAccounts() {
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

  /**
   * Queries RPC node to get the balance of all managed accounts. If balance > minBalance then new deposit.
   * @internal
   */
  private async syncNewDeposits() {
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
        if (this.state === "watching") this.sweepDeposit();
      } catch (error) {
        console.error(
          `Failed to get balance for account ${accountAddresses[i]}:`,
          error
        );
      }
    }
  }

  /**
   * Process a new deposit into the deposits queue.
   * @internal
   */
  private handleNewDeposit({
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

  /**
   * Pops the first deposit in the queue and sweeps it.
   * @internal
   */
  private async _sweepDeposit() {
    if (this.depositsQueue.length === 0) return;

    if (this.nudgeListener.getIsProcessingNudge()) return;

    const deposit = this.depositsQueue.shift();

    this.nudgeListener.disableNudgeListener();
    try {
      await this.strategy.sweepFunction({
        accountAddress: deposit.accountAddress,
        accountId: deposit.accountId,
        amount: deposit.depositAmount,
      });
    } catch (err) {
      console.error("Funds could not be staked", err);
    } finally {
      this.nudgeListener.enableNudgeListener();
    }
  }
}
