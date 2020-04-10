import {
  Contract,
  ContractFactory,
  ContractTransaction,
  EventFilter,
  Signer
} from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedFunctionDescription,
  TypedEventDescription
} from ".";

interface MaliciousBatchPackInterface extends Interface {
  functions: {
    purchases: TypedFunctionDescription<{ encode([]: [BigNumberish]): string }>;

    maliciousPush: TypedFunctionDescription<{
      encode([count]: [BigNumberish]): string;
    }>;

    maliciousPull: TypedFunctionDescription<{
      encode([count]: [BigNumberish]): string;
    }>;

    pushAttackHook: TypedFunctionDescription<{
      encode([purchaseID]: [BigNumberish]): string;
    }>;

    emptyHook: TypedFunctionDescription<{ encode([]: []): string }>;

    pullAttackHook: TypedFunctionDescription<{
      encode([purchaseID]: [BigNumberish]): string;
    }>;
  };
  events: {};
}

export interface MaliciousBatchPack {
  interface: MaliciousBatchPackInterface;
  connect(signerOrProvider: Signer | Provider | string): MaliciousBatchPack;
  attach(addressOrName: string): MaliciousBatchPack;
  deployed(): Promise<MaliciousBatchPack>;
  on(event: EventFilter | string, listener: Listener): MaliciousBatchPack;
  once(event: EventFilter | string, listener: Listener): MaliciousBatchPack;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): MaliciousBatchPack;
  removeAllListeners(eventName: EventFilter | string): MaliciousBatchPack;
  removeListener(eventName: any, listener: Listener): MaliciousBatchPack;

  purchases(arg0: BigNumberish): Promise<BigNumber>;
  maliciousPush(
    count: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  maliciousPull(
    count: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  pushAttackHook(
    purchaseID: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  emptyHook(overrides?: TransactionOverrides): Promise<ContractTransaction>;
  pullAttackHook(
    purchaseID: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  estimate: {
    purchases(arg0: BigNumberish): Promise<BigNumber>;
    maliciousPush(count: BigNumberish): Promise<BigNumber>;
    maliciousPull(count: BigNumberish): Promise<BigNumber>;
    pushAttackHook(purchaseID: BigNumberish): Promise<BigNumber>;
    emptyHook(): Promise<BigNumber>;
    pullAttackHook(purchaseID: BigNumberish): Promise<BigNumber>;
  };
}

export class MaliciousBatchPack extends Contract {
  public static at(signer: Signer, addressOrName: string): MaliciousBatchPack {
    let factory = new ContractFactory(this.ABI, this.Bytecode, signer);
    return (factory.attach(addressOrName) as unknown) as MaliciousBatchPack;
  }

  public static deploy(
    signer: Signer,
    _escrow: string,
    _asset: string
  ): Promise<MaliciousBatchPack> {
    let factory = new ContractFactory(this.ABI, this.Bytecode, signer);
    return (factory.deploy(_escrow, _asset) as unknown) as Promise<
      MaliciousBatchPack
    >;
  }

  public static ABI =
    '[{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"purchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IEscrow","name":"_escrow","type":"address"},{"internalType":"contract TestERC721Token","name":"_asset","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"name":"maliciousPush","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"name":"maliciousPull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"purchaseID","type":"uint256"}],"name":"pushAttackHook","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"emptyHook","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"purchaseID","type":"uint256"}],"name":"pullAttackHook","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
  public static Bytecode =
    "0x608060405234801561001057600080fd5b50604051610c43380380610c4383398101604081905261002f91610071565b600180546001600160a01b039384166001600160a01b031991821617909155600280549290931691161790556100e4565b805161006b816100cd565b92915050565b6000806040838503121561008457600080fd5b60006100908585610060565b92505060206100a185828601610060565b9150509250929050565b600061006b826100c1565b600061006b826100ab565b6001600160a01b031690565b6100d6816100b6565b81146100e157600080fd5b50565b610b50806100f36000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806325c4cc88146100675780635205fbd61461007c5780638392fe311461008f57806391931643146100b8578063d0020d85146100cb578063e35a7a10146100de575b600080fd5b61007a610075366004610806565b6100e6565b005b61007a61008a366004610806565b610205565b6100a261009d366004610806565b6103ed565b6040516100af9190610a7c565b60405180910390f35b61007a6100c6366004610806565b61040b565b61007a6100d9366004610806565b6105af565b61007a610675565b6100ee61077f565b6100f7826106a1565b604080516020810182528481526000805460018101825590805290517f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e56382015590519192509060609061014e908390602401610a7c565b60408051601f198184030181529181526020820180516001600160e01b0316632902fdeb60e11b1790526001549051636a8573f560e11b81529192506001600160a01b03169063d50ae7ea906101ac90869030908690600401610a4a565b602060405180830381600087803b1580156101c657600080fd5b505af11580156101da573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506101fe919081019061082c565b5050505050565b6001546001600160a01b031633146102385760405162461bcd60e51b815260040161022f90610a1a565b60405180910390fd5b6102406107d7565b6000828154811061024d57fe5b600091825260209182902060408051938401905201548152905061026f61077f565b815161027a906106a1565b60025483516040516340c10f1960e01b81529293506001600160a01b03909116916340c10f19916102b0913091906004016109ff565b600060405180830381600087803b1580156102ca57600080fd5b505af11580156102de573d6000803e3d6000fd5b50506002546001805460405163a22cb46560e01b81526001600160a01b03938416955063a22cb46594506103199390911691906004016109dd565b600060405180830381600087803b15801561033357600080fd5b505af1158015610347573d6000803e3d6000fd5b5050600154604051634e344acb60e01b81526001600160a01b039091169250634e344acb915061037d9084903090600401610a2a565b602060405180830381600087803b15801561039757600080fd5b505af11580156103ab573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506103cf919081019061082c565b50600083815481106103dd57fe5b6000918252602082200155505050565b600081815481106103fa57fe5b600091825260209091200154905081565b6001546001600160a01b031633146104355760405162461bcd60e51b815260040161022f90610a1a565b61043d6107d7565b6000828154811061044a57fe5b600091825260209182902060408051938401905201548152905061046c61077f565b8151610477906106a1565b6040805160048082526024820183526020820180516001600160e01b0316630e35a7a160e41b1790526001549251636a8573f560e11b815293945090926001600160a01b039092169163d50ae7ea916104d69186913091879101610a4a565b602060405180830381600087803b1580156104f057600080fd5b505af1158015610504573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250610528919081019061082c565b5060025460015484516040516340c10f1960e01b81526001600160a01b03938416936340c10f199361055f939116916004016109ff565b600060405180830381600087803b15801561057957600080fd5b505af115801561058d573d6000803e3d6000fd5b505050506000848154811061059e57fe5b600091825260208220015550505050565b6105b761077f565b6105c0826106a1565b604080516020810182528481526000805460018101825590805290517f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563820155905191925090606090610617908390602401610a7c565b60408051601f198184030181529181526020820180516001600160e01b0316639193164360e01b1790526001549051636a8573f560e11b81529192506001600160a01b03169063d50ae7ea906101ac90869030908690600401610a4a565b6001546001600160a01b0316331461069f5760405162461bcd60e51b815260040161022f90610a1a565b565b6106a961077f565b600254604080516318160ddd60e01b815290516000926001600160a01b0316916318160ddd916004808301926020929190829003018186803b1580156106ee57600080fd5b505afa158015610702573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250610726919081019061082c565b6040805160e081018252338082526020808301919091526002546001600160a01b031682840152600060608301819052608083018590529690930160a08201528151958652918501905260c08101939093525090919050565b6040518060e0016040528060006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001600081526020016000815260200160008152602001606081525090565b6040518060200160405280600081525090565b80356107f581610af6565b92915050565b80516107f581610af6565b60006020828403121561081857600080fd5b600061082484846107ea565b949350505050565b60006020828403121561083e57600080fd5b600061082484846107fb565b600061085683836109d4565b505060200190565b61086781610a9d565b82525050565b600061087882610a90565b6108828185610a94565b935061088d83610a8a565b8060005b838110156108bb5781516108a5888261084a565b97506108b083610a8a565b925050600101610891565b509495945050505050565b61086781610aa8565b60006108da82610a90565b6108e48185610a94565b93506108f4818560208601610abc565b6108fd81610aec565b9093019392505050565b6000610914601b83610a94565b7f6d7573742062652074686520657363726f7720636f6e74726163740000000000815260200192915050565b805160009060e0840190610954858261085e565b506020830151610967602086018261085e565b50604083015161097a604086018261085e565b50606083015161098d60608601826109d4565b5060808301516109a060808601826109d4565b5060a08301516109b360a08601826109d4565b5060c083015184820360c08601526109cb828261086d565b95945050505050565b61086781610ab9565b604081016109eb828561085e565b6109f860208301846108c6565b9392505050565b60408101610a0d828561085e565b6109f860208301846109d4565b602080825281016107f581610907565b60408082528101610a3b8185610940565b90506109f8602083018461085e565b60608082528101610a5b8186610940565b9050610a6a602083018561085e565b81810360408301526109cb81846108cf565b602081016107f582846109d4565b60200190565b5190565b90815260200190565b60006107f582610aad565b151590565b6001600160a01b031690565b90565b60005b83811015610ad7578181015183820152602001610abf565b83811115610ae6576000848401525b50505050565b601f01601f191690565b610aff81610ab9565b8114610b0a57600080fd5b5056fea365627a7a72315820bae10a204d3e558969825fcba8e8f74cd7799ee62442d2833985a31ee87353cd6c6578706572696d656e74616cf564736f6c634300050b0040";
}
