module.exports = {
  launch: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-notifications'
    ]
  },
  server: {
    command: 'yarn generate && yarn start --port 3000',
    port: 3000,
    launchTimeout: 50000
  }
}
