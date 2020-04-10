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

interface EscrowInterface extends Interface {
  functions: {
    listTransferEnabled: TypedFunctionDescription<{
      encode([]: [string]): string;
    }>;

    mutexLocked: TypedFunctionDescription<{ encode([]: []): string }>;

    renounceOwnership: TypedFunctionDescription<{ encode([]: []): string }>;

    vaults: TypedFunctionDescription<{ encode([]: [BigNumberish]): string }>;

    owner: TypedFunctionDescription<{ encode([]: []): string }>;

    isOwner: TypedFunctionDescription<{ encode([]: []): string }>;

    batchTransferEnabled: TypedFunctionDescription<{
      encode([]: [string]): string;
    }>;

    transferOwnership: TypedFunctionDescription<{
      encode([newOwner]: [string]): string;
    }>;

    callbackEscrow: TypedFunctionDescription<{
      encode([_vault, _callbackTo, _callbackData]: [
        {
          player: string;
          releaser: string;
          asset: string;
          balance: BigNumberish;
          lowTokenID: BigNumberish;
          highTokenID: BigNumberish;
          tokenIDs: Array<BigNumberish>;
        },
        string,
        Arrayish
      ]): string;
    }>;

    escrow: TypedFunctionDescription<{
      encode([_vault, _from]: [
        {
          player: string;
          releaser: string;
          asset: string;
          balance: BigNumberish;
          lowTokenID: BigNumberish;
          highTokenID: BigNumberish;
          tokenIDs: Array<BigNumberish>;
        },
        string
      ]): string;
    }>;

    release: TypedFunctionDescription<{
      encode([_id, _to]: [BigNumberish, string]): string;
    }>;

    setBatchTransferEnabled: TypedFunctionDescription<{
      encode([_asset, _enabled]: [string, boolean]): string;
    }>;

    setListTransferEnabled: TypedFunctionDescription<{
      encode([_asset, _enabled]: [string, boolean]): string;
    }>;
  };
  events: {
    Escrowed: TypedEventDescription<{
      encodeTopics([id, vault]: [BigNumberish | null, null]): string[];
    }>;

    Released: TypedEventDescription<{
      encodeTopics([id, to]: [BigNumberish | null, null]): string[];
    }>;

    OwnershipTransferred: TypedEventDescription<{
      encodeTopics([previousOwner, newOwner]: [
        string | null,
        string | null
      ]): string[];
    }>;
  };
}

export interface Escrow {
  interface: EscrowInterface;
  connect(signerOrProvider: Signer | Provider | string): Escrow;
  attach(addressOrName: string): Escrow;
  deployed(): Promise<Escrow>;
  on(event: EventFilter | string, listener: Listener): Escrow;
  once(event: EventFilter | string, listener: Listener): Escrow;
  addListener(eventName: EventFilter | string, listener: Listener): Escrow;
  removeAllListeners(eventName: EventFilter | string): Escrow;
  removeListener(eventName: any, listener: Listener): Escrow;

