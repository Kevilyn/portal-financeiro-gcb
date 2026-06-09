# Como subir no GitHub e deixar funcionando

Este projeto ja esta preparado para GitHub Pages.

## 1. Criar o repositorio

1. Entre em https://github.com/new
2. Crie um repositorio novo.
3. Pode deixar como publico ou privado.
4. Nao marque para criar README, porque este projeto ja tem arquivos.

## 2. Enviar os arquivos

Abra o terminal dentro da pasta do projeto e rode:

```bash
git init
git add .
git commit -m "Publica portal financeiro"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git push -u origin main
```

Troque `SEU_USUARIO` e `NOME_DO_REPOSITORIO` pelos dados do seu GitHub.

## 3. Ativar GitHub Pages

1. No GitHub, abra o repositorio.
2. Va em `Settings` > `Pages`.
3. Em `Build and deployment`, selecione `GitHub Actions`.
4. Volte na aba `Actions` e aguarde o workflow `Deploy GitHub Pages` terminar.

Quando finalizar, o site ficara disponivel em uma URL parecida com:

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/
```

## Por que foi ajustado

- O app usava rotas normais do navegador, que podem quebrar no GitHub Pages ao atualizar a pagina.
- Agora usa rotas com `#`, por exemplo `/#/dashboard`, que funcionam em hospedagem estatica.
- O Vite foi configurado com `base: './'` para carregar CSS e JS corretamente mesmo dentro de um subdiretorio do GitHub Pages.
- Foi criado um workflow em `.github/workflows/deploy.yml` para publicar automaticamente.

## Rodar antes de subir

Em uma maquina com Node e npm:

```bash
npm ci
npm run build
npm run dev
```
