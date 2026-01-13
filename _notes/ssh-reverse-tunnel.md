---
title: Ssh Reverse Tunnel
description: Short summary of Ssh Reverse Tunnel
layout: note
---

Sure, I can help you set up a **reverse SSH tunnel** so that you can always access both of your PCs (PC A and PC B) from anywhere, even if their public IPs change and your ISP doesn't support port forwarding.

Since your cloud instance has a stable public IP (101.98.97.10), we'll use it as a "jump point" to create a connection from your local PCs to the cloud. Once the reverse tunnel is established from both PCs to the cloud instance, you can SSH into the cloud and access the local PCs as if they were directly accessible.

Here's a step-by-step guide to setting this up:

### **Step 1: Set up Reverse SSH Tunnel from PC A to the Cloud Instance**

On PC A (192.168.10.10), you'll set up a reverse SSH tunnel that will forward a local port to the cloud instance. This means that even though PC A is behind a NAT or firewall, you can access it via the cloud instance.

1. SSH into your cloud instance from PC A:

   ```bash
   ssh -N -R 2222:localhost:22 user@101.98.97.10
   ```

   * `-N` tells SSH not to run any commands on the remote server, just establish the tunnel.
   * `-R 2222:localhost:22` means: from the cloud instance, any traffic that hits port 2222 will be forwarded to PC A's port 22 (SSH port).
   * Replace `user` with your cloud instance's SSH user.

2. **Keep this SSH session running**. You can use tools like `screen` or `tmux` to keep the session running in the background if needed.

   With this setup, to SSH into PC A, you would connect to the cloud instance and use:

   ```bash
   ssh -p 2222 user@101.98.97.10
   ```

### **Step 2: Set up Reverse SSH Tunnel from PC B to the Cloud Instance**

Repeat the same process for PC B (172.16.10.10). This will allow you to also access PC B through the cloud instance.

1. SSH into your cloud instance from PC B:

   ```bash
   ssh -N -R 3333:localhost:22 user@101.98.97.10
   ```

   * `-R 3333:localhost:22` means: any traffic that hits port 3333 on the cloud instance will be forwarded to PC B's port 22.

2. **Keep this session running** as well. Now, to SSH into PC B, you'd connect to the cloud instance and use:

   ```bash
   ssh -p 3333 user@101.98.97.10
   ```

### **Step 3: Automate the Reverse Tunnels**

You mentioned that your public IPs change frequently, so it’s a good idea to ensure the reverse tunnels are automatically re-established after disconnection.

You can add a script to automatically reconnect the reverse SSH tunnels whenever the connection is lost (or after reboot).

Here’s a simple script that you can add to your startup (via `crontab` or a startup script):

1. Create a script to establish the reverse SSH tunnel:

   On PC A (192.168.10.10):

   ```bash
   #!/bin/bash
   while true; do
     ssh -N -R 2222:localhost:22 user@101.98.97.10
     sleep 10  # Wait for 10 seconds before trying to reconnect
   done
   ```

   On PC B (172.16.10.10):

   ```bash
   #!/bin/bash
   while true; do
     ssh -N -R 3333:localhost:22 user@101.98.97.10
     sleep 10  # Wait for 10 seconds before trying to reconnect
   done
   ```

2. **Make the script executable**:

   ```bash
   chmod +x /path/to/script.sh
   ```

3. **Add it to crontab** (or use a systemd service) so it starts on boot:

   Open crontab:

   ```bash
   crontab -e
   ```

   Add the following line:

   ```bash
   @reboot /path/to/script.sh
   ```

   This will automatically start the reverse tunnel on boot.

### **Step 4: Access PCs through the Cloud Instance**

Now that you have the reverse SSH tunnels set up:

* To access **PC A**, SSH into the cloud instance and run:

  ```bash
  ssh -p 2222 user@101.98.97.10
  ```

* To access **PC B**, SSH into the cloud instance and run:

  ```bash
  ssh -p 3333 user@101.98.97.10
  ```

### **Optional: Use SSH Keys for Authentication**

For a smoother and more secure experience, you can use SSH keys for authentication instead of passwords. This way, your PCs will automatically authenticate with the cloud instance without needing to enter a password every time.

