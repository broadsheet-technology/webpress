#!/bin/bash
#
# provision.sh

# 1. Set Clocks
#
echo "US/Central" > /etc/timezone
dpkg-reconfigure --frontend noninteractive tzdata
echo 'ntpdate ntp.ubuntu.com' > /etc/cron.daily/ntpdate
chmod +x /etc/cron.daily/ntpdate

# 2. Install Dependencies
# 
apt update -y
apt install -y curl git npm rsync

# nodejs & npm:
curl -sL https://deb.nodesource.com/setup_current.x | sudo -E bash -
apt update -y
apt install -y nodejs
apt install -y npm

npm install -g n
npm install -g npm
n stable

# docker & npm:
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
apt-get update -y
apt-get install docker-ce docker-ce-cli -y
apt-get install docker-compose -y


# 3. Build & Run
#
cd /home/vagrant/wjh.dev

npm install
npm run build

service docker start
docker network create wjh.dev-network
docker-compose up -d

echo 'Finished provision.sh'
