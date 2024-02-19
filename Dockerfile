FROM zenika/alpine-chrome:with-puppeteer
WORKDIR /usr/src/app
USER chrome
COPY --chown=chrome:chrome package*.json ./
RUN npm install
COPY --chown=chrome:chrome . .
EXPOSE 3000
CMD ["npm", "start"]


# docker build -t miguel8at/whatsapp .
# docker push miguel8at/whatsapp
# docker run --privileged -d -p 3000:3000 miguel8at/whatsapp
