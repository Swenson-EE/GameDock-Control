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

import { type FastifyReply, type FastifyRequest } from "fastify";
import { PalworldGameServer } from '@backend/games/palworld/palworld.game-server.js'

export class PalworldController
{
    constructor(private readonly server: PalworldGameServer) {}

    async info(request: FastifyRequest, reply: FastifyReply)
    {
        const info = await this.server.info();
        return reply.send(info);
    }

    async metrics(request: FastifyRequest, reply: FastifyReply)
    {
        const metrics = await this.server.metrics();
        return reply.send(metrics);
    }

    async getPlayers(request: FastifyRequest, reply: FastifyReply)
    {
        const players = await this.server.getPlayers()
        return reply.send(players)
    }


    async start(request: FastifyRequest, reply: FastifyReply)
    {
        await this.server.start();
        const status = await this.server.status();
        return reply.status(status.running ? 200 : 503).send()
    }

    async restart(request: FastifyRequest, reply: FastifyReply)
    {
        await this.server.restart();
        const status = await this.server.status();
        return reply.status(status.running ? 200 : 503).send()
    }

    async stop(request: FastifyRequest, reply: FastifyReply)
    {
        //const { waitTime, message } = request.body as { waitTime?: number; message?: string };
        //const stopStatus = await this.server.stop(waitTime, message);
        await this.server.stop();
        const status = await this.server.status();

        return reply.status(!status.running ? 200 : 503).send()
    }

    async save(request: FastifyRequest, reply: FastifyReply)
    {
        const saveStatus = await this.server.saveWorld();
        return reply.status(saveStatus).send()
    }


    async kickPlayer(request: FastifyRequest, reply: FastifyReply)
    {
        const { name, message } = request.body as { name: string, message?: string };
        const player = await this.server.findPlayerByName(name);

        if (player === undefined)
        {
            return reply.status(400).send();
        }

        const kickStatus = await this.server.kickPlayer(player['userId'], message);
        return reply.status(kickStatus).send();
    }


    async kickAllPlayers(request: FastifyRequest, reply: FastifyReply)
    {
        const { players } = await this.server.getPlayers();
         
        const message = 'The server is current undergoing maintenance or a restart. Please check back in a few minutes.';
        const playerKickPromises = players.map(player => {
            return this.server.kickPlayer(player['userId'], message)
        })

        const data = await Promise.all(playerKickPromises);
        console.log('Kick data:')
        console.log(data)

        return reply.status(200).send();
    }

    
    async banPlayer(request: FastifyRequest, reply: FastifyReply)
    {
        const { name, message } = request.body as { name: string, message?: string };
        const player = await this.server.findPlayerByName(name);

        if (player === undefined)
        {
            return reply.status(400).send();
        }

        const banStatus = await this.server.banPlayer(player['userId'], message ?? 'You have been banned.');
        return reply.status(banStatus).send();
    }

    async unbanPlayer(request: FastifyRequest, reply: FastifyReply)
    {
        const { userid } = request.body as { userid: string };
        const unbanStatus = await this.server.unbanPlayer(userid);
        return reply.status(unbanStatus).send();
    }
}