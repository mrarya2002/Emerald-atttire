import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!
  const token = crypto.randomUUID()
  const expire = Math.floor(Date.now() / 1000) + 2400 // 40 minutes

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex")

  return NextResponse.json({
    token,
    expire,
    signature,
  })
}
