import fs from "fs"
import path from "path"
import sharp from "sharp"
import ffmpeg from "fluent-ffmpeg"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const imagesPath = path.join(__dirname, "../public/images")

const outputFilePath = path.join(__dirname, "imageData.json")

const preprocessAndResizeImage = async (imagePath, outputFolder, maxSize = 800) => {
  const fileName = path.basename(imagePath)
  const outputPath = path.join(outputFolder, fileName)

  try {
    // Read the image, auto-rotate it based on EXIF data, and then resize
    await sharp(imagePath)
      .rotate() // This will automatically adjust the image based on EXIF orientation
      .resize(maxSize)
      .toFile(outputPath)
    console.log(`Resized and auto-rotated image: ${imagePath} -> ${outputPath}`)
  } catch (error) {
    console.error(`Error resizing image ${imagePath}: ${error.message}`)
  }
}

const preprocessAndResizeVideo = async (videoPath, outputFolder, maxWidth = 800) => {
  const fileName = path.basename(videoPath)
  const outputPath = path.join(outputFolder, fileName)

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(outputPath)
        .videoCodec("libx264")
        .size(`?x${maxWidth}`)
        .on("end", resolve)
        .on("error", reject)
        .run()
    })
    console.log(`Resized video: ${videoPath} -> ${outputPath}`)
  } catch (error) {
    console.error(`Error resizing video ${videoPath}: ${error.message}`)
  }
}

const parseDescriptionFile = (folderPath) => {
  const descFilePath = path.join(folderPath, "desc.txt")

  if (fs.existsSync(descFilePath)) {
    const content = fs.readFileSync(descFilePath, "utf-8").trim()
    const [date, ...descriptionLines] = content.split("\n")

    return {
      date: date.trim(),
      description: descriptionLines.join(" ").trim(),
    }
  }

  return {
    date: null,
    description: null,
  }
}

const clearFolder = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file)
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath)
      }
    })
    console.log(`Cleared folder: ${folderPath}`)
  }
}

const generateImageJSON = async () => {
  const result = []

  const folders = fs
    .readdirSync(imagesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  folders.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

  for (const folder of folders) {
    const folderPath = path.join(imagesPath, folder)
    const outputFolder = path.join(imagesPath, folder, "resized")

    // Ensure the resized folder exists
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder)
    }

    // Clear all files in the resized folder
    clearFolder(outputFolder)

    const files = fs
      .readdirSync(folderPath)
      .filter((file) => /\.(jpe?g|png|gif|mov|mp4)$/i.test(file))
      .map((file) => path.join(folderPath, file))

    for (const file of files) {
      if (/\.(jpe?g|png|gif)$/i.test(file)) {
        await preprocessAndResizeImage(file, outputFolder)
      } else if (/\.(mov|mp4)$/i.test(file)) {
        await preprocessAndResizeVideo(file, outputFolder)
      }
    }

    const { date, description } = parseDescriptionFile(folderPath)

    result.push({
      pictures: files.map((file) => `/images/${folder}/resized/${path.basename(file)}`),
      date,
      description,
    })
  }

  return result
}

generateImageJSON()
  .then((imageJSON) => {
    fs.writeFileSync(outputFilePath, JSON.stringify(imageJSON, null, 2), "utf-8")
    console.log(`JSON data written to ${outputFilePath}`)
  })
  .catch((err) => console.error("Error generating image JSON:", err))
