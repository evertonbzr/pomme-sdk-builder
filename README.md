# pomme-sdk-builder


**pomme-sdk-builder** é uma ferramenta de linha de comando (CLI) para gerar uma SDK para projetos que utilizam a biblioteca *pomme-ts*. Essa SDK permite fazer chamadas a uma API REST de forma simplificada, facilitando a interação com o serviço oferecido pela biblioteca *pomme-ts*.

## Funcionalidades

- Gere rapidamente uma SDK personalizada para seu projeto que utiliza a biblioteca *pomme-ts*.
- Simplifique as chamadas à API REST do seu serviço *pomme-ts* com uma interface de linha de comando amigável.

## Instalação

Instale o **pomme-sdk-builder**:

```bash
npm install pomme-sdk-builder
# or
yarn add pomme-sdk-builder
```

## Como usar?

Para usar o **pomme-sdk-builder**, você precisa de um servidor NodeJS rodando com o **pomme-ts** e com o generateRoutesOutput ativado, em seguida rode o comando:

pomme.config.json:
```json
{
  "default": {
    "input": {
      "targetUrl": "http://localhost:3061/pomme",
      "axios": {
        "baseUrl": "http://localhost:3061"
      }
    },
    "output": {
      "path": "./sdks/api"
    }
  }
}

```

execute:
```bash
npx pomme
```
