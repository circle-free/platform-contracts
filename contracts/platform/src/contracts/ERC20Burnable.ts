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

interface ERC20BurnableInterface extends Interface {
  functions: {
    allowance: TypedFunctionDescription<{
      encode([owner, spender]: [string, string]): string;
    }>;

    approve: TypedFunctionDescription<{
      encode([spender, amount]: [string, BigNumberish]): string;
    }>;

    balanceOf: TypedFunctionDescription<{
      encode([account]: [string]): string;
    }>;

    decreaseAllowance: TypedFunctionDescription<{
      encode([spender, subtractedValue]: [string, BigNumberish]): string;
    }>;

    increaseAllowance: TypedFunctionDescription<{
      encode([spender, addedValue]: [string, BigNumberish]): string;
    }>;

    totalSupply: TypedFunctionDescription<{ encode([]: []): string }>;

    transfer: TypedFunctionDescription<{
      encode([recipient, amount]: [string, BigNumberish]): string;
    }>;

    transferFrom: TypedFunctionDescription<{
      encode([sender, recipient, amount]: [
        string,
        string,
        BigNumberish
      ]): string;
    }>;

    burn: TypedFunctionDescription<{
      encode([amount]: [BigNumberish]): string;
    }>;

    burnFrom: TypedFunctionDescription<{
      encode([account, amount]: [string, BigNumberish]): string;
    }>;
  };
  events: {
    Approval: TypedEventDescription<{
      encodeTopics([owner, spender, value]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;

    Transfer: TypedEventDescription<{
      encodeTopics([from, to, value]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;
  };
}

export interface ERC20Burnable {
  interface: ERC20BurnableInterface;
  connect(signerOrProvider: Signer | Provider | string): ERC20Burnable;
  attach(addressOrName: string): ERC20Burnable;
  deployed(): Promise<ERC20Burnable>;
  on(event: EventFilter | string, listener: Listener): ERC20Burnable;
  once(event: EventFilter | string, listener: Listener): ERC20Burnable;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): ERC20Burnable;
  removeAllListeners(eventName: EventFilter | string): ERC20Burnable;
  removeListener(eventName: any, listener: Listener): ERC20Burnable;

  allowance(owner: string, spender: string): Promise<BigNumber>;
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  balanceOf(account: string): Promise<BigNumber>;
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  totalSupply(): Promise<BigNumber>;
  transfer(
    recipient: string,
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  burn(
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  burnFrom(
    account: string,
    amount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  Approval(
    owner: string | null,
    spender: string | null,
    value: null
  ): EventFilter;
  Transfer(from: string | null, to: string | null, value: null): EventFilter;

  estimate: {
    allowance(owner: string, spender: string): Promise<BigNumber>;
    approve(spender: string, amount: BigNumberish): Promise<BigNumber>;
    balanceOf(account: string): Promise<BigNumber>;
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish
    ): Promise<BigNumber>;
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish
    ): Promise<BigNumber>;
    totalSupply(): Promise<BigNumber>;
    transfer(recipient: string, amount: BigNumberish): Promise<BigNumber>;
    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish
    ): Promise<BigNumber>;
    burn(amount: BigNumberish): Promise<BigNumber>;
    burnFrom(account: string, amount: BigNumberish): Promise<BigNumber>;
  };
}

export class ERC20Burnable extends Contract {
  public static at(signer: Signer, addressOrName: string): ERC20Burnable {
    let factory = new ContractFactory(this.ABI, this.Bytecode, signer);
    return (factory.attach(addressOrName) as unknown) as ERC20Burnable;
  }

  public static deploy(signer: Signer): Promise<ERC20Burnable> {
    let factory = new ContractFactory(this.ABI, this.Bytecode, signer);
    return (factory.deploy() as unknown) as Promise<ERC20Burnable>;
  }

  public static ABI =
    '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
  public static Bytecode =
    "0x6080604052610ad4806100136000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c806370a082311161006657806370a082311461017e57806379cc6790146101a4578063a457c2d7146101d0578063a9059cbb146101fc578063dd62ed3e146102285761009e565b8063095ea7b3146100a357806318160ddd146100e357806323b872dd146100fd578063395093511461013357806342966c681461015f575b600080fd5b6100cf600480360360408110156100b957600080fd5b506001600160a01b038135169060200135610256565b604080519115158252519081900360200190f35b6100eb610273565b60408051918252519081900360200190f35b6100cf6004803603606081101561011357600080fd5b506001600160a01b03813581169160208101359091169060400135610279565b6100cf6004803603604081101561014957600080fd5b506001600160a01b038135169060200135610306565b61017c6004803603602081101561017557600080fd5b503561035a565b005b6100eb6004803603602081101561019457600080fd5b50356001600160a01b031661036e565b61017c600480360360408110156101ba57600080fd5b506001600160a01b038135169060200135610389565b6100cf600480360360408110156101e657600080fd5b506001600160a01b038135169060200135610397565b6100cf6004803603604081101561021257600080fd5b506001600160a01b038135169060200135610405565b6100eb6004803603604081101561023e57600080fd5b506001600160a01b0381358116916020013516610419565b600061026a610263610444565b8484610448565b50600192915050565b60025490565b6000610286848484610534565b6102fc84610292610444565b6102f7856040518060600160405280602881526020016109c4602891396001600160a01b038a166000908152600160205260408120906102d0610444565b6001600160a01b03168152602081019190915260400160002054919063ffffffff61069b16565b610448565b5060019392505050565b600061026a610313610444565b846102f78560016000610324610444565b6001600160a01b03908116825260208083019390935260409182016000908120918c16815292529020549063ffffffff61073216565b61036b610365610444565b82610793565b50565b6001600160a01b031660009081526020819052604090205490565b610393828261089b565b5050565b600061026a6103a4610444565b846102f785604051806060016040528060258152602001610a7a60259139600160006103ce610444565b6001600160a01b03908116825260208083019390935260409182016000908120918d1681529252902054919063ffffffff61069b16565b600061026a610412610444565b8484610534565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b3390565b6001600160a01b03831661048d5760405162461bcd60e51b8152600401808060200182810382526024815260200180610a566024913960400191505060405180910390fd5b6001600160a01b0382166104d25760405162461bcd60e51b815260040180806020018281038252602281526020018061097c6022913960400191505060405180910390fd5b6001600160a01b03808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b0383166105795760405162461bcd60e51b8152600401808060200182810382526025815260200180610a316025913960400191505060405180910390fd5b6001600160a01b0382166105be5760405162461bcd60e51b81526004018080602001828103825260238152602001806109376023913960400191505060405180910390fd5b6105c98383836108ef565b61060c8160405180606001604052806026815260200161099e602691396001600160a01b038616600090815260208190526040902054919063ffffffff61069b16565b6001600160a01b038085166000908152602081905260408082209390935590841681522054610641908263ffffffff61073216565b6001600160a01b038084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b6000818484111561072a5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b838110156106ef5781810151838201526020016106d7565b50505050905090810190601f16801561071c5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b60008282018381101561078c576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b6001600160a01b0382166107d85760405162461bcd60e51b8152600401808060200182810382526021815260200180610a106021913960400191505060405180910390fd5b6107e4826000836108ef565b6108278160405180606001604052806022815260200161095a602291396001600160a01b038516600090815260208190526040902054919063ffffffff61069b16565b6001600160a01b038316600090815260208190526040902055600254610853908263ffffffff6108f416565b6002556040805182815290516000916001600160a01b038516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9181900360200190a35050565b6108a58282610793565b610393826108b1610444565b6102f7846040518060600160405280602481526020016109ec602491396001600160a01b0388166000908152600160205260408120906102d0610444565b505050565b600061078c83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f77000081525061069b56fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a206275726e20616d6f756e7420657863656564732062616c616e636545524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a206275726e20616d6f756e74206578636565647320616c6c6f77616e636545524332303a206275726e2066726f6d20746865207a65726f206164647265737345524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa2646970667358221220bceadaad2f2a774e2fc69f227c22a09b870a12e2f383da24a65668720489cd0264736f6c63430006060033";
}
