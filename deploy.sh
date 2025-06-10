#!/bin/bash

handle_error() {
  echo "❌ Erreur lors de l'exécution de la commande: $1"
  exit 1
}

ask_user() {
  read -rp "🔹 Souhaitez-vous exécuter l'étape \"$1\" ? (y/N) " choice
  case "$choice" in
    [yY]) return 0 ;;
    *) echo "⏭️ Étape \"$1\" ignorée."; return 1 ;;
  esac
}

if ask_user "Mise à jour du dépôt Spyword"; then
  echo "▶️ Mise à jour du dépôt Spyword"
  cd /home/ubuntu/projets/Spyword/ || handle_error "cd /home/ubuntu/projets/Spyword/"
  git pull || handle_error "git pull"
fi

if ask_user "Construction du frontend"; then
  echo "▶️ Construction du frontend"
  cd /home/ubuntu/projets/Spyword/SpyWord || handle_error "cd /home/ubuntu/projets/Spyword/SpyWord"
  npm run build || handle_error "npm run build"
fi

if ask_user "Construction du backend"; then
  echo "▶️ Construction du backend"
  cd /home/ubuntu/projets/Spyword/Back/Spyword || handle_error "cd /home/ubuntu/projets/back/Spyword"
  node ace build || handle_error "node ace build"
  echo "▶️ Adonis : Mise à jour des dépendances"
  cd build || handle_error "cd build"
  npm ci --omit="dev" || handle_error "npm ci"
fi

if ask_user "Arrêt des processus sur le port 3003"; then
  pid=$(lsof -ti:3003)
  if [ -n "$pid" ]; then
    echo "⚠️ Port 3003 occupé par le(s) process PID(s) $pid, arrêt en cours..."
    for p in $pid; do
      echo "🔪 Tentative d'arrêt du process $p"
      kill -9 "$p" || echo "❌ Erreur lors de l'arrêt du process $p"
    done
    echo "✅ Processus arrêté(s)."
  else
    echo "✅ Port 3003 est libre."
  fi
fi

if ask_user "Lancement du serveur Adonis"; then
  echo "▶️ Lancement du serveur Adonis"
  nohup env ENV_PATH=/home/ubuntu/projets/Spyword/Back/Spyword NODE_ENV=production node /home/ubuntu/projets/Spyword/Back/Spyword/build/bin/server.js > /home/ubuntu/projets/Spyword/Back/Spyword/production/server.log 2>&1 & disown || handle_error "lancement du serveur failed"
  echo "✅ Serveur Adonis lancé avec succès."
fi

if ask_user "Rechargement de Nginx"; then
  echo "▶️ relancement de Nginx"
  sudo systemctl reload nginx || handle_error "redémarrage de Nginx"
  echo "✅ Nginx rechargé avec succès."
fi

echo "✅ Mise à jour terminée avec succès ! 🚀"