1. Generate an SSH key on each PC:

   ```bash
   ssh-keygen -t rsa -b 2048
   ```

2. Copy the public key to the cloud instance:

   ```bash
   ssh-copy-id user@101.98.97.10
   ```

3. Ensure that both PCs are using the private key for authentication when creating the reverse SSH tunnel by specifying the `-i` flag with the path to your private key:

   ```bash
   ssh -i /path/to/private_key -N -R 2222:localhost:22 user@101.98.97.10
   ```

---

This setup allows you to always access both PCs (A and B) through the cloud instance, no matter how often their IP addresses change, without the need for port forwarding. You can also expand this method to create reverse tunnels for other services (HTTP, FTP, etc.) if needed.

Let me know if you run into any issues or need further clarification on any part!

Yes, you can forward multiple ports at once using reverse SSH tunnels! You just need to specify multiple `-R` options in your SSH command to forward different ports from your cloud instance to your local PCs.

Here's how you can modify the reverse SSH tunnel setup to forward multiple ports.

### **Multiple Ports for PC A**

Let's say you want to forward the following ports for **PC A**:

* SSH on port `22` (default)
* HTTP server on port `8080`
* MySQL on port `3306`

You would modify the SSH command on **PC A** as follows:

```bash
ssh -N -R 2222:localhost:22 -R 8080:localhost:8080 -R 3306:localhost:3306 user@101.98.97.10
```

In this example:

* `-R 2222:localhost:22` forwards SSH (port 22) on PC A to port 2222 on the cloud.
* `-R 8080:localhost:8080` forwards port 8080 (HTTP) on PC A to port 8080 on the cloud.
* `-R 3306:localhost:3306` forwards MySQL port (3306) on PC A to port 3306 on the cloud.

### **Multiple Ports for PC B**

You can do the same for **PC B**, forwarding additional or different ports, for example:

* SSH on port `22`
* FTP on port `21`
* A custom service on port `5000`

For **PC B**, the SSH command would look like:

```bash
ssh -N -R 3333:localhost:22 -R 21:localhost:21 -R 5000:localhost:5000 user@101.98.97.10
```

In this case:

* `-R 3333:localhost:22` forwards SSH (port 22) from PC B to port 3333 on the cloud.
* `-R 21:localhost:21` forwards FTP (port 21) from PC B to port 21 on the cloud.
* `-R 5000:localhost:5000` forwards a custom service (port 5000) from PC B to port 5000 on the cloud.

### **Summary**

You can forward as many ports as you need in a single SSH command by adding multiple `-R` options. For example:

```bash
ssh -N -R 2222:localhost:22 -R 8080:localhost:8080 -R 3306:localhost:3306 -R 3333:localhost:22 -R 21:localhost:21 user@101.98.97.10
```

Each `-R` specifies:

* The port on the cloud instance (`-R cloud_port:localhost:local_port`).
* The `localhost` part refers to the local machine (PC A or PC B) that you're forwarding from.
* `cloud_port` is the port on your cloud server (101.98.97.10) that will forward traffic to `local_port` on your PC.

### **Accessing Multiple Services**

Once this is done:

* To access **PC A's SSH**, connect to port 2222 on the cloud instance:

  ```bash
  ssh -p 2222 user@101.98.97.10
  ```

* To access **PC A's HTTP**, connect to port 8080 on the cloud instance:

  ```bash
  curl http://101.98.97.10:8080
  ```

* To access **PC A's MySQL**, connect to port 3306 on the cloud instance:

  ```bash
  mysql -h 101.98.97.10 -P 3306 -u username -p
  ```

* Similarly for **PC B**, you would use port 3333 for SSH, port 21 for FTP, etc.

---

### **Automating with Multiple Ports**

If you have multiple ports to forward, you might want to create a script that handles this and reconnects automatically:

1. Create the script on each PC (like you did before):

   ```bash
   #!/bin/bash
   while true; do
     ssh -N -R 2222:localhost:22 -R 8080:localhost:8080 -R 3306:localhost:3306 user@101.98.97.10
     sleep 10
   done
   ```

2. Set it to run at boot via `crontab` or a systemd service.

This approach will keep your reverse SSH tunnels running and reconnect if the connection is lost or after a reboot.

Let me know if you need more help setting up specific ports or services!

