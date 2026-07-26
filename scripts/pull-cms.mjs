import crypto from "node:crypto"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"

const projectRoot = process.cwd()

function requiredEnvironment(name) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(
      `${name} is required. Add it to .env.local before pulling CMS data.`,
    )
  }

  return value
}

function fileUrlToPath(value) {
  const withoutPrefix = value.replace(/^file:/, "")
  return process.platform === "win32" && withoutPrefix.startsWith("/")
    ? withoutPrefix.slice(1)
    : withoutPrefix
}

function resolveLocalPath(value, fallback) {
  return path.resolve(
    projectRoot,
    fileUrlToPath(value?.trim() || fallback),
  )
}

function trimRemotePath(value) {
  const trimmed = value.replace(/\/+$/, "")
  return trimmed || "/"
}

function shellQuote(value) {
  return `'${value.replaceAll("'", `'\"'\"'`)}'`
}

function run(command, args, { allowFailure = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    windowsHide: true,
  })

  if (result.error) {
    if (allowFailure) {
      return false
    }
    throw new Error(`Could not run ${command}: ${result.error.message}`)
  }

  if (result.status !== 0) {
    if (allowFailure) {
      return false
    }
    throw new Error(`${command} exited with status ${result.status}.`)
  }

  return true
}

function assertSafeLocalTargets(databasePath, mediaRoot) {
  const dangerousDirectories = new Set([
    path.parse(mediaRoot).root,
    path.resolve(projectRoot),
    path.resolve(os.homedir()),
  ])

  if (dangerousDirectories.has(path.resolve(mediaRoot))) {
    throw new Error(
      `Refusing to replace unsafe MEDIA_ROOT destination: ${mediaRoot}`,
    )
  }

  if (fs.existsSync(databasePath) && fs.statSync(databasePath).isDirectory()) {
    throw new Error(
      `PORTFOLIO_DATABASE_PATH must point to a file, not ${databasePath}.`,
    )
  }

  if (path.resolve(databasePath) === path.resolve(mediaRoot)) {
    throw new Error("The local database and media destinations cannot be equal.")
  }
}

function installSnapshot({
  downloadedDatabase,
  extractedMedia,
  localDatabase,
  localMediaRoot,
  replacementId,
}) {
  const incomingDatabase = `${localDatabase}.cms-incoming-${replacementId}`
  const incomingMedia = `${localMediaRoot}.cms-incoming-${replacementId}`
  const targets = [
    { path: localDatabase, directory: false },
    { path: `${localDatabase}-wal`, directory: false },
    { path: `${localDatabase}-shm`, directory: false },
    { path: localMediaRoot, directory: true },
  ]
  const movedTargets = []
  let databaseInstalled = false
  let mediaInstalled = false

  fs.mkdirSync(path.dirname(localDatabase), { recursive: true })
  fs.mkdirSync(path.dirname(localMediaRoot), { recursive: true })
  fs.copyFileSync(downloadedDatabase, incomingDatabase, fs.constants.COPYFILE_EXCL)
  fs.cpSync(extractedMedia, incomingMedia, {
    recursive: true,
    errorOnExist: true,
    force: false,
  })

  try {
    for (const target of targets) {
      if (!fs.existsSync(target.path)) {
        continue
      }

      const backupPath = `${target.path}.cms-backup-${replacementId}`
      fs.renameSync(target.path, backupPath)
      movedTargets.push({ ...target, backupPath })
    }

    fs.renameSync(incomingDatabase, localDatabase)
    databaseInstalled = true
    fs.renameSync(incomingMedia, localMediaRoot)
    mediaInstalled = true
  } catch (error) {
    if (databaseInstalled) {
      fs.rmSync(localDatabase, { force: true })
    }
    if (mediaInstalled) {
      fs.rmSync(localMediaRoot, { recursive: true, force: true })
    }

    for (const target of movedTargets.reverse()) {
      if (fs.existsSync(target.backupPath)) {
        fs.renameSync(target.backupPath, target.path)
      }
    }

    throw error
  } finally {
    fs.rmSync(incomingDatabase, { force: true })
    fs.rmSync(incomingMedia, { recursive: true, force: true })
  }

  for (const target of movedTargets) {
    try {
      fs.rmSync(target.backupPath, {
        recursive: target.directory,
        force: true,
      })
    } catch (error) {
      console.warn(`Could not remove local backup ${target.backupPath}:`, error)
    }
  }
}

