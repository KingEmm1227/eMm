/* eslint-env jest */

import fs from 'fs-extra'
import { join } from 'path'
import { nextBuild } from 'next-test-utils'

const appDir = join(__dirname, '..')

describe('Promise in next config', () => {
  afterEach(() => fs.remove(join(appDir, 'next.config.js')))

  it('should throw error when a promise is return on config', async () => {
    fs.writeFile(
      join(appDir, 'next.config.js'),
      `
      module.exports = (phase, { isServer }) => {
        return new Promise((resolve) => {
          resolve({ target: 'serverless' })
        })
      }
    `
    )

    const { stderr, stdout } = await nextBuild(appDir, undefined, {
      stderr: true,
      stdout: true,
    })

    expect(stderr + stdout).toMatch(
      /Error: > Promise returned in next config\. https:\/\//
    )
  })

  it('should warn when a promise is returned on webpack', async () => {
    fs.writeFile(
      join(appDir, 'next.config.js'),
      `
      module.exports = (phase, { isServer }) => {
        return {
          webpack: async (config) => {
            return config
          }
        }
      }
    `
    )

    const { stderr, stdout } = await nextBuild(appDir, undefined, {
      stderr: true,
      stdout: true,
    })
    expect(stderr + stdout).toMatch(
      /> Promise returned in next config\. https:\/\//
    )
  })
})
