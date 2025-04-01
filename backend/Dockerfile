# Utiliser une image Node.js officielle comme base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port du backend
EXPOSE 2000

# Démarrer le backend
CMD ["npm", "start"]
