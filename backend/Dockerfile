# Utiliser une image Node.js officielle comme base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

#  port utilisé par ton backend (ex: 5000)
EXPOSE 2000

# Lancer l'application
CMD ["npm", "start"]
