import { ethers } from 'ethers';
// prettier-ignore
import contractABI from './contract/abi.json';

// **Exemplo: como criar uma transação que mintará uma quantidade de tokens X de um contrato para uma carteira Y.**
//Esta função de exemplo recebe como inputs: para quem será mintado o token (addressTo) e o montante que será mintado (amount)

 async createMintTransaction(addressTo: string, amount: number): Promise<any> {
    //0 - definir a sua signatureKey (deve ser passada para vocês por algum dev da GREG)
    //quando você deseja realizar uma transação que a sua carteira master realizará (e não a carteira de um usuário), deve ser passado no bearer da requisição sua signatureKey, se não, deve ser passado o accessToken do user.
    const signatureKey = //...
 
    //1 - setar seu provider, um provider pode ser criado em plataformas como https://www.alchemy.com/
    const provider = new ethers.providers.JsonRpcProvider(
      'https://opt-goerli.g.alchemy.com/v2/d5EutXN-ONUVG_KPQmhE-yPeTTvEi5jI',
    );
    
    //2 - definir o endereço do contrato que você deseja chamar:
    const contractAddress = '0x5c373ebc06Ef1aEc2Cd30805Eb2184482e023b26';
    
    //3 - criar a instância do contrato, passando seu ABI, provider e endereço:
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider,
    );

    //4 - Definir a função que você quer chamar do contrato e os types de seus parâmetros em ordem (nesse caso, a função: mint(para quem mintar, quanto mintar) ):
    const functionSignature = 'mint(address, uint256)';

    //5 - Definir os inputs dos parâmetros da função
    const inputAddress = addressTo; //para quem será mintados os tokens
    const inputAmount = ethers.BigNumber.from(amount); //qual o montante que será mintado

    const dataInput = contract.interface.encodeFunctionData(functionSignature, [
      inputAddress,
      inputAmount,
    ]);
     
    //6 - Criar o objeto da transação (recomendável deixar o gasLimit em 30000).
    const objectTransaction = {
      toAddress: contractAddress,
      gasLimit: Number(30000),
      transactionData: dataInput,
    };
    
    //7 - Fazer a chamada para o sendTransaction do Greg, mandando o objectTransaction no body.
    const config = {
      method: 'post',
      url: `${process.env.URL_GREG}/transaction/sendTransactionMaster`,
      headers: {
        Authorization: `Bearer ${signatureKey}`,
        accept: 'application/json',
      },
      data: objectTransaction,
    };
    
    //8 - se tudo ocorrer certo, o greg devolverá um objeto com informações da transação confirmada.
    let res;
    await axios(config).then(function (response) {
      res = response.data;
      console.log(res);
    });
    return res;
  }
