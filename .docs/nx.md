### Setup Monorepo

Protip: Use powershell

### CREATING A NEW NX MONOREPO (you probably don't need to do this.)

```bash
npx create-nx-workspace@latest <project-name>

NX   Let's create a new workspace [https://nx.dev/getting-started/intro]
√ Which stack do you want to use? · none
√ Package-based monorepo, integrated monorepo, or standalone project? · integrated
'git' is not recognized as an internal or external command,
operable program or batch file.
√ Which CI provider would you like to use? · skip
√ Would you like remote caching to make your build faster? · yes
√ Will you be using GitHub as your git hosting provider? · Yes
```

### App - FRONTEND - React

(React Tutorial)[https://nx.dev/getting-started/tutorials/react-monorepo-tutorial]

```bash
  npm install --save-dev @nx/react
npx nx g @nx/react:application messenger-frontend --directory=apps/messenger/frontend
```

### App - BACKEND - Express

```bash
npx nx add @nx/express
npx nx g @nx/express:app messenger-backend --directory=apps/messenger/backend
```

### Libs

#### React Library

To generate a new React component library in the /libs directory we run:

```bash
  npx nx g @nx/react:library <ie baccarat-components> --directory=libs/<ie baccarat>/ui/components
```

Once the app has been generated go to the project.json file and update the "tags" property with the following:
"tags": ["scope:lobby"]

#### Node Library

To generate a new Node library in the /libs/rgs directory we run:

```bash
  npx nx g @nx/node:library <your-lib-name> --directory=libs/shared/<your-lib-name>
```

Once the 'libs/shared/your-lib-name' file structure has been generated go to the project.json file and update the "tags" property ie "tags": ["scope:shared"]

```bash
# Shared Assets
npx nx g @nx/js:library shared-assets --directory=libs/shared/assets --unitTestRunner=vitest --bundler=none

# Shared UI components & layout - (React)
npx nx generate @nx/react:library shared-ui-components --directory=shared/ui/components --buildable
npx nx generate @nx/react:library shared-ui-layout --directory=shared/ui/layout --buildable

# Shared Models
npx nx g @nx/js:library shared-models --directory=libs/shared/models --unitTestRunner=vitest --bundler=none

# State Management - Redux Tool Kit
npx nx g @nx/js:library shared-models --directory=libs/shared/models --unitTestRunner=vitest --bundler=none
```

### Supabase Libs

```bash
# Authentication library
npx nx g @nx/node:library shared-supabase-auth --directory=libs/shared/supabase/auth --buildable

# Database interactions library
npx nx g @nx/node:library shared-supabase-db --directory=libs/shared/supabase/db --buildable

# Real-time subscriptions library
npx nx g @nx/node:library shared-supabase-realtime --directory=libs/shared/supabase/realtime --buildable
```

#### DEPLOYMENT

Make sure to use the nx-cloud ignore flag
