import { execSync } from "node:child_process";

const ports = [3000, 3001];

for (const port of ports) {
  try {
    const out = execSync(`netstat -ano | findstr ":${port}" | findstr "LISTENING"`, {
      encoding: "utf8",
      shell: true,
    });
    const pid = out.trim().split(/\s+/).pop();
    if (pid && /^\d+$/.test(pid)) {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "inherit", shell: true });
      console.log(`Detenido proceso ${pid} (puerto ${port})`);
    }
  } catch {
    // puerto libre
  }
}

console.log("\nListo. Ahora ejecuta: npm run dev:lan\n");
