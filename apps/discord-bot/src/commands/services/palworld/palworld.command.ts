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
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import {
    ApplicationCommandOptionType,
    CommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
} from "discord.js";
import axios from 'axios';


@Discord()
@SlashGroup({
    name: "palworld",
    description: "Palworld server management commands"
})
export class PalworldCommand
{
    private readonly host_name: string;
    private readonly port: number;

    private readonly api;

    constructor() 
    {
        this.host_name = process.env.BACKEND_HOST ?? 'localhost';
        this.port = parseInt(process.env.BACKEND_PORT ?? '3000');

        this.api = axios.create({
            baseURL: `http://${this.host_name}:${this.port}/services/palworld`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    @Slash({
        name: "info",
        description: "Get Palworld server connection info"
    })
    @SlashGroup("palworld")
    async info(interaction: CommandInteraction): Promise<void> {
        const response = await this.api.get('/info');
        await interaction.reply({
            content: JSON.stringify(response.data, null, 2),
            flags: MessageFlags.Ephemeral
        })
    }

    @Slash({
        name: "metrics",
        description: "Get Palworld server "
    })
    @SlashGroup("palworld")
    async metrics(interaction: CommandInteraction): Promise<void> {
        const response = await this.api.get('/metrics');
        await interaction.reply({
            content: JSON.stringify(response.data, null, 2),
            flags: MessageFlags.Ephemeral
        })
    }
}

