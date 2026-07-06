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

import { test, describe, beforeAll, afterAll, expect } from 'vitest';
import { docker } from '../docker.js';
import type Dockerode from 'dockerode';

const TEST_CONTAINER_NAME = 'dockerode-test-container';

describe('Dockerode Integration Tests', () => {
  let container: Dockerode.Container;

  beforeAll(async () => {
    try {
      const existing = docker.getContainer(TEST_CONTAINER_NAME);
      await existing.remove({ force: true });
    } catch (e) {
      // Container doesn't exist, ignore
    }
  });


  test('should successfully connect, pull, start, and remove a container', async () => {
    // 1. Verify connection by listing existing containers
    const containers = await docker.listContainers({ all: true });
    expect(Array.isArray(containers), 'Containers list should be an array').toBe(true);

    // 2. Pull a hello-world image
    await new Promise((res, rej) => {
      docker.pull('hello-world:latest', (err: any, stream: any) => {
        if (err) return rej(err);
        docker.modem.followProgress(stream, (err, output) => {
          if (err) return rej(err);
          res(output);
        });
      });
    });

    // 3. Create and start container
    container = await docker.createContainer({
      Image: 'hello-world',
      name: TEST_CONTAINER_NAME
    });
    expect(container.id, 'Container should have a valid ID').toBeDefined();
    await container.start();

    // 4. Verify it actually ran/exists
    const inspectData = await container.inspect();
    expect(inspectData.State.Running, 'Hello-world should finish executing immediately').toBe(false);
  });


  afterAll(async () => {
    if (container) {
      try {
        await container.remove();
      } catch (err: any) {
        console.log('Cleanup failed', err.message);
      }
    }
  });
});