FROM node:24-trixie

USER root

ARG USERNAME=vscode
ARG USER_UID=2000
ARG USER_GID=2000

RUN groupadd --gid $USER_GID $USERNAME \
  && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME

ADD install_packages /usr/bin

RUN chmod +x /usr/bin/install_packages

RUN install_packages \
  git \
  sudo \
  curl \
  wget \
  jq \
  zip \
  openssh-client

RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME

#RUN curl -fsSL https://get.pnpm.io/install.sh | sh bash

USER vscode

#RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

#RUN . ~/.profile \
#  && volta install "node@20"  \
#  && npm install --global typescript \
#  && npm install --global wrangler


#RUN echo "source /home/vscode/.env/setenv.sh" >> ~/.profile

