const Text = require('../../../lib/Text')
const fs = require('fs')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')
const { requestYesOrNo } = require('../../../utils')
const InitVueTailwindCSS = require('./vue-tailwindcss')
const { requestInitEslint } = require('./utils/eslint')
const { requestInitPrettier } = require('./utils/prettier')

const updateEslintConfigForVue3 = async () => {
  console.log(Text.green('update eslint config for vue3 recommended'))

  return await new Promise((resolve, reject) => {
    try {
      const dirs = fs.readdirSync('./')
      const configs = dirs.filter((dir) => /^\.eslintrc/.test(dir))

      if (configs.length === 0) {
        throw new Error(`can't find eslint config file.`)
      }

      if (configs.length > 1) {
        throw new Error('Uncertain the eslint config file.')
      }

      const configFile = configs[0]
      const config = ConfigParser.parse(configFile)

      config.extends[0] = 'plugin:vue/vue3-recommended'

      Json2Config.write(configFile, config)
      console.log(Text.green('update eslint config OK...'))
      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

const requestRunInitVueTailwindCSS = () => {
  return requestYesOrNo('Do you want to initialize tailwindcss?').then(
    (res) => res && InitVueTailwindCSS()
  )
}

const InitVue = () => {
  return requestInitEslint([updateEslintConfigForVue3])
    .then(requestInitPrettier)
    .then(requestRunInitVueTailwindCSS)
}
module.exports = InitVue
