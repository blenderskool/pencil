module.exports = {
  head: {
    title: 'Pencil playground'
  },
  navigation: [
    ['Pencil API :computer:', {
      newTab: true,
      link: 'https://penciljs.netlify.com/config/'
    }]
  ],
  darkTheme: {
    toggle: true
  },
  logo: 'https://penciljs.netlify.com/img/logo.svg',
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
    }],
    ['icon', {
      value: 'github',
      type: 'logo',
    }]
  ],
  footer: [
    ['<icon type="logo">github</icon>', {
      link: 'https://github.com/blenderskool/pencil',
      newTab: true
    }],
    'Made using Pencil :tada:'
  ]
}