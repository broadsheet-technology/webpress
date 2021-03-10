FROM nginx:latest

WORKDIR /usr/bin/

COPY webpress.conf /etc/nginx/nginx.conf
COPY provision-ssl.sh /usr/src/provision-ssl.sh

RUN chmod +x /usr/src/provision-ssl.sh

CMD /usr/src/provision-ssl.sh $DOMAIN_NAME \
&& nginx -g "daemon off;"