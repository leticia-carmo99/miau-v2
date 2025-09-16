# miAu 
## Um ecossistema de comunicação pet
 
### Integrantes
 
* Leticia do Patrocínio
* Mayara Almeida
* Natália dos Santos
* Sabrina Oliveira
* Vinicius de Oliveira
* Vitor Damaceno
 
---
 
### Descrição Geral
 
O **miAu** é um aplicativo mobile desenvolvido em **React Native** que centraliza as principais demandas do universo pet em um só lugar. O projeto surgiu com o objetivo de resolver um problema comum no setor: a fragmentação de serviços. Atualmente, quem deseja adotar um animal, contratar um profissional ou cuidar do pet precisa acessar diversas plataformas diferentes. O miAu simplifica esse processo, unindo tudo em um ecossistema único, acessível e funcional.
 
O app atende três perfis principais de usuários:
 
1.  **Usuário comum**: donos de pets ou interessados em adoção, que acessam o app para encontrar animais e contratar serviços como veterinários ou adestradores.
2.  **ONGs**: usam o app como ferramenta de gestão para cadastrar animais, acompanhar processos de adoção e manter contato com adotantes.
3.  **Parceiros comerciais**: profissionais autônomos ou empresas que oferecem serviços pet, gerenciam seus horários, atendimentos e perfis diretamente pela plataforma.
 
---
 
### Funcionalidades
 
Para os **usuários**, o miAu oferece uma experiência simples e direta: é possível navegar entre pets disponíveis para adoção, conversar com ONGs através de um sistema de chat integrado e contratar serviços profissionais com poucos cliques. Toda a comunicação acontece dentro do próprio app, o que evita o uso de outras ferramentas externas e mantém o histórico organizado.
 
As **ONGs** têm acesso a funcionalidades específicas para sua operação diária. Além de cadastrar pets, elas contam com um chat dividido em duas abas, "Para Adotar" e "Pós-Adoção", permitindo acompanhar todo o ciclo da adoção, desde o primeiro contato até o suporte após a entrega do animal. Esse canal direto ajuda a garantir o bem-estar do pet após a adoção e facilita o acompanhamento do processo.
 
Já os **profissionais e empresas** do setor podem criar seus perfis detalhados, com informações como área de atuação (adestrador, veterinário etc.), horários disponíveis, dias de atendimento e descrição dos serviços. Um dashboard inicial permite visualizar o status do perfil e acessar oportunidades como destaque na plataforma ou plano premium, tornando o app não só uma vitrine, mas também uma ferramenta de gestão de carreira digital.
 
---
 
### Comunicação e Navegação
 
Um dos diferenciais do miAu é o sistema de **comunicação centralizada**. O chat conecta usuários, ONGs e profissionais, permitindo o envio de mensagens e imagens diretamente dentro do app. Isso elimina a necessidade de usar redes sociais ou mensageiros externos, além de oferecer uma comunicação mais organizada e segura.
 
A navegação foi pensada para ser simples e adaptada ao tipo de usuário. Cada perfil (usuário comum, ONG ou parceiro) vê apenas o que é relevante para ele. O menu lateral e as abas são personalizadas, evitando confusão e tornando a experiência mais fluida e objetiva. Essa arquitetura multi-fluxo permite que cada grupo tenha acesso apenas às funcionalidades que realmente importam para seu uso.
 
---
 
### Tecnologias Utilizadas
 
O projeto foi desenvolvido em **React Native**, com uso do ecossistema **Expo** para acelerar o desenvolvimento e facilitar o acesso a recursos nativos.
 
* **Navegação**: **React Navigation (v6)**, utilizando uma combinação de Stack, Drawer e Bottom Tabs.
* **Identidade visual**: Fontes customizadas (**Josefin Sans** e **Nunito**) via **Expo Google Fonts**.
* **Upload de imagens**: **Expo Image Picker**.
* **Ícones**: **Expo Vector Icons** (conjuntos Ionicons e MaterialCommunityIcons).
 
Atualmente, o projeto encontra-se na fase de front-end, com uso de dados estáticos para simular os fluxos. A próxima etapa será a integração com o **Firebase** (autenticação, banco de dados em tempo real para o chat e armazenamento de imagens).
