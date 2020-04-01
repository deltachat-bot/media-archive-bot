const { deltachat, log } = require('deltachat-node-bot-base')
const config = require('config')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

const webDir = path.join(__dirname, '..', 'web')
const docRoot = path.join(webDir, 'public')
const archiveDir = path.join(docRoot, 'files')
const htmlFile = path.join(docRoot, 'index.html')
const feedFile = path.join(docRoot, 'feed.xml')

fs.mkdirSync(archiveDir, {recursive: true})

const dc_started = deltachat.start(async (chat, message) => {
  log("Received message")
  const filepath = message.getFile()
  if (filepath === '') {
    log("Message has no file, ignoring")
    return
  }

  const filename = message.getFilename()
  fs.copyFileSync(filepath, path.join(archiveDir, filename))

  // Render HTML and feed file.
  // TODO: sort by date
  files = fs.readdirSync(archiveDir).sort((a, b) => {
    let aTime = fs.statSync(path.join(archiveDir, a)).ctime.getTime()
    let bTime = fs.statSync(path.join(archiveDir, b)).ctime.getTime()
    return aTime - bTime
  }).map((filename) => {
    var file = {name: filename}
    let fileExtension = path.extname(filename)
    switch (fileExtension.toLowerCase()) {
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.svg':
      case '.gif':
        file.type = 'image'
        break;
      case '.mov':
      case '.mkv':
        file.type = 'video'
        break;
      case '.pdf':
      case '.odt':
        file.type = 'document'
        break;
      default:
        log("Unknown file extension: ", fileExtension)
    }
    return file
  })
  log("files: ", files)


  log(`Rendering HTML file`)
  const html = await ejs.renderFile(
    path.join(__dirname, '../web/archive-html.ejs').toString(),
    {
      files: files,
      fileBaseUrl: '/files'
    }
  )
  fs.writeFileSync(htmlFile, html)

  log(`Rendering XML file`)
  const xml = await ejs.renderFile(
    path.join(__dirname, '../web/archive-xml.ejs').toString(),
    {
      updated_at: Date.now, // TODO: fix date format
      files: files,
      fileBaseUrl: '/files' // TODO: make configurable
    }
  )
  fs.writeFileSync(feedFile, xml)
  log("finished generating archive files")
})
