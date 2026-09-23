import { spawn } from "node:child_process";
import os from "node:os";

const PORT = 3001;

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const [name, addrs] of Object.entries(nets)) {
    if (!/wi-?fi|wlan|inal/i.test(name)) continue;
    for (const net of addrs ?? []) {
      if (net.family === "IPv4" && !net.internal && !net.address.startsWith("169.254")) {
        return net.address;
      }
    }
  }
  for (const [name, addrs] of Object.entries(nets)) {
    if (/virtual|vmware|vbox|hyper-v|loopback|bluetooth|ethernet 2/i.test(name)) continue;
    for (const net of addrs ?? []) {
      if (net.family === "IPv4" && !net.internal && !net.address.startsWith("169.254")) {
        return net.address;
      }
    }
  }
  return null;
}

const ip = getLanIp();

console.log("\n  ObraTech — acceso en red local\n");
console.log(`  Puerto: ${PORT}\n`);
if (ip) {
  console.log(`  Desde celular / tablet:  http://${ip}:${PORT}`);
  console.log(`  Admin:                   http://${ip}:${PORT}/admin\n`);
  console.log("  Checklist si no carga:");
  console.log("  1. Celular en la MISMA Wi-Fi (no datos móviles)");
  console.log("  2. Usa http:// (no https)");
  console.log(`  3. Puerto ${PORT} — no uses 3000`);
  console.log("  4. Ejecuta como admin: npm run dev:firewall\n");
} else {
  console.log(`  No se detectó IP Wi-Fi. Ejecuta ipconfig y usa tu IPv4 con :${PORT}\n`);
}

const child = spawn("npx", ["next", "dev", "-H", "0.0.0.0", "-p", String(PORT)], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
});

child.on("exit", (code) => process.exit(code ?? 0));
