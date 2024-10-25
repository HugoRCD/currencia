type Where = 'home' | 'app' | 'user' | 'admin';

export type Navigation = {
  name: string;
  title: string;
  description: string;
  to: string;
  icon: string;
};

export function getNavigation(where: Where): Navigation[] {
  switch (where) {
    case 'home':
      return [
        { name: 'Home', to: '/', icon: 'heroicons:home', title: 'Home', description: '' },
        { name: 'Contact', to: '/contact', icon: 'heroicons:envelope', title: 'Contact', description: '' },
      ]
    case 'app':
      return [
        {
          name: 'Market overview',
          to: '/app/market',
          icon: 'heroicons:chart-bar-square',
          title: 'Market overview',
          description: 'You can see all the market information, latest news, and more.',
        },
        {
          name: 'Watchlist',
          to: '/app/watchlist',
          icon: 'heroicons:star',
          title: 'Watchlist',
          description: 'Here you can see your watchlist and add or remove coins from it.',
        },
      ]
    case 'user':
      return [
        {
          name: 'Profile',
          to: '/app/profile',
          icon: 'heroicons:user',
          title: 'Profile',
          description: 'Here you can see your profile information and edit it.',
        },
        {
          name: 'Settings',
          to: '/app/settings',
          icon: 'heroicons:cog',
          title: 'Settings',
          description: 'You can change your settings here, change which coins you want to see, and more.',
        },
        {
          name: 'Logout',
          to: '/',
          icon: 'heroicons:arrow-left-on-rectangle',
          title: 'Logout',
          description: 'Logout',
        },
      ]
    case 'admin':
      return [
        { name: 'Users', to: '/app/admin/users', icon: 'heroicons:users', title: 'Users', description: 'Users page' },
        { name: 'Cryptos', to: '/app/admin/cryptos', icon: 'heroicons:currency-dollar', title: 'Cryptos', description: 'Cryptos page' },
      ]
    default:
      return []
  }
}
