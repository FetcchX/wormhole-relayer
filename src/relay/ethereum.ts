import { ETH_PRIVATE_KEY, WORMHOLE_RELAYER_ABI, getWormholeRelayerAddress, publicEthClient } from "../config";
import { Other, Payload, VAA, parse } from "../vaa";
import { ethers } from "ethers";

export const relayEthereum = async (vaa: VAA<Payload | Other>, vaaBytes: Buffer) => {
    try {
        const {
            rpc,
            url
        } = publicEthClient((vaa.payload as any).chain)
        console.log('relaying to ', url, (vaa.payload as any).chain)
        const wallet = (new ethers.Wallet(ETH_PRIVATE_KEY)).connect(rpc)
    
        const relayerContract = new ethers.Contract(getWormholeRelayerAddress((vaa.payload as any).chain), WORMHOLE_RELAYER_ABI, wallet)
    
        const deliveryTx = await relayerContract.completeTransfer(
            `0x${vaaBytes.toString("hex")}`,
            {
                gasPrice: rpc.getGasPrice(),
                gasLimit: 500000
            }
        )
    
        await deliveryTx.wait()
    
        return deliveryTx
    } catch (e) {
        console.log(e, "failed ethereum tx")
        throw e
    }
}

// const buffer = Buffer.from("01000000030d000b28b89d13c43e6a0b95f92111dfb891e86bd9554ee68a7b035f95243922ea1e17c77d2b646ba2d2110370e0c90eccf37111909ee62ffddc29d56af3dc0401b600019f9cb2f02b82accc0b82acf36165fc44e1d7981e60eabe426ed63bc6c5b755ca7f20c2077189d72387ba08ed516c0beb11ccbb516a9bf40417956e793c551f4e0002dd826203259e7913f35df74487e3d5a97c2b4fa1762915e892f8cd70287b8c6a457348b6a92ee49ef38bc3f5c9ac9247b786f975819b27e889180128bbfef6b40104b955be7b9aeeab4f5df524df8a75565b417e6ac4eb463c69a86c11fadcc485954382428d4b0e4396e6ea271c8eac28733e98953c24e024f053efff87e83c00ba01069a7c4c33a41647f0026e31fba3ac1f6e738c3d9a20dbda26067477ae55e8f7013bb1eb7d8704cf442f71c78ace3540495746992b203c8da970ddd0b938e4d97d00073a3178c3a6972281abaab655be17ad80d64c9705dd82ddef98194dc95bd89b634767a7e04551d4b8896053035c04524972a00a2672d92ce93ba3f40f48d55353000a6f5bccf3864c5b9bfc8747da076a0a7a2a159605f8c7f78cec8073dab3739a9b2c433cc1724c2c6f620d75c5869a568fd40f89e892dc5395882c827d8beccf2f010caddafb924450f7f0d4ccf9f9ca1d90ed3d7d856a6645953c0ae0d2f00fa7ab29401b14d5ee0683dd2e2a868d1ab9a25b846fa11091633c424e94492a63ca519c010d13122510d6d4fd2cb9ea00227322a112a7fe625f615e6bbd92bf3a2fb957a3171b4d29e72c9cd1c908bb020af19831cff5470051f6868f0b663042dfb28cddef000ea60f187920d10e9d8e671d1818a8532a582402cae22b9aee66dc9e432bac5b5d44020c1af562179031eb5dc905bafb6dae50ea39868d79adee1166b9b1c6e2b1010f2a52141c29cbcea65b9e6402f496258aae5e857c4940ca613e8f99d1a292a9d4715be87bd7ff577773bddc3c3813ab274700f27a81ecb5393d4df6d4289d96d90010c75a3d11cefe2683be0ea28594e92976646a8b4f7196b1f49f1dd9b5c97888c3557dd241c1afcb3377236c610cacc12237298754aa85e3297d6c41c04e0085460112ba3ded7cc827387cf593ce15f9fce21908d8a3398369a7a95846f46445115baf79cbe0616034a8975549777a1cbf1f44a46ebe6759f29d3c16f0c8d4751a84890064ddda7b0000532d0001ec7372995d5cc8732397fb0ad35c0121e0eaa90d26f828a534cab54391b3a4f5000000000004b7f620010000000000000000000000000000000000000000000000000000000000002710c6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d6100010000000000000000000000001dccc9baf7e8d7a18f948acd467ce016044fc54600050000000000000000000000000000000000000000000000000000000000000000", "hex")
// relayEthereum(parse(buffer), buffer).then(x => console.log(x)).catch(e => console.log(e))