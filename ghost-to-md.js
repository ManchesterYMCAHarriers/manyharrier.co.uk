const ghostExport = require("./ghost-export")
const fs = require("fs")
const fetch = require("node-fetch")
const util = require("util")
const streamPipeline = util.promisify(require("stream").pipeline)

const mediaDir = "./static/media/"
const mediaDirInMarkdown = "/media/"
const mdDir = "./src/pages/blog/"

const newImagePath = oldPath => {
  return oldPath.replace(/^\/content\/images\//g, "").replace(/\//g, "-")
}

const downloadAndStoreImage = async path => {
  const url = 'https://www.manyharrier.co.uk' + path
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Network response was not OK: ${res.status} when fetching file ${url}`)
  }
  const filename = `${mediaDir + newImagePath(path)}`
  return new Promise((resolve, reject) => {
    const imageFile = fs.createWriteStream(filename)
    imageFile.on('open', () => {
      res.body.pipe(imageFile)
    })
    res.body.on('error', err => {
      reject(err)
    })
    res.body.on('finish', () => {
      resolve(filename)
    })
  })
}

const failedImages = []

async function downloadPost({imageRegex, templateKey, title, slug, markdown, image, meta_description, published_at}) {
  console.log(`${slug}: processing record`)

  if (!published_at) {
    console.log(`${slug}: skip unpublished record`)
    return
  }

  if (image) {
    console.log(`${slug}: downloading hero image: ${image}`)
    try {
      const downloadedFile = await downloadAndStoreImage(image)
      console.log(`${slug}: downloaded hero image: ${downloadedFile}`)
    } catch (err) {
      console.error(`${slug}: failed to download hero image: ${image}`, err)
      failedImages.push(image)
    }
  }

  const imagesToDownload = []
  let match
  while ((match = markdown.match(imageRegex)) !== null) {
    imagesToDownload.push(match[0])
    markdown = markdown.replace(imageRegex, mediaDirInMarkdown + "$1" + "-" + "$2" + "-" + "$3");
  }

  if (imagesToDownload.length === 0) {
    console.log(`${slug}: no body images to download`)
  } else {
    console.log(`${slug}: downloading images from markdown body`)
    for (let bodyImage of imagesToDownload) {
      try {
        console.log(`${slug}: downloading image: ${bodyImage}`)
        const downloadedFile = await downloadAndStoreImage(bodyImage)
        console.log(`${slug}: downloaded image: ${downloadedFile}`)
      } catch (err) {
        console.error(`${slug}: failed to download image: ${bodyImage}`, err)
        failedImages.push(bodyImage)
      }
    }
  }

  const filename = `${mdDir + published_at.substring(0, 10)}-${slug}.md`
  const mdFile = fs.createWriteStream(filename)

  console.log(`${slug}: writing Markdown file: ${filename}`)
  return new Promise((resolve, reject) => {
    mdFile.on('open', () => {
      mdFile.write(`---` + "\n")
      mdFile.write(`templateKey: "${templateKey}"` + "\n")
      mdFile.write(`blogKey: "${title}"` + "\n")
      mdFile.write(`description: "${meta_description}"` + "\n")
      if (image) {
        mdFile.write(`heroImage: "${newImagePath(image)}"` + "\n")
      }
      mdFile.write(`publishedAt: "${published_at}"` + "\n")
      mdFile.write(`---` + "\n")

      mdFile.write(markdown + "\n")
      mdFile.end()
    })

    mdFile.on('finish', () => {
      console.log(`${slug}: wrote markdown file: ${filename}`)
      resolve(filename)
    })

    mdFile.on('error', err => {
      console.error(`${slug}: failed to write markdown file: ${filename}`, err)
      reject(err)
    });
  })
}

(async function downloadPosts() {
  const imageRegex = /\/content\/images\/(\d+)\/(\d+)\/(.+)/;
  const templateKey = `blog-post`;

  for (const post of ghostExport.db[0].data.posts) {
    await downloadPost({imageRegex, templateKey, ...post})
  }

  for (const image of failedImages) {
    console.log(`Failed to download image: ${image}; trying again`)
  }
})()
