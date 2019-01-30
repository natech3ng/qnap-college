module.exports = {
  apps : [{
    name      : 'goqnapcom',
    script    : 'dist/server.js',
    env: {
      NODE_ENV: 'true'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    production: {
      winkey: '/c/Users/nate/.ssh/google_cloud_deploy_openSSH',
      key: '~/.ssh/id_rsa_deploy_google_cloud',
      user: 'deploy',
      host: ['blog.qnap.com'],
      ref: 'origin/master',
      repo: 'git@github.com:qqnc/qnap-college.git',
      path: '/var/www/qnapcollege',
      'pre-setup': '',
      'post-setup': 'npm install --unsafe-perm',
      'pre-deploy-local' : '',
      'pre-deploy' : '',
      'post-deploy' : 'cp ~/environment/college/.env ./; sudo pm2 startOrRestart ecosystem.config.js --env production; sudo chown -R deploy:deploy node_modules',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}
