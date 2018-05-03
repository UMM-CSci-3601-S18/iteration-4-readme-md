# Sunshine Journal Droplet Setup Instructions
#### Last updated: 5/01/18

## Summary
This document is, essentially, a short guide to setting up a "droplet" on [DigitalOcean](https://www.digitalocean.com)
to be used as a tool for deploying simple web applications. This is by no means a
comprehensive guide, and you are encouraged to reach out to classmates, faculty, and
TAs (through Slack, for example) with questions.

The majority of the information here will be presented in the form of bulleted lists,
because we all know none of us actually read walls of text.

These instructions assume you're in the lab. The SSH key part in particular won't likely work if you're not.
If you don't get the SSH keypair stuff right, you'll probably have a pile of issues logging in
to your droplet.

Most of this will happen in a terminal window, which is yet another reason to take
some time to learn how to use the Unix shell.

### Some terminology:
You're going to see the word "droplet" used a lot here. Digital ocean is in the
business of hosting Virtual Private Servers (VPS), which they have decided to call
"droplets." The term isn't terribly important, and for the most part just refers
specifically to the VPSs hosted by DigitalOcean and all the features which that
entails.

## Step 0: Set up your domain
- Buy a domain (use namecheap and you can get one for $1 or less)
### Cloudflare
[CloudFlare.com](https://www.cloudflare.com/) allows you to add an SSL certificate 
to your website. Create an account and sign in.
#### DNS Records
Under your DNS Records, add a record with these settings:

_Type: A <br>
Name: yourdomain.com <br>
Value: your droplet IP address without a port <br>
TTL: Automatic <br>_

Add another record with these settings:

_Type: A <br>
Name: www <br>
Value: your droplet IP address without a port <br>
TTL: Automatic <br>_

#### Cloudflare Nameservers
In this section, you are given NS pointers with values that are needed for your
domain's registrar. In mine, I have the two following pointers:

_ali.ns.cloudflare.com <br>
elliot.ns.cloudflare.com_

Have these ready for the following step.

### Pointing your domain name to Cloudflare
We are using namecheap, so this step may be different if you are using
another domain registrar.

Sign in, then go to your Dashboard. Next to your domain name, click the "Manage"
button.

Next to "NAMESERVERS", select "Custom DNS" on the dropdown menu. Copy and paste
the two values that you saved earlier. It could take up to 24 hours for this to take effect.

## Step 1: Creating an account
- Go to [Digital Ocean](https://www.digitalocean.com).
- You *can* create an account without adding billing information.
- You *cannot* create any droplets without "activating" your account (by adding billing info).
- You *do* get $50 of free credit for D.O. through [the Github StudentPack](https://education.github.com/pack). Be sure to redeem it.

## Step 2: Generating an SSH keypair
- Follow these directions: [How to Configure SSH Key-Based Authentication on a Linux Server](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server)
   - All this happens in a terminal window.
   - Steps 1 and 2 happen on the machine in the lab.
   - Steps 3 and 4 will happen on the Digital Ocean VPS when you have one set up.

## Step 3: Creating a droplet
- Click the big shiny "Create" button, and choose "Droplet" as the thing you want to create.
- Select the suggested Ubuntu version as your operating system.
- Select the smallest droplet, it should be $5 / month.
- Don't add block storage.
- Stick with the default datacenter / region (probably New York).
- Don't select any additional options.
- Add an SSH key. Use the contents of the public key file you generated in step 2.
   - DigitalOcean will use this info to automagically do steps 3 and 4 from the SSH keypair instructions so you never have to do them "by hand".
- Finally, only make one droplet and choose a name for it.
- It will take a couple seconds to make the droplet.


## Step 4: Setting up your droplet
- SSH to your droplet by running ``ssh root@[my ip here]`` (using the IP of your droplet)
- Logged in? Good, keep reading. Problems? Ask someone for help (or Google).
- run: ``wget https://gist.githubusercontent.com/pluck011/f44c9d1557a5127e100a300d018d3b63/raw/f78291783666ca776681ff9e1fd9e99428d6c522/3601-setup.sh`` as root.
- run ``chmod +x 3601-setup.sh``
- run ``./3601-setup.sh``
- Do whatever it asks.
- Reboot the droplet by typing `reboot`. SSH into `deploy-user@[my ip here]`.

## Step 5: Running your project
- Use ``git clone [your repo url here]`` to get your repo on the droplet.
- Use ``cd [your repo name]`` to move into the directory you just grabbed from github. (cd = Change Directory)
- Use ``cd client/src/envrionments/`` and type `nano envrionment.prod.ts`.
- Edit the API_URL to reflect the domain of your website with `/api/` at the end of it. (i.e. `https://sunshinejournal.site/api/`). Use `Ctrl + X` to exit and then save the file.
- Navigate back to your repository. (Type `cd ~` and then `cd [your repo name]`).
- Use ``cd server/src/main/java/umm3601/`` and type `nano Server.java`.
- Find your server port (in our case it is 4567). Change ``4567`` to ``80`` then save.
- Navigate back to your repository.
- Run `./build.sh` to build and deploy your project.
- run ``tmux`` to enter a Tmux session.
- run ``sudo ./3601.sh`` to start your server (**3601.sh** is in the home directory `cd ~`).  (the ``sudo`` part is required because connecting to port 80 requires special permission)
- press ``Ctrl + b`` and then ``d`` to *detach* from this Tmux session. It will continue running even after you log out. To reconnect to the Tmux session, log into your droplet and run ``tmux a`` (a for *attach*!)

If you're interested in doing more fun things with Tmux, check out [this](https://gist.github.com/MohamedAlaa/2961058) cheat-sheet. Tmux is a really cool tool, and if you ever plan on doing system administration stuff in the future it's worth getting to know it.

#### Updating your project
- Navigate to the home directory.
- Run ``rm -rf server/`` to remove the old version.
- Navigate to the repository directory on your droplet.
- Run ``git pull``
- Repeat steps starting at ``./build.sh`` from above.

## Logging in from outside the lab, or as someone other than the person who did this setup.
- You're free to add accounts to your droplet as you see fit and provide that login info to others.
- You **should not** share the private key that you generated.
- You can enable password ssh logins by editing the ``PasswordAuthentication`` field in ``/etc/ssh/sshd_config``

##### Original by Nick Plucker. Domain and Cloudflare instructions originally by John Hoff. Modified by Matt Munns 5/01/2018
