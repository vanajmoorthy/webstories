import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const imagesPath = path.join(__dirname, "../public/images")
const outputFilePath = path.join(__dirname, "imageData.json")

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

const updateDescriptions = async () => {
  const imageJSON = JSON.parse(fs.readFileSync(outputFilePath, "utf-8"))

  const folders = fs
    .readdirSync(imagesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  folders.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

  for (const [index, folder] of folders.entries()) {
    const folderPath = path.join(imagesPath, folder)
    const { date, description } = parseDescriptionFile(folderPath)

    if (imageJSON[index]) {
      imageJSON[index].date = date
      imageJSON[index].description = description
    } else {
      console.warn(`No matching section in JSON for folder: ${folder}`)
    }
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(imageJSON, null, 2), "utf-8")
  console.log(`Descriptions updated in ${outputFilePath}`)
}

updateDescriptions().catch((err) => console.error("Error updating descriptions:", err))
