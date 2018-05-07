# Exemplo usando React + Micro

Este exemplo usa o [React](https://reactjs.org/) na aplicação front end e o [Micro](https://github.com/zeit/micro) como servidor.

### Pré-requisitos

Para rodar o exemplo no seu computador é preciso antes ter nele instalado:
- Git (https://git-scm.com/downloads)
- Node.js (https://nodejs.org/en/download/)

### Rodando o exemplo

Primeiramente, precisamos clonar o repositorio:
```cmd
    git clone https://github.com/EvoluServices/transaction-proposal.git
    cd transaction-proposal
```

Agora, para rodar o exemplo no seu computador, primeiro rodamos o servidor:
```cmd
    cd examples\react+micro\server
    npm install 
    cmd /C "set EVO_USERNAME=<seu_username_evo>&&set EVO_APIKEY=<sua_api_key_evo>&&set MERCHANT_ID=<id_do_seu_estab_teste>&&npm start"
```
Nota: `<seu_username_evo>`, `<sua_api_key_evo>` e `<id_do_seu_estab_teste>` são os valores fornecidos pela Evoluservices e no comando acima estamos setando seus valores como variáveis de ambiente para que o servidor os utilize.

Depois, abra outro terminal, navegue até a raíz do repositório `transaction-proposal` , e para rodarmos o front end:
```cmd
    cd examples\react+micro\client
    npm install 
    cmd /C "set PORT=3001&&npm start"
```

O seu navegador padrão já iniciará uma nova aba com a url `http://localhost:3001`