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


@Discord()
@SlashGroup({
    name: "admin",
    description: "Administration commands"
})
export class AdminCommand 
{
    @Slash({
        name: 'ping',
        description: 'Verify the bot is online'
    })
    @SlashGroup("admin")
    async ping(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            content: "Pong!",
            flags: MessageFlags.Ephemeral
        });
    }

    @Slash({ description: "Echo text" })
    @SlashGroup("admin")
    async echo(
        @SlashOption({
        name: "text",
        description: "text to echo",
        required: true,
        type: ApplicationCommandOptionType.String
        })
        text: string,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.reply(text);
    }

    @Slash({
        name: 'shutdown',
        description: 'Shut down the bot',
        defaultMemberPermissions: PermissionFlagsBits.Administrator,
    })
    @SlashGroup("admin")
    async shutdown(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            content: "Shutting down...",
            flags: MessageFlags.Ephemeral
        });

        process.exit(0);
    }
}

