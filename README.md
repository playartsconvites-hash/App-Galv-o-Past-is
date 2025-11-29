# Galvão Pastéis - Delivery App 🥟

Aplicativo web moderno para delivery de mini pastéis e bebidas, com integração direta via WhatsApp e gerenciamento de cardápio via Google Sheets.

## 🚀 Funcionalidades

- **Cardápio Digital**: Exibição de produtos com imagens, descrições e preços.
- **Gerenciamento Fácil**: Cardápio atualizado via Planilha do Google (sem necessidade de banco de dados complexo).
- **Carrinho de Compras**: Adição de itens, controle de quantidade e cálculo automático.
- **Integração WhatsApp**: O pedido é formatado e enviado diretamente para o WhatsApp da loja.
- **Design Responsivo**: Funciona perfeitamente em celulares e computadores.
- **Identidade Visual**: Cores e logos personalizados da marca Galvão Pastéis.

## 🛠️ Tecnologias

- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**

## 📦 Como Rodar o Projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Gere a versão final para produção:**
   ```bash
   npm run build
   ```

## 📊 Gerenciamento de Produtos (Google Sheets)

O cardápio é controlado por uma planilha pública do Google. O site lê um arquivo CSV gerado por ela.

### Estrutura da Planilha
As colunas devem seguir **estritamente** esta ordem:

1. **id** (ex: `p-frango`)
2. **nome** (ex: `Mini Pastel de Frango`)
3. **tipo** (Opções: `pastel`, `bebida` ou `enroladinho`)
4. **descricao** (ex: `Recheio cremoso...`)
5. **preco** (ex: `0,85`)
6. **imagem** (Link direto da imagem)
7. **disponivel** (ex: `TRUE` ou `FALSE`)

### Como atualizar o link
Caso crie uma nova planilha:
1. Vá em **Arquivo > Compartilhar > Publicar na Web**.
2. Escolha a aba correta e o formato **Valores separados por vírgula (.csv)**.
3. Copie o link e atualize a variável `GOOGLE_SHEET_CSV_URL` no arquivo `constants.ts`.

## 📱 Deploy

Este projeto está configurado para deploy fácil na **Vercel**.
Basta conectar seu repositório GitHub à Vercel e o deploy será automático.

---
Desenvolvido para Galvão Pastéis - Umuarama/PR.