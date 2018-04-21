DO NOT PUT THE CLIENT SECRET ON GITHUB. ONCE YOU DO IT IS NO LONGER SECRET!!!

Instead, when we add clone the repository to the droplet,
we will add these steps after changing the environment.prod.ts:

1. `cd` to the project directory
1. `cd server/src/main/java/umm3601/server_files`
1. `nano client_secret_file.json` which will create the file
1. copy and paste all the text from the secret json file that
you can download from https://console.developers.google.com
1. `ctrl+x` then press y to save and exit

This is just the first thing that I came up with.
 We should talk to Nic & KK to see if there's a better
 way to get the secret file to the droplet without putting it
 on git.

Also, if you do happen to  accidentally share the secret file,
 it is not a huge deal (though it is inconvenient). We can
 reset it and create a new one pretty easily on the developer console.
