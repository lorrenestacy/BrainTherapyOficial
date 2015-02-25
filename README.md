Blank Intel XDK App Designer Project for Cordova

See [LICENSE.md](<LICENSE.md>) for license terms and conditions.

Use this project as a starting point for an Intel XDK App Designer project for
creating an Apache Cordova hybrid mobile app. One key file (`init-dev.js`)
contains the initialization code needed to handle an Intel XDK device ready, a
Cordova device ready or browser document ready init events in a way that allows
you to run your app in any of these environments.

See the *Blank Cordova Starter* template for more information.

Descrição do projeto:

Applicação para dispositivos móveis(tablets e smartphones) de Terapia Ocupacional para paciente portadores de alzheimer na fase inicial e intermediária. Treina as funções cognitivas, memória e atenção dos pacientes. Uso assistido, com cuidadores, família e amigos. 
Há 3 elementos: O memória, O diário, Minhas músicas.

1 - treino da memória, simbolizam as lembranças de quando eram vibrantes. Mini quiz das lembranças - fotos de pessoas, animais, lugares, comidas etc. O paciente deve adivinhar qual é a relação, quem, o que é, quem pertence, de onde etc.

2 - agenda horarios e atividades no dia são marcados e apresentados, quando próximo de ocorrerem, na pag principal no campos atividades, há emotions que representam a disposição do paciente no canto superior direito da tela para cada periodo do dia(amanha, tarde e noite) - preciso apresetar uma pop-up para o paciente poder escolher a opção que melhor lhe representa. :)

3 - biblioteca de musicas terão descrições de fase/época em que foram ouvidas pelo paciente, serão agendadas nos horários de alimentação, lazer e trocas.
Obs.: Uso de murais; anotações de atividades, conteúdo, orientação - data, hora; representação - grandes ícones e ferramentas; tutorias breves de explicação; link para cuidadores - artigos de ajuda.


Instruções para instalação do Git no seu ambiente local(sua máquina vinculada ao git deste repositório)para contribuir na construção e desenvolvimento do BrainTherapy. Toda ajuda é bem-vinda e necessária. :)

1 - crie uma conta no git hub. instale o git hub(para versão windows se essa for sua máquina). Não esqueça de confirmar se o Gitbash foi instalado também no download, digo isso porque pode ser que tenha que instalá-lo se não estiver no git, assim como o glassfish para o netbeans. O gitbash serve como o prompt do git, lá vc fará linhas de comando para a comunicação do seu pc com o repositório central(onde iremos trabalhar no projeto).

2 - associar sua conta do github com este computador:
Gerar um ashh key - irá te permitir comitar seu pc com o git.(parte um pouco complicada)
Abra o git bash e cole: " git config --global user.email johndoe@example.com "(o email de cadastro do seu usuário git).
  http://git-scm.com/book/pt-br/v1/Git-no-Servidor-Gerando-Sua-Chave-P%C3%BAblica-SSH (link de tutorial para a próxima ação)
digite agora: 
$ cd ~/.ssh
$ ls
$ authorized_keys2  id_dsa       known_hosts
$ config            id_dsa.pub
          (isso verifica se você já possui a chave)
          
agora: 
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/schacon/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/schacon/.ssh/id_rsa.
Your public key has been saved in /Users/schacon/.ssh/id_rsa.pub.
The key fingerprint is:
43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a schacon@agadorlaptop.local
        (gerando o código propriamente dito)

3 - agora é só aguardar nossa aceitação pela nossa aba Pull Requests.

Após tudo estiver certo, vamos formar um plano para os próximos trabalhos.


