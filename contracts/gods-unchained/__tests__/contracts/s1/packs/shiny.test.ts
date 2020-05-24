import 'jest';

import { Ganache, Blockchain,generatedWallets } from '@imtbl/test-utils';
import {
  Referral,
  ShinyPack,
  Cards,
  Raffle
} from '../../../../src/contracts';
import { ethers } from 'ethers';
import { PurchaseProcessor, CreditCardEscrow, Escrow, Beacon, getSignedPayment, Currency } from '@imtbl/platform';
import { parseLogs } from '@imtbl/utils';
import { rares, epics, legendaries } from './protos';
import { GU_S1_SHINY_PACK_PRICE, GU_S1_SHINY_PACK_SKU } from '../../../../deployment/constants';

jest.setTimeout(600000);

const provider = new Ganache(Ganache.DefaultOptions);
const blockchain = new Blockchain(provider);
const MAX_MINT = 5;

ethers.errors.setLogLevel('error');

describe('Shiny Pack', () => {

  const [owner] = generatedWallets(provider);

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('deployment', () => {

    let beacon: Beacon;
    let referral: Referral;
    let processor: PurchaseProcessor;
    let raffle: Raffle;
    let escrow: Escrow;
    let cc: CreditCardEscrow;

    beforeAll(async() => {
      escrow = await Escrow.deploy(owner);
      cc = await CreditCardEscrow.deploy(
        owner,
        escrow.address,
        ethers.constants.AddressZero,
        100,
        ethers.constants.AddressZero,
        100
      );
      beacon = await Beacon.deploy(owner);
      referral = await Referral.deploy(owner, 90, 10);
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      raffle = await Raffle.deploy(owner);
    });

    it('should deploy rare pack', async () => {
      await ShinyPack.deploy(
        owner,
        MAX_MINT,
        raffle.address,
        beacon.address, ethers.constants.AddressZero, referral.address, GU_S1_SHINY_PACK_SKU,
        cc.address, processor.address
      );
    });

  });

  describe('purchase', () => {

    let beacon: Beacon;
    let referral: Referral;
    let processor: PurchaseProcessor;
    let raffle: Raffle;
    let escrow: Escrow;
    let cc: CreditCardEscrow;
    let cards: Cards;
    let shiny: ShinyPack;

    beforeEach(async() => {
      escrow = await Escrow.deploy(owner);
      cc = await CreditCardEscrow.deploy(
        owner,
        escrow.address,
        owner.address,
        100,
        owner.address,
        100
      );
      beacon = await Beacon.deploy(owner);
      referral = await Referral.deploy(owner, 90, 10);
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      cards = await Cards.deploy(owner, 1250, 'Cards', 'CARD');
      raffle = await Raffle.deploy(owner);
      shiny = await ShinyPack.deploy(
        owner,
        MAX_MINT,
        raffle.address,
        beacon.address, cards.address, referral.address, GU_S1_SHINY_PACK_SKU,
        cc.address, processor.address
      );
      await processor.setSellerApproval(shiny.address, [GU_S1_SHINY_PACK_SKU], true);
      await processor.setSignerLimit(owner.address, 1000000000000000);
    });

    async function purchasePacks(quantity: number) {
      const order = {
        quantity, sku: GU_S1_SHINY_PACK_SKU,
        assetRecipient: owner.address,
        changeRecipient: owner.address,
        totalPrice: GU_S1_SHINY_PACK_PRICE * quantity,
        alreadyPaid: 0,
        currency: Currency.USDCents
      };
      const params = { escrowFor: 0, nonce: 0, value: GU_S1_SHINY_PACK_PRICE * quantity };
      const payment = await getSignedPayment(
         owner, processor.address, shiny.address, order, params
       );
      const tx = await shiny.purchase(quantity, payment, ethers.constants.AddressZero);
      const receipt = await tx.wait();
      const parsed = parseLogs(receipt.logs, ShinyPack.ABI);
      expect(parsed.length).toBe(1);
      expect(parsed[0].name).toBe('CommitmentRecorded');
    }

    it('should purchase one pack with USD', async () => {
      await purchasePacks(1);
    });

    it('should purchase five packs with USD', async () => {
      await purchasePacks(5);
    });

  });

  describe('mint', () => {

    let beacon: Beacon;
    let referral: Referral;
    let processor: PurchaseProcessor;
    let raffle: Raffle;
    let escrow: Escrow;
    let cc: CreditCardEscrow;
    let cards: Cards;
    let shiny: ShinyPack;

    beforeEach(async() => {
      escrow = await Escrow.deploy(owner);
      cc = await CreditCardEscrow.deploy(
        owner,
        escrow.address, owner.address, 100, owner.address, 100
      );
      beacon = await Beacon.deploy(owner);
      referral = await Referral.deploy(owner, 90, 10);
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      cards = await Cards.deploy(owner, 1250, 'Cards', 'CARD');
      raffle = await Raffle.deploy(owner);
      shiny = await ShinyPack.deploy(
        owner,
        MAX_MINT,
        raffle.address,
        beacon.address, cards.address, referral.address, GU_S1_SHINY_PACK_SKU,
        cc.address, processor.address
      );
      await processor.setSellerApproval(shiny.address, [GU_S1_SHINY_PACK_SKU], true);
      await processor.setSignerLimit(owner.address, 1000000000000000);
      await cards.startSeason('S1', 800, 1000);
      await cards.addFactory(shiny.address, 1);
      await raffle.setMinterApproval(shiny.address, true);
    });

    async function purchase(quantity: number, escrowFor: number) {
      const order = {
        quantity,
        sku: GU_S1_SHINY_PACK_SKU,
        assetRecipient: owner.address,
        changeRecipient: owner.address,
        totalPrice: GU_S1_SHINY_PACK_PRICE * quantity,
        alreadyPaid: 0,
        currency: Currency.USDCents
      };
      const params = { escrowFor, nonce: 0, value: GU_S1_SHINY_PACK_PRICE * quantity };
      const payment = await getSignedPayment(
        owner,
        processor.address,
        shiny.address,
        order,
        params
      );
      await shiny.purchase(quantity, payment, ethers.constants.AddressZero);
    }

    async function mintTrackGas(id: number, description: string) {
      const commitment = await shiny.commitments(id);
      const tx = await shiny.mint(id);
      const receipt = await tx.wait();
      console.log(description, receipt.gasUsed.toNumber());
      // we only care about events from the core contract
      const logs = receipt.logs.filter(log => log.address === cards.address);
      const parsed = parseLogs(logs, Cards.ABI);
      // the last event will be the minted event
      const log = parsed[parsed.length - 1];
      expect(log.name).toBe('CardsMinted');
      const protos = log.values.protos;
      const qualities = log.values.qualities;
      const packs = commitment.packQuantity.toNumber();
      expect(protos).toBeDefined();
      expect(protos.length).toBe(packs * 5);
      const rareOrBetter = protos.filter(p => {
        return rares.includes(p) || epics.includes(p) || legendaries.includes(p);
      }).length;
      const shinyLegendaryCount = protos.filter((p, i) => {
        return legendaries.includes(p) && qualities[i] <= 3;
      }).length;
      // must be at least one rare card in every pack
      expect(shinyLegendaryCount).toBeGreaterThanOrEqual(packs);
      expect(rareOrBetter).toBeGreaterThanOrEqual(packs * 2);
    }

    it('should create cards from 1 pack', async () => {
      await purchase(1, 100);
      await mintTrackGas(0, '1 pack escrow');
    });

    it('should create cards from 2 packs', async () => {
      await purchase(2, 100);
      await mintTrackGas(0, '2 pack escrow');
    });

    it('should create cards from 1 packs with no escrow', async () => {
      await purchase(1, 0);
      await mintTrackGas(0, '1 pack no escrow');
    });

  });

});
