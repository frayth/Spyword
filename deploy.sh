handle_error() {
  echo "❌ Erreur lors de l'exécution de la commande: $1"
  exit 1
}

echo "▶️ Mise à jour du dépôt Spyword"
cd /home/ubuntu/projets/Spyword/ || handle_error "cd /home/ubuntu/projets/Spyword/"
git pull || handle_error "git pull"

echo "▶️ Construction du frontend"
cd /home/ubuntu/projets/Spyword/SpyWord || handle_error "cd /home/ubuntu/projets/Spyword"
npm run build || handle_error "npm run build"


echo "▶️ Construction du backend"
cd /home/ubuntu/projets/Spyword/Back/Spyword || handle_error "cd /home/ubuntu/projets/back/Spyword"
node ace build || handle_error "node ace build"

echo "▶️ Adonis : Mise à jour des dépendances"
cd build || handle_error "cd build"
npm ci --omit="dev" || handle_error "dépendences fail"


echo "▶️ Vérification du port 3003"
pid=$(lsof -ti tcp:3003)

if [ -n "$pid" ]; then
  echo "⚠️ Port 3003 occupé par le process PID $pid, arrêt en cours..."
  kill "$pid" || handle_error "kill process $pid"
  echo "✅ Processus $pid arrêté."
else
  echo "✅ Port 3003 est libre."
fi

echo "▶️ Lancement du serveur Adonis"
nohup env ENV_PATH=/home/ubuntu/projets/Spyword/Back/Spyword NODE_ENV=production node /home/ubuntu/projets/Spyword/Back/Spyword/build/bin/server.js > /home/ubuntu/projets/Spyword/Back/Spyword/production/server.log 2>&1 & disown || handle_error "lancement du serveur failed"
echo "✅ Serveur Adonis lancé avec succès."

echo "▶️ relancement de Nginx"
sudo systemctl reload nginx || handle_error "redémarrage de Nginx"
echo "✅ Nginx rechargé avec succès."
echo "▶️ Mise à jour terminée avec succès ! 🚀" 