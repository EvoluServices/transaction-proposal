const { json } =require('micro');
const fetch = require('node-fetch');
const { router, get, post } = require('microrouter'); 

const EVO_BASE_URL = 'https://staging.evoluservices.com';

// obtemos os valores "username", "apiKey" e "merchantId" das variáveis de ambiente
// IMPORTANTE: note que fazemos isso no nosso servidor, e não no app web, pois essas
// informações não devem estar disponíveis ao cliente.
const username = process.env.EVO_USERNAME;
if (!username) {
  throw new Error('É preciso definir a variável de ambiente "EVO_USERNAME"');
}
const apiKey = process.env.EVO_APIKEY;
if (!apiKey) {
  throw new Error('É preciso definir a variável de ambiente "EVO_APIKEY"');
}
const merchantId = process.env.MERCHANT_ID;
if (!merchantId) {
  throw new Error('É preciso definir a variável de ambiente "MERCHANT_ID"');
}

const transaction = async (request, response) => {
  // obtemos os dados da transacao a partir da requisicao
  const transactionPayload = await json(request);

  // antes de iniciar a transacao, fazemos a requisicao de um novo token na evoluservices
  const tokenResponse = await fetch(`${EVO_BASE_URL}/remote/token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({auth: {
      username,
      apiKey,
    }}),
  });
  const { Bearer } = await tokenResponse.json();

  // Em posse do token e dos dados da transacao, fazemos a requisicao no endpoint
  // "/remote/transaction" da Evoluservices para iniciarmos uma nova transacao
  const transactionResponse = await fetch(`${EVO_BASE_URL}/remote/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'bearer': Bearer
    },
    body: JSON.stringify({
      transaction: {
        ...transactionPayload.transaction,
        merchantId,
      }
    })
  });
  const resposta = await transactionResponse.text();
  response.end(resposta);
}

module.exports = router(
  post('/transaction', transaction),
);