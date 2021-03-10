# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "debian/contrib-buster64"

  # Forward ssh config
  config.ssh.forward_agent = true

  # Provision
  #  - This maps an alternate location for node_modules, 
  #    to avoid install conflicts with the host machine
  #
  config.vm.provision "shell", inline: <<-SHELL
    mkdir -p ~/node_modules
    mkdir -p ~/vagrant/webpress
    mkdir -p ~/webpress/node_modules
    chown vagrant:www-data ~/node_modules
    mount --bind ~/node_modules /home/vagrant/webpress/node_modules
  SHELL

  # Run production provisioning script
  #
  config.vm.provision :shell, path: "provision.sh", privileged: true

  # Hostname
  # 
  config.vm.network :private_network, :ip => "192.168.19.74"
  config.vm.network "private_network", type: "dhcp"

  # Mount directory
  # 
  config.vm.synced_folder ".", "/home/vagrant/webpress", :group => "www-data", :mount_options => ['dmode=775','fmode=664']
  
  # Performance improvements
  #  1. Assign a quarter of host memory and all available CPU's to VM
  #     Depending on host OS this has to be done differently.
  #  2. set --natdnshostresolver1 & --natdnsproxy1 to speed up external connections
  #
  config.vm.provider :virtualbox do |vb|
    host = RbConfig::CONFIG['host_os']

    if host =~ /darwin/
        cpus = `sysctl -n hw.ncpu`.to_i
        mem = `sysctl -n hw.memsize`.to_i / 1024 / 1024 / 4

    elsif host =~ /linux/
        cpus = `nproc`.to_i
        mem = `grep 'MemTotal' /proc/meminfo | sed -e 's/MemTotal://' -e 's/ kB//'`.to_i / 1024 / 4

    # windows:
    else
        cpus = 4
        mem = 2048
    end

    vb.customize ["modifyvm", :id, "--memory", mem]
    vb.customize ["modifyvm", :id, "--cpus", cpus]
    vb.customize ['modifyvm', :id, '--natdnshostresolver1', 'on']
    vb.customize ['modifyvm', :id, '--natdnsproxy1', 'on']
  end

end
