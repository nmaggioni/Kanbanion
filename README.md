# Kanbanion [![Codacy Badge](https://api.codacy.com/project/badge/Grade/672d6512174444789ffc6fa7a48ce061)](https://www.codacy.com/app/nmaggioni/Kanbanion?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nmaggioni/Kanbanion&amp;utm_campaign=Badge_Grade)

> A Kanban board. Simple, digital and local.
>
> With its JSON-based storage, Kanbanion is the perfect choice for keeping track of a single project's tasks. The Electron platform makes it feel and behave just like a native application.

![Screenshot](kanbanion.png?raw=true "Kanbanion")

### Run

Check [the releases page](https://github.com/nmaggioni/Kanbanion/releases) for ready-to-run builds.

If you want to run Kanbanion directly from the repo, clone it and run the following commands.

```
$ npm install
$ bower install
$ npm start
```

### Build

To build the app for Linux, MacOS and Windows using [electron-packager](https://github.com/electron-userland/electron-packager), run:

```
$ npm run build
```

You will then find the binaries and the needed resources in the `dist/Kanbanion-[OS]-[ARCH]/` folders.
