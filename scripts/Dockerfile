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
console.log(`Configured delay between runs: ${DELAY_BETWEEN_RUNS}ms`);

async function runScript(scriptPath: string) {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Running ${scriptPath} (attempt ${attempt}/${MAX_RETRIES})`);
            const { stdout, stderr } = await execAsync(`bun run ${scriptPath}`);
            if (stderr) console.error(`stderr: ${stderr}`);
            if (stdout) console.log(`stdout: ${stdout}`);
            console.log(`${scriptPath} completed successfully`);
            return;
        } catch (error) {
            console.error(`Error in ${scriptPath} (attempt ${attempt}/${MAX_RETRIES}):`, error);
            if (attempt < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }
    console.error(`Failed to run ${scriptPath} after ${MAX_RETRIES} attempts`);
}

async function runAllScripts() {
    while (true) {
        try {
            await Promise.all([
                runScript('scripts/coinmarketcap/index.ts'),
                runScript('scripts/kraken/index.ts'),
                runScript('scripts/cryptocompare/index.ts')
            ]);
        } catch (error) {
            console.error('Error in script execution:', error);
        }

        console.log(`Waiting ${DELAY_BETWEEN_RUNS/1000} seconds before next run...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_RUNS));
    }
}

console.log('Starting runner');
runAllScripts().catch(console.error);
EOF

RUN chmod +x /scripts/runner.ts

CMD ["bun", "run", "runner.ts"]
