#!/bin/bash
echo "installing needed packages"
apt-get -y install apache2 libapache2-mod-wsgi-py3 python3-flask python3.5 python3.5-venv python3-requests python3-pip python3-bs4 mysql-server python-mysqldb libmysqlclient-dev mysql-client-5.7
echo "Packages installed"
cd /var/www/
mkdir GFServer
echo "moving files to GFServer"
mv ServerConfig/* GFServer/ 
rm -R ServerConfig/
echo "moving Apache config into place"
mv GFServer/services/GFServer.conf /etc/apache2/sites-available/
sed -i '1 a\127.0.0.1       GFServer' /etc/hosts
rm -f /etc/apache2/sites-enabled/000-default.conf
echo "restarting Apache"
a2ensite GFServer
service apache2 restart
echo "Script complete. Please check the server's IP in your browser"
