pi-music
========

Dependencies
-------------------
- NodeJS
- alsa-utils
- lame
- libasound2-dev
- sqlite3

Test Installation
---------------------
    $ speaker-test -c 2
    $ play test.wav

Configure sound output
-------------------------------
    $ amixer cset numid=3 <n>
    (where n is 0=auto, 1=headphones, 2=hdmi)

Build
------
    $ npm install

- If "npm install" has trouble on sqlite3 (the pi might run out of memory), try the following:

      $ npm install sqlite3 --build-from-source

If that still doesn't work, try creating a swap file for extra memory and then running again: https://wiki.archlinux.org/index.php/swap#Swap_file_creation

Run
---
    $ node app.js
