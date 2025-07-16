export const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  authenticationEndpoint: "/api/imagekit-auth",
}

export const uploadToImageKit = async (file: File, fileName: string) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("fileName", fileName)
  formData.append("publicKey", imagekitConfig.publicKey)

  // Get authentication parameters
  const authResponse = await fetch(imagekitConfig.authenticationEndpoint)
  const authData = await authResponse.json()

  formData.append("signature", authData.signature)
  formData.append("expire", authData.expire)
  formData.append("token", authData.token)

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload image")
  }

  return response.json()
}
