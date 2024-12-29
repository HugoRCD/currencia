//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',

  experimental: {
    tasks: true
  },

  scheduledTasks: {
    '* * * * *': ['sync:mongo', 'format:data']
  },

  compatibilityDate: '2024-12-29'
})
