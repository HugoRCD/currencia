# Stage 1: Build Stage
FROM oven/bun:latest

RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxshmfence1 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

ARG MONGODB_URL
ARG KRAKEN_API_KEY
ARG KRAKEN_SECRET

ENV MONGODB_URL=$MONGODB_URL
ENV KRAKEN_API_KEY=$KRAKEN_API_KEY
ENV KRAKEN_SECRET=$KRAKEN_API_SECRET

ENV DELAY_BETWEEN_RUNS=30000

WORKDIR /scripts

COPY package.json ./
COPY bun.lockb ./

COPY . .

RUN bun install

COPY <<-"EOF" /scripts/runner.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const DELAY_BETWEEN_RUNS = parseInt(process.env.DELAY_BETWEEN_RUNS || '30000');
const SCRIPT_TIMEOUT = 300000;
console.log(`Configured delay between runs: ${DELAY_BETWEEN_RUNS}ms`);

async function runScriptWithTimeout(scriptPath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const timeoutId = setTimeout(() => {
            console.error(`Script ${scriptPath} timed out after ${SCRIPT_TIMEOUT/1000} seconds`);
            resolve();
        }, SCRIPT_TIMEOUT);

        const MAX_RETRIES = 3;
        const RETRY_DELAY = 5000;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(`[${new Date().toISOString()}] Running ${scriptPath} (attempt ${attempt}/${MAX_RETRIES})`);

                const child = exec(`bun run ${scriptPath}`);

                child.stdout?.on('data', (data) => console.log(`[${scriptPath}] ${data.trim()}`));
                child.stderr?.on('data', (data) => console.error(`[${scriptPath}] Error: ${data.trim()}`));

                await new Promise((resolveExec, rejectExec) => {
                    child.on('exit', (code) => {
                        if (code === 0) {
                            resolveExec(null);
                        } else {
                            rejectExec(new Error(`Script exited with code ${code}`));
                        }
                    });
                });

                console.log(`[${new Date().toISOString()}] ${scriptPath} completed successfully`);
                clearTimeout(timeoutId);
                return resolve();
            } catch (error) {
                console.error(`[${new Date().toISOString()}] Error in ${scriptPath} (attempt ${attempt}/${MAX_RETRIES}):`, error);
                if (attempt < MAX_RETRIES) {
                    console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                }
            }
        }

        console.error(`[${new Date().toISOString()}] Failed to run ${scriptPath} after ${MAX_RETRIES} attempts`);
        clearTimeout(timeoutId);
        resolve();
    });
}

async function runAllScripts() {
    while (true) {
        const startTime = Date.now();
        console.log(`\n[${new Date().toISOString()}] Starting new execution cycle`);

        try {
            await runScriptWithTimeout('scripts/coinmarketcap/index.ts');
            await runScriptWithTimeout('scripts/kraken/index.ts');
            await runScriptWithTimeout('scripts/cryptocompare/index.ts');
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in script execution cycle:`, error);
        }

        const executionTime = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] Scripts execution took ${executionTime}ms`);
        console.log(`Waiting ${DELAY_BETWEEN_RUNS/1000} seconds before next run...`);

        let waitedTime = 0;
        while (waitedTime < DELAY_BETWEEN_RUNS) {
            await new Promise(resolve => setTimeout(resolve, Math.min(60000, DELAY_BETWEEN_RUNS - waitedTime)));
            waitedTime += 60000;
            console.log(`[${new Date().toISOString()}] Still waiting... ${Math.max(0, DELAY_BETWEEN_RUNS - waitedTime)/1000} seconds remaining`);
        }
    }
}

process.on('uncaughtException', (error) => {
    console.error(`[${new Date().toISOString()}] Uncaught Exception:`, error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(`[${new Date().toISOString()}] Unhandled Rejection at:`, promise, 'reason:', reason);
});

console.log(`[${new Date().toISOString()}] Starting runner`);
runAllScripts().catch(console.error);
EOF

RUN chmod +x /scripts/runner.ts

CMD ["bun", "run", "runner.ts"]
