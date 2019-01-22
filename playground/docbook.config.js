module.exports = {
  head: {
    title: 'DocBook playground'
  },
  navigation: [
    ['Docbook API', {
      newTab: true,
      link: 'https://docbook.netlify.com/config/'
    }]
  ],
  darkTheme: {
    toggle: true
  },
  logo: 'https://docbook.netlify.com/img/logo.svg',
  themeColor: '#287be1',
  plugins: {
    callout: 'plugins/callout.js',
    youtube: 'plugins/youtube.js',
    icon: 'plugins/icon.js'
  },
  sidebar: [
    ['Introduction', '/'],
    ['Sample section', {
      'Sample page': '/sample'
    }]
  ],
  footer: [
    ['<icon type="logo">github</icon>', {
      link: 'https://github.com/blenderskool/docbook',
      newTab: true
    }],
    'Made using DocBook'
  ]
}