/*
 *   Copyright (c) 2026 Tyler Swenson (tylerjswenson262@gmail.com)
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

import "reflect-metadata";
import 'dotenv/config';

import { Client } from 'discordx';
import { GatewayIntentBits } from 'discord.js';

import { dirname, importx } from '@discordx/importer';


export const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],

    botGuilds: process.env.BOT_GUILDS ? [process.env.BOT_GUILDS] : [],

    silent: false
})

bot.once('clientReady', async () => {
    await bot.initApplicationCommands();
    console.log(`Loaded application commands for ${bot.user?.tag}!`);
});

bot.on('interactionCreate', (interaction) => {
    bot.executeInteraction(interaction);
});

bot.on('messageCreate', (message) => {
    bot.executeCommand(message);
});


async function run()
{
    // load commands/events
    const extension = import.meta.url.endsWith(".ts") ? ".ts" : ".js";

    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*${extension}`).then(() => {
        console.log("Commands and events loaded");
    });



    if (!process.env.DISCORD_TOKEN) {
        throw new Error("Environment variable 'DISCORD_TOKEN' is not set");
    }

    await bot.login(process.env.DISCORD_TOKEN!);
}


run();