  listTransferEnabled(arg0: string): Promise<boolean>;
  mutexLocked(): Promise<boolean>;
  renounceOwnership(
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  vaults(
    arg0: BigNumberish
  ): Promise<{
    player: string;
    releaser: string;
    asset: string;
    balance: BigNumber;
    lowTokenID: BigNumber;
    highTokenID: BigNumber;
    0: string;
    1: string;
    2: string;
    3: BigNumber;
    4: BigNumber;
    5: BigNumber;
  }>;
  owner(): Promise<string>;
  isOwner(): Promise<boolean>;
  batchTransferEnabled(arg0: string): Promise<boolean>;
  transferOwnership(
    newOwner: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  callbackEscrow(
    _vault: {
      player: string;
      releaser: string;
      asset: string;
      balance: BigNumberish;
      lowTokenID: BigNumberish;
      highTokenID: BigNumberish;
      tokenIDs: Array<BigNumberish>;
    },
    _callbackTo: string,
    _callbackData: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  escrow(
    _vault: {
      player: string;
      releaser: string;
      asset: string;
      balance: BigNumberish;
      lowTokenID: BigNumberish;
      highTokenID: BigNumberish;
      tokenIDs: Array<BigNumberish>;
    },
    _from: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  release(
    _id: BigNumberish,
    _to: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  setBatchTransferEnabled(
    _asset: string,
    _enabled: boolean,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;
  setListTransferEnabled(
    _asset: string,
    _enabled: boolean,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  Escrowed(id: BigNumberish | null, vault: null): EventFilter;
  Released(id: BigNumberish | null, to: null): EventFilter;
  OwnershipTransferred(
    previousOwner: string | null,
    newOwner: string | null
  ): EventFilter;

  estimate: {
    listTransferEnabled(arg0: string): Promise<BigNumber>;
    mutexLocked(): Promise<BigNumber>;
    renounceOwnership(): Promise<BigNumber>;
    vaults(arg0: BigNumberish): Promise<BigNumber>;
    owner(): Promise<BigNumber>;
    isOwner(): Promise<BigNumber>;
    batchTransferEnabled(arg0: string): Promise<BigNumber>;
    transferOwnership(newOwner: string): Promise<BigNumber>;
    callbackEscrow(
      _vault: {
        player: string;
        releaser: string;
        asset: string;
        balance: BigNumberish;
        lowTokenID: BigNumberish;
        highTokenID: BigNumberish;
        tokenIDs: Array<BigNumberish>;
      },
      _callbackTo: string,
      _callbackData: Arrayish
    ): Promise<BigNumber>;
    escrow(
      _vault: {
        player: string;
        releaser: string;
        asset: string;
        balance: BigNumberish;
        lowTokenID: BigNumberish;
        highTokenID: BigNumberish;
        tokenIDs: Array<BigNumberish>;
      },
      _from: string
    ): Promise<BigNumber>;
    release(_id: BigNumberish, _to: string): Promise<BigNumber>;
    setBatchTransferEnabled(
      _asset: string,
      _enabled: boolean
    ): Promise<BigNumber>;
    setListTransferEnabled(
      _asset: string,
      _enabled: boolean
    ): Promise<BigNumber>;
  };
}

export class Escrow extends Contract {
  public static at(signer: Signer, addressOrName: string): Escrow {
    let factory = new ContractFactory(this.ABI, this.Bytecode, signer);
    return (factory.attach(addressOrName) as unknown) as Escrow;
  }

  public static deploy(signer: Signer): Promise<Escrow> {
    let factory = new ContractFactory(this.ABI, this.Bytecode, signer);
    return (factory.deploy() as unknown) as Promise<Escrow>;
  }

  public static ABI =
    '[{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"listTransferEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"mutexLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"vaults","outputs":[{"internalType":"address","name":"player","type":"address"},{"internalType":"address","name":"releaser","type":"address"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"lowTokenID","type":"uint256"},{"internalType":"uint256","name":"highTokenID","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"batchTransferEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"address","name":"player","type":"address"},{"internalType":"address","name":"releaser","type":"address"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"lowTokenID","type":"uint256"},{"internalType":"uint256","name":"highTokenID","type":"uint256"},{"internalType":"uint256[]","name":"tokenIDs","type":"uint256[]"}],"indexed":false,"internalType":"struct IEscrow.Vault","name":"vault","type":"tuple"}],"name":"Escrowed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"address","name":"to","type":"address"}],"name":"Released","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"player","type":"address"},{"internalType":"address","name":"releaser","type":"address"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"lowTokenID","type":"uint256"},{"internalType":"uint256","name":"highTokenID","type":"uint256"},{"internalType":"uint256[]","name":"tokenIDs","type":"uint256[]"}],"internalType":"struct IEscrow.Vault","name":"_vault","type":"tuple"},{"internalType":"address","name":"_callbackTo","type":"address"},{"internalType":"bytes","name":"_callbackData","type":"bytes"}],"name":"callbackEscrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"player","type":"address"},{"internalType":"address","name":"releaser","type":"address"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"lowTokenID","type":"uint256"},{"internalType":"uint256","name":"highTokenID","type":"uint256"},{"internalType":"uint256[]","name":"tokenIDs","type":"uint256[]"}],"internalType":"struct IEscrow.Vault","name":"_vault","type":"tuple"},{"internalType":"address","name":"_from","type":"address"}],"name":"escrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"release","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_asset","type":"address"},{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setBatchTransferEnabled","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_asset","type":"address"},{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setListTransferEnabled","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
  public static Bytecode =
    "0x608060405260006100176001600160e01b0361006616565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a35061006a565b3390565b61204a806100796000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80638c64ea4a1161008c578063bf0cc65a11610066578063bf0cc65a14610197578063c0046943146101aa578063d50ae7ea146101bd578063f2fde38b146101d0576100cf565b80638c64ea4a146101555780638da5cb5b1461017a5780638f32d59b1461018f576100cf565b80634e344acb146100d4578063563a962c146100fd5780636cefa6d51461011d578063715018a6146101255780637fb7279c1461012f5780638124fea614610142575b600080fd5b6100e76100e2366004611660565b6101e3565b6040516100f49190611ef2565b60405180910390f35b61011061010b3660046115c4565b610378565b6040516100f49190611df2565b61011061038d565b61012d61039d565b005b61012d61013d366004611608565b61040b565b61012d61015036600461175f565b61045a565b610168610163366004611723565b6106bd565b6040516100f496959493929190611cf3565b610182610710565b6040516100f49190611ce5565b610110610720565b61012d6101a5366004611608565b610744565b6101106101b83660046115c4565b610793565b6100e76101cb3660046116a7565b6107a8565b61012d6101de3660046115c4565b610b1d565b60008054600160a01b900460ff16156102175760405162461bcd60e51b815260040161020e90611e11565b60405180910390fd5b60408301516001600160a01b03166102415760405162461bcd60e51b815260040161020e90611e81565b60208301516001600160a01b031661026b5760405162461bcd60e51b815260040161020e90611ea1565b6060830151156103055782604001516001600160a01b03166323b872dd833086606001516040518463ffffffff1660e01b81526004016102ad93929190611d7a565b602060405180830381600087803b1580156102c757600080fd5b505af11580156102db573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506102ff9190810190611642565b50610366565b60c083015151156103205761031b838330610b4d565b610366565b600061033d84608001518560a00151610c7f90919063ffffffff16565b111561034e5761031b838330610cc1565b60405162461bcd60e51b815260040161020e90611e51565b61036f83610da6565b90505b92915050565b60026020526000908152604090205460ff1681565b600054600160a01b900460ff1681565b6103a5610720565b6103c15760405162461bcd60e51b815260040161020e90611ec1565b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b610413610720565b61042f5760405162461bcd60e51b815260040161020e90611ec1565b6001600160a01b03919091166000908152600260205260409020805460ff1916911515919091179055565b610462611316565b6003838154811061046f57fe5b60009182526020918290206040805160e081018252600790930290910180546001600160a01b0390811684526001820154811684860152600282015416838301526003810154606084015260048101546080840152600581015460a08401526006810180548351818702810187019094528084529394919360c08601939283018282801561051c57602002820191906000526020600020905b815481526020019060010190808311610508575b5050505050815250509050336001600160a01b031681602001516001600160a01b03161461055c5760405162461bcd60e51b815260040161020e90611e91565b6060810151156105f45780604001516001600160a01b031663a9059cbb8383606001516040518363ffffffff1660e01b815260040161059c929190611dd7565b602060405180830381600087803b1580156105b657600080fd5b505af11580156105ca573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506105ee9190810190611642565b5061061a565b60c0810151511561060f5761060a813084610b4d565b61061a565b61061a813084610cc1565b827f4d436de77f1139fda664b657c73ad6c3bde4a1984d3aabeab7c3998556b93b638360405161064a9190611ce5565b60405180910390a26003838154811061065f57fe5b60009182526020822060079091020180546001600160a01b03199081168255600182018054821690556002820180549091169055600381018290556004810182905560058101829055906106b6600683018261136e565b5050505050565b600381815481106106ca57fe5b60009182526020909120600790910201805460018201546002830154600384015460048501546005909501546001600160a01b0394851696509284169491909316929186565b6000546001600160a01b03165b90565b600080546001600160a01b0316610735610f66565b6001600160a01b031614905090565b61074c610720565b6107685760405162461bcd60e51b815260040161020e90611ec1565b6001600160a01b03919091166000908152600160205260409020805460ff1916911515919091179055565b60016020526000908152604090205460ff1681565b60008054600160a01b900460ff16156107d35760405162461bcd60e51b815260040161020e90611e11565b60408401516001600160a01b03166107fd5760405162461bcd60e51b815260040161020e90611e81565b60208401516001600160a01b03166108275760405162461bcd60e51b815260040161020e90611ea1565b6060840151600090156108bb5784604001516001600160a01b03166370a08231306040518263ffffffff1660e01b81526004016108649190611ce5565b60206040518083038186803b15801561087c57600080fd5b505afa158015610890573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506108b49190810190611741565b9050610952565b60c085015151156108f1576108cf85610f6a565b156108ec5760405162461bcd60e51b815260040161020e90611e61565b610952565b600061090e86608001518760a00151610c7f90919063ffffffff16565b111561093a5761091d85610fc0565b156108ec5760405162461bcd60e51b815260040161020e90611eb1565b60405162461bcd60e51b815260040161020e90611e31565b6000805460ff60a01b1916600160a01b1790556040516001600160a01b0385169061097e908590611cd9565b6000604051808303816000865af19150503d80600081146109bb576040519150601f19603f3d011682016040523d82523d6000602084013e6109c0565b606091505b50506000805460ff60a01b1916905550606085015115610a91578460600151610a6f8287604001516001600160a01b03166370a08231306040518263ffffffff1660e01b8152600401610a139190611ce5565b60206040518083038186803b158015610a2b57600080fd5b505afa158015610a3f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250610a639190810190611741565b9063ffffffff610c7f16565b14610a8c5760405162461bcd60e51b815260040161020e90611e41565b610b09565b60c08501515115610ac157610aa585610ffa565b610a8c5760405162461bcd60e51b815260040161020e90611e71565b6000610ade86608001518760a00151610c7f90919063ffffffff16565b1115610b0957610aed856110d5565b610b095760405162461bcd60e51b815260040161020e90611ed1565b610b1285610da6565b9150505b9392505050565b610b25610720565b610b415760405162461bcd60e51b815260040161020e90611ec1565b610b4a8161118c565b50565b6040808401516001600160a01b031660009081526002602052205460ff1615610bdf5782604001516001600160a01b0316630bbe0ee383838660c001516040518463ffffffff1660e01b8152600401610ba893929190611d4d565b600060405180830381600087803b158015610bc257600080fd5b505af1158015610bd6573d6000803e3d6000fd5b50505050610c7a565b60005b8360c0015151811015610c785783604001516001600160a01b03166323b872dd84848760c001518581518110610c1457fe5b60200260200101516040518463ffffffff1660e01b8152600401610c3a93929190611d7a565b600060405180830381600087803b158015610c5457600080fd5b505af1158015610c68573d6000803e3d6000fd5b505060019092019150610be29050565b505b505050565b600061036f83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f77000081525061120d565b6040808401516001600160a01b031660009081526001602052205460ff1615610d2257604080840151608085015160a086015192516362fa093d60e11b81526001600160a01b039092169263c5f4127a92610ba89287928792600401611da2565b60808301515b8360a00151811015610c785783604001516001600160a01b03166323b872dd8484846040518463ffffffff1660e01b8152600401610d6893929190611d7a565b600060405180830381600087803b158015610d8257600080fd5b505af1158015610d96573d6000803e3d6000fd5b505060019092019150610d289050565b600380546001808201808455600093845284517fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b600790940293840180546001600160a01b03199081166001600160a01b039384161782556020808901517fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85c88018054841691861691909117905560408901517fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85d88018054909316941693909317905560608701517fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85e86015560808701517fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85f86015560a08701517fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f86086015560c0870151805187968994610f20937fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f8619092019291019061138c565b505050039050807f7a214f6f907551f2f817959302c6b0f2ebfb2e8c709dcaeece5e3ef430c7e2d084604051610f569190611ee1565b60405180910390a290505b919050565b3390565b6000805b8260c0015151811015610fb757610fa083604001518460c001518381518110610f9357fe5b6020026020010151611239565b15610faf576001915050610f61565b600101610f6e565b50600092915050565b60808101516000905b8260a00151811015610fb757610fe3836040015182611239565b15610ff2576001915050610f61565b600101610fc9565b6000805b8260c00151518110156110cc57306001600160a01b031683604001516001600160a01b0316636352211e8560c00151848151811061103857fe5b60200260200101516040518263ffffffff1660e01b815260040161105c9190611ef2565b60206040518083038186803b15801561107457600080fd5b505afa158015611088573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506110ac91908101906115ea565b6001600160a01b0316146110c4576000915050610f61565b600101610ffe565b50600192915050565b60808101516000905b8260a001518110156110cc5760408084015190516331a9108f60e11b815230916001600160a01b031690636352211e9061111c908590600401611ef2565b60206040518083038186803b15801561113457600080fd5b505afa158015611148573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525061116c91908101906115ea565b6001600160a01b031614611184576000915050610f61565b6001016110de565b6001600160a01b0381166111b25760405162461bcd60e51b815260040161020e90611e21565b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b600081848411156112315760405162461bcd60e51b815260040161020e9190611e00565b505050900390565b600060608260405160240161124e9190611ef2565b60408051601f198184030181529181526020820180516001600160e01b03166331a9108f60e11b179052519091506000906060906001600160a01b03871690611298908590611cd9565b6000604051808303816000865af19150503d80600081146112d5576040519150601f19603f3d011682016040523d82523d6000602084013e6112da565b606091505b5091509150811561130a5760148101516001600160a01b038116301415611308576001945050505050610372565b505b50600095945050505050565b6040518060e0016040528060006001600160a01b0316815260200160006001600160a01b0316815260200160006001600160a01b03168152602001600081526020016000815260200160008152602001606081525090565b5080546000825590600052602060002090810190610b4a91906113d7565b8280548282559060005260206000209081019282156113c7579160200282015b828111156113c75782518255916020019190600101906113ac565b506113d39291506113d7565b5090565b61071d91905b808211156113d357600081556001016113dd565b803561037281611fe1565b805161037281611fe1565b600082601f83011261141857600080fd5b813561142b61142682611f27565b611f00565b9150818183526020840193506020810190508385602084028201111561145057600080fd5b60005b8381101561147c578161146688826115ae565b8452506020928301929190910190600101611453565b5050505092915050565b803561037281611ff5565b805161037281611ff5565b600082601f8301126114ad57600080fd5b81356114bb61142682611f48565b915080825260208301602083018583830111156114d757600080fd5b6114e2838284611f9f565b50505092915050565b600060e082840312156114fd57600080fd5b61150760e0611f00565b9050600061151584846113f1565b8252506020611526848483016113f1565b602083015250604061153a848285016113f1565b604083015250606061154e848285016115ae565b6060830152506080611562848285016115ae565b60808301525060a0611576848285016115ae565b60a08301525060c082013567ffffffffffffffff81111561159657600080fd5b6115a284828501611407565b60c08301525092915050565b803561037281611ffe565b805161037281611ffe565b6000602082840312156115d657600080fd5b60006115e284846113f1565b949350505050565b6000602082840312156115fc57600080fd5b60006115e284846113fc565b6000806040838503121561161b57600080fd5b600061162785856113f1565b925050602061163885828601611486565b9150509250929050565b60006020828403121561165457600080fd5b60006115e28484611491565b6000806040838503121561167357600080fd5b823567ffffffffffffffff81111561168a57600080fd5b611696858286016114eb565b9250506020611638858286016113f1565b6000806000606084860312156116bc57600080fd5b833567ffffffffffffffff8111156116d357600080fd5b6116df868287016114eb565b93505060206116f0868287016113f1565b925050604084013567ffffffffffffffff81111561170d57600080fd5b6117198682870161149c565b9150509250925092565b60006020828403121561173557600080fd5b60006115e284846115ae565b60006020828403121561175357600080fd5b60006115e284846115b9565b6000806040838503121561177257600080fd5b600061169685856115ae565b600061178a8383611cd0565b505060200190565b61179b81611f83565b82525050565b60006117ac82611f76565b6117b68185611f7a565b93506117c183611f70565b8060005b838110156117ef5781516117d9888261177e565b97506117e483611f70565b9250506001016117c5565b509495945050505050565b600061180582611f76565b61180f8185611f7a565b935061181a83611f70565b8060005b838110156117ef578151611832888261177e565b975061183d83611f70565b92505060010161181e565b61179b81611f8e565b600061185c82611f76565b6118668185610f61565b9350611876818560208601611fab565b9290920192915050565b600061188b82611f76565b6118958185611f7a565b93506118a5818560208601611fab565b6118ae81611fd7565b9093019392505050565b60006118c5602183611f7a565b7f494d3a457363726f773a206d75746578206d75737420626520756e6c6f636b658152601960fa1b602082015260400192915050565b6000611908602683611f7a565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206181526564647265737360d01b602082015260400192915050565b6000611950601883611f7a565b7f494d3a457363726f773a20696e76616c6964207661756c740000000000000000815260200192915050565b6000611989602b83611f7a565b7f494d3a457363726f773a206d7573742068617665207472616e7366657272656481526a2074686520746f6b656e7360a81b602082015260400192915050565b60006119d6601d83611f7a565b7f494d3a457363726f773a20696e76616c6964207661756c742074797065000000815260200192915050565b6000611a0f602c83611f7a565b7f494d3a457363726f773a206c697374206d757374206e6f7420626520616c726581526b18591e48195cd8dc9bddd95960a21b602082015260400192915050565b6000611a5d603483611f7a565b7f494d3a457363726f773a206c697374206d757374206e6f77206265206f776e658152731908189e48195cd8dc9bddc818dbdb9d1c9858dd60621b602082015260400192915050565b6000611ab3602383611f7a565b7f494d3a457363726f773a206d7573742062652061206e6f6e2d6e756c6c2061738152621cd95d60ea1b602082015260400192915050565b6000611af8601f83611f7a565b7f494d3a457363726f773a206d757374206265207468652072656c656173657200815260200192915050565b6000611b31601f83611f7a565b7f494d3a457363726f773a206d757374206861766520612072656c656173657200815260200192915050565b6000611b6a602d83611f7a565b7f494d3a457363726f773a206261746368206d757374206e6f7420626520616c7281526c1958591e48195cd8dc9bddd959609a1b602082015260400192915050565b6000611bb9602083611f7a565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572815260200192915050565b6000611bf2603583611f7a565b7f494d3a457363726f773a206261746368206d757374206e6f74206265206f776e815274195908189e48195cd8dc9bddc818dbdb9d1c9858dd605a1b602082015260400192915050565b805160009060e0840190611c508582611792565b506020830151611c636020860182611792565b506040830151611c766040860182611792565b506060830151611c896060860182611cd0565b506080830151611c9c6080860182611cd0565b5060a0830151611caf60a0860182611cd0565b5060c083015184820360c0860152611cc782826117a1565b95945050505050565b61179b8161071d565b6000610b168284611851565b602081016103728284611792565b60c08101611d018289611792565b611d0e6020830188611792565b611d1b6040830187611792565b611d286060830186611cd0565b611d356080830185611cd0565b611d4260a0830184611cd0565b979650505050505050565b60608101611d5b8286611792565b611d686020830185611792565b8181036040830152611cc781846117fa565b60608101611d888286611792565b611d956020830185611792565b6115e26040830184611cd0565b60808101611db08287611792565b611dbd6020830186611792565b611dca6040830185611cd0565b611cc76060830184611cd0565b60408101611de58285611792565b610b166020830184611cd0565b602081016103728284611848565b6020808252810161036f8184611880565b60208082528101610372816118b8565b60208082528101610372816118fb565b6020808252810161037281611943565b602080825281016103728161197c565b60208082528101610372816119c9565b6020808252810161037281611a02565b6020808252810161037281611a50565b6020808252810161037281611aa6565b6020808252810161037281611aeb565b6020808252810161037281611b24565b6020808252810161037281611b5d565b6020808252810161037281611bac565b6020808252810161037281611be5565b6020808252810161036f8184611c3c565b602081016103728284611cd0565b60405181810167ffffffffffffffff81118282101715611f1f57600080fd5b604052919050565b600067ffffffffffffffff821115611f3e57600080fd5b5060209081020190565b600067ffffffffffffffff821115611f5f57600080fd5b506020601f91909101601f19160190565b60200190565b5190565b90815260200190565b600061037282611f93565b151590565b6001600160a01b031690565b82818337506000910152565b60005b83811015611fc6578181015183820152602001611fae565b83811115610c785750506000910152565b601f01601f191690565b611fea81611f83565b8114610b4a57600080fd5b611fea81611f8e565b611fea8161071d56fea365627a7a723158205c29849b864dbf80e122c3bbe57ff669b224fb038a7b4a9f2a6a275123f147f26c6578706572696d656e74616cf564736f6c634300050b0040";
}
