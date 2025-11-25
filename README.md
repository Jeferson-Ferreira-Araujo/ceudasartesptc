CEU das Artes - One Page (HTML/CSS/JS) with Firebase admin panel

INSTRUÇÕES RÁPIDAS:
1) Crie um projeto no Firebase (Firestore, Storage, Auth enabled).
2) Substitua as chaves em assets/js/firebase.js com suas credenciais.
3) Nos Regras do Firestore/Storage configure permissões de acordo com seu ambiente (para testes você pode liberar, mas em produção restrinja).
4) Configure Firebase Functions (folder functions/) e defina variáveis de ambiente MAIL_USER, MAIL_PASS, MAIL_TO para o envio de e-mails (ou use outro serviço SMTP).
5) Faça deploy no Firebase Hosting ou em qualquer servidor estático. O endpoint /sendEmail precisa apontar para a Cloud Function (ou ajuste main.js para o URL correto).
6) Crie um usuário no Firebase Auth (email/senha) e use admin/login.html para acessar o painel.

Arquivos principais:
- index.html : site público
- assets/ : css, js e imagem de logo placeholder
- admin/ : painel para gerenciar logo, banners, equipe e galeria
- functions/ : código da Cloud Function para envio de e-mail

Se quiser que eu gere o ZIP com alguma alteração (ex: trocar logo placeholder por sua logo, ou já preencher com alguns banners), me avise.
