"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { uploadToImageKit } from "@/lib/imagekit"

export default function AddProduct() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    // sizes: [] as string[],
    // colors: [] as string[],
    images: [] as string[],
    is_new: false,
    stock_quantity: "",
  })

  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploadingImages(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `products/${Date.now()}-${file.name}`
        const result = await uploadToImageKit(file, fileName)
        return result.url
      })

      const imageUrls = await Promise.all(uploadPromises)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }))
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("Failed to upload images")
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // const addSize = () => {
  //   if (newSize && !formData.sizes.includes(newSize)) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       sizes: [...prev.sizes, newSize],
  //     }))
  //     setNewSize("")
  //   }
  // }

  // const removeSize = (size: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     sizes: prev.sizes.filter((s) => s !== size),
  //   }))
  // }

  // const addColor = () => {
  //   if (newColor && !formData.colors.includes(newColor)) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       colors: [...prev.colors, newColor],
  //     }))
  //     setNewColor("")
  //   }
  // }

  // const removeColor = (color: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     colors: prev.colors.filter((c) => c !== color),
  //   }))
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
          console.log("error aa rha h pehle")
      const { error } = await supabase.from("products").insert([
        {
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          category: formData.category,
          // sizes: formData.sizes,
          // colors: formData.colors,
          images: formData.images,
          is_new: formData.is_new,
          stock_quantity: Number.parseInt(formData.stock_quantity),
        },
      ])
      console.log("error aa rha h badme")

      if (error) throw error

      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Failed to create product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Add New Product</h2>
        <p className="text-muted-foreground">Create a new product for your store</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_new: checked as boolean }))}
                  />
                  <Label htmlFor="is_new">Mark as new product</Label>
                </div>
              </CardContent>
            </Card>

           
          </div>

          <div className="space-y-6">
            {/* <Card>
              <CardHeader>
                <CardTitle>Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add size (e.g., S, M, L)"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
                  />
                  <Button type="button" onClick={addSize}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size) => (
                    <Badge key={size} variant="secondary" className="cursor-pointer" onClick={() => removeSize(size)}>
                      {size} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                  />
                  <Button type="button" onClick={addColor}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color) => (
                    <Badge
                      key={color}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeColor(color)}
                    >
                      {color} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card> */}

             <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImages}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {uploadingImages ? (
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    ) : (
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    )}
                    <p className="text-sm text-gray-600">
                      {uploadingImages ? "Uploading..." : "Click to upload images or drag and drop"}
                    </p>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
