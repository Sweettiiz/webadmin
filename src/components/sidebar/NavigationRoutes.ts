export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    // {
    //   name: 'users',
    //   displayName: 'menu.users',
    //   meta: {
    //     icon: 'group',
    //   },
    // },
    {
      name: 'system-management',
      displayName: 'System Management',
      meta: {
        icon: 'folder_shared',
      },
      children: [
        {
          name: 'company',
          displayName: 'Company',
        },
        {
          name: 'user-management',
          displayName: 'User Management',
        },
        {
          name: 'issue-dashboard',
          displayName: 'Issue Dashboard',
        },
      ],
    },
    {
      name: 'operation-management',
      displayName: 'Operation Management',
      meta: {
        icon: 'folder_shared',
      },
      children: [
        // {
        //   name: 'token-management',
        //   displayName: 'Token Management',
        // },
        {
          name: 'storage',
          displayName: 'Storage',
        },
        {
          name: 'company-token',
          displayName: 'Company Token',
        },
        {
          name: 'user-token',
          displayName: 'User Token',
        },
      ],
    },
    // {
    //   name: 'projects',
    //   displayName: 'menu.projects',
    //   meta: {
    //     icon: 'folder_shared',
    //   },
    // },
    {
      name: 'auth',
      displayName: 'menu.auth',
      meta: {
        icon: 'login',
      },
      children: [
        {
          name: 'login',
          displayName: 'menu.login',
        },
        // {
        //   name: 'signup',
        //   displayName: 'menu.signup',
        // },
        // {
        //   name: 'recover-password',
        //   displayName: 'menu.recover-password',
        // },
      ],
    },
    // {
    //   name: 'preferences',
    //   displayName: 'menu.preferences',
    //   meta: {
    //     icon: 'manage_accounts',
    //   },
    // },
    // {
    //   name: 'settings',
    //   displayName: 'menu.settings',
    //   meta: {
    //     icon: 'settings',
    //   },
    // },
  ] as INavigationRoute[],
}
