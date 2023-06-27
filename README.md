# ParkRatingInspector plugin for OpenRCT2

This plugin helps you break down your park rating and figure out why it is so low or so high. The inspector will show each of the different possible influences and how much they are currently affecting your rating, which should help you figure out where you can improve.

**(!) Note: this plugin currently only supports OpenRCT2 v0.3.5 or later.**
Any version released after the 16th of October 2021 should work.

It also works on multiplayer servers!

![(Image of the Park Rating Inspector)](https://raw.githubusercontent.com/Basssiiie/OpenRCT2-ParkRatingInspector/master/img/magicmountain.png)

Thanks to Deurklink for the idea and guide.


## Installation

1. This plugin requires at least OpenRCT2 version v0.3.5.
2. Download the latest version of the plugin from the [Releases page](https://github.com/Basssiiie/OpenRCT2-ParkRatingInspector/releases).
3. To install it, put the downloaded `*.js` file into your `/OpenRCT2/plugin` folder.
    - Easiest way to find the OpenRCT2-folder is by launching the OpenRCT2 game, click and hold on the red toolbox in the main menu, and select "Open custom content folder".
    - Otherwise this folder is commonly found in `C:/Users/<YOUR NAME>/Documents/OpenRCT2/plugin` on Windows.
    - If you already had this plugin installed before, you can safely overwrite the old file.
4. Once the file is there, it should show up ingame in the dropdown menu under the map icon.

---

## For developers: building the source code

1. Install latest version of [Node](https://nodejs.org/en/) and make sure to include NPM in the installation options.
2. Clone the project to a location of your choice on your PC.
3. Open command prompt, use `cd` to change your current directory to the root folder of this project and run `npm install`.
4. Find `openrct2.d.ts` TypeScript API declaration file in OpenRCT2 files and copy it to `lib` folder (this file can usually be found in `C:/Users/<YOUR NAME>/Documents/OpenRCT2/bin/` or `C:/Program Files/OpenRCT2/`).
    - Alternatively, you can make a symbolic link instead of copying the file, which will keep the file up to date whenever you install new versions of OpenRCT2.
5. Run `npm run build` (release build) or `npm run build:dev` (develop build) to build the project.
    - For the release build, the default output folder is `(project directory)/dist`.
    - For the develop build, the project tries to put the plugin into your game's plugin directory.
    - These output paths can be changed in `rollup.config.js`.

### User interface

This plugin makes use of the [FlexUI](https://github.com/Basssiiie/OpenRCT2-FlexUI) framework to create and manage the user interface. It is automatically fetched from NPM with `npm install`.

### Hot reload

This project supports the [OpenRCT2 hot reload feature](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts) for development.

1. Make sure you've enabled it by setting `enable_hot_reloading = true` in your `/OpenRCT2/config.ini`.
2. Open command prompt and use `cd` to change your current directory to the root folder of this project.
3. Run `npm start` to start the hot reload server.
4. Use the `/OpenRCT2/bin/openrct2.com` executable to [start OpenRCT2 with console](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts) and load a save or start new game.
5. Each time you save any of the files in `./src/`, the server will compile `./src/plugin.ts` and place compiled plugin file inside your local OpenRCT2 plugin directory.
6. OpenRCT2 will notice file changes and it will reload the plugin.

If your local OpenRCT2 plugin folder is not in the default location, you can specify a custom path in `rollup.config.js`.

### Final notes

Thanks to [wisnia74](https://github.com/wisnia74/openrct2-typescript-mod-template) for providing the template for this mod and readme. Thanks to the community for the enthusiasm for this plugin and their amazing creations.