function main() {
  const sshHost = requiredEnvironment("CMS_SSH_HOST")
  const remoteRoot = trimRemotePath(
    process.env.CMS_REMOTE_ROOT?.trim() ||
      "/home/xalonious/appdata/portfolio",
  )
  const remoteDatabase = trimRemotePath(
    process.env.CMS_REMOTE_DATABASE_PATH?.trim() ||
      path.posix.join(remoteRoot, "portfolio.db"),
  )
  const remoteMediaRoot = trimRemotePath(
    process.env.CMS_REMOTE_MEDIA_ROOT?.trim() ||
      path.posix.join(remoteRoot, "uploads"),
  )
  const localDatabase = resolveLocalPath(
    process.env.PORTFOLIO_DATABASE_PATH?.trim() ||
      (process.env.DATABASE_URL?.startsWith("file:")
        ? process.env.DATABASE_URL
        : undefined),
    ".data/portfolio.db",
  )
  const localMediaRoot = resolveLocalPath(
    process.env.MEDIA_ROOT,
    ".data/uploads",
  )
  const sshPort = process.env.CMS_SSH_PORT?.trim()
  const identityFile = process.env.CMS_SSH_IDENTITY_FILE?.trim()
  const transferId = `${Date.now()}-${crypto.randomUUID()}`
  const remoteSnapshot = `/tmp/portfolio-cms-${transferId}.db`
  const remoteMediaArchive = `/tmp/portfolio-cms-${transferId}.tar`
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "portfolio-cms-pull-"),
  )
  const downloadedDatabase = path.join(temporaryDirectory, "portfolio.db")
  const downloadedMediaArchive = path.join(temporaryDirectory, "uploads.tar")
  const extractedDirectory = path.join(temporaryDirectory, "extracted")
  const remoteMediaParent = path.posix.dirname(remoteMediaRoot)
  const remoteMediaName = path.posix.basename(remoteMediaRoot)
  const extractedMedia = path.join(extractedDirectory, remoteMediaName)
  const sshOptions = [
    ...(sshPort ? ["-p", sshPort] : []),
    ...(identityFile ? ["-i", identityFile] : []),
  ]
  const scpOptions = [
    ...(sshPort ? ["-P", sshPort] : []),
    ...(identityFile ? ["-i", identityFile] : []),
  ]
  let remoteFilesCreated = false

  assertSafeLocalTargets(localDatabase, localMediaRoot)
  fs.mkdirSync(extractedDirectory, { recursive: true })

  console.log(`Creating a production snapshot on ${sshHost}...`)

  try {
    run("ssh", [
      ...sshOptions,
      sshHost,
      `sqlite3 ${shellQuote(remoteDatabase)} ${shellQuote(
        `.backup ${remoteSnapshot}`,
      )}`,
    ])
    remoteFilesCreated = true

    run("ssh", [
      ...sshOptions,
      sshHost,
      `tar -C ${shellQuote(remoteMediaParent)} -cf ${shellQuote(
        remoteMediaArchive,
      )} ${shellQuote(remoteMediaName)}`,
    ])

    console.log("Downloading the database and media...")
    run("scp", [
      ...scpOptions,
      `${sshHost}:${remoteSnapshot}`,
      downloadedDatabase,
    ])
    run("scp", [
      ...scpOptions,
      `${sshHost}:${remoteMediaArchive}`,
      downloadedMediaArchive,
    ])

    run("tar", [
      "-xf",
      downloadedMediaArchive,
      "-C",
      extractedDirectory,
    ])

    if (!fs.existsSync(extractedMedia)) {
      throw new Error(
        `The media archive did not contain the expected ${remoteMediaName} directory.`,
      )
    }

    console.log("Replacing the local CMS snapshot...")
    installSnapshot({
      downloadedDatabase,
      extractedMedia,
      localDatabase,
      localMediaRoot,
      replacementId: transferId,
    })

    console.log(`Database: ${localDatabase}`)
    console.log(`Media:    ${localMediaRoot}`)
    console.log("Production CMS data is now available in development.")
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true })

    if (remoteFilesCreated) {
      const cleaned = run(
        "ssh",
        [
          ...sshOptions,
          sshHost,
          `rm -f -- ${shellQuote(remoteSnapshot)} ${shellQuote(
            remoteMediaArchive,
          )}`,
        ],
        { allowFailure: true },
      )

      if (!cleaned) {
        console.warn(
          `Could not remove temporary snapshot files from ${sshHost}.`,
        )
      }
    }
  }
}

try {
  main()
} catch (error) {
  console.error(
    error instanceof Error ? `CMS pull failed: ${error.message}` : error,
  )
  process.exitCode = 1
}
