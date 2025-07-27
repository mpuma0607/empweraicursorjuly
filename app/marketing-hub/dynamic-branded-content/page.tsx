"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { useTenantConfig } from "@/hooks/useTenantConfig"
import { getUserBrandingProfile } from "@/app/profile/branding/actions"
import type { UserBrandingProfile } from "@/app/profile/branding/actions"
import { getBrandOptionsForTenant } from "@/lib/tenant-brand-options"
import { fetchCloudinaryImages, applyBrandingTransformation } from "./actions"
import type { CloudinaryImage } from "./actions"

// Define the categories based on Cloudinary folder structure
const categories = [
  {
    id: "motivational",
    name: "Motivational",
    description: "Inspirational content to motivate clients and prospects",
  },
  {
    id: "educational",
    name: "Educational",
    description: "Informative content to educate your audience about real estate",
  },
  {
    id: "entertaining",
    name: "Entertaining",
    description: "Fun and engaging content to entertain your followers",
  },
  {
    id: "engaging",
    name: "Engaging",
    description: "Interactive content to boost engagement with your audience",
  },
  {
    id: "prospecting",
    name: "Prospecting",
    description: "Targeted content for specific prospecting niches",
    subCategories: [
      { id: "soi", name: "Sphere of Influence" },
      { id: "probate", name: "Probate" },
      { id: "pre-foreclosure", name: "Pre-Foreclosure" },
      { id: "divorce", name: "Divorce" },
      { id: "absentee-owners", name: "Absentee Owners" },
      { id: "expired", name: "Expired Listings" },
      { id: "fsbo", name: "For Sale By Owner" },
    ],
  },
]

type BrandingOptions = {
  wantBranding: boolean
  brandingChoice: "saved-brand" | "saved-logo" | "dropdown"
  selectedBrand: string
  includeContact: boolean
  name: string
  email: string
  phone: string
}

export default function DynamicBrandedContentPage() {
  const [activeCategory, setActiveCategory] = useState("motivational")
  const [activeProspectingTab, setActiveProspectingTab] = useState("soi")
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [userBrandingProfile, setUserBrandingProfile] = useState<UserBrandingProfile | null>(null)
  const [images, setImages] = useState<Record<string, CloudinaryImage[]>>({})
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({})
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [brandingImage, setBrandingImage] = useState<string | null>(null)
  const [brandedImageUrl, setBrandedImageUrl] = useState<string | null>(null)

  const { user, loading: userLoading } = useMemberSpaceUser()
  const tenantConfig = useTenantConfig()
  const brandOptions = tenantConfig ? getBrandOptionsForTenant(tenantConfig) : []

  // Default branding options
  const [brandingOptions, setBrandingOptions] = useState<BrandingOptions>({
    wantBranding: false,
    brandingChoice: "dropdown",
    selectedBrand: "",
    includeContact: false,
    name: "",
    email: "",
    phone: "",
  })

  // Load user branding profile
  useEffect(() => {
    async function loadUserBrandingProfile() {
      if (!user?.id || userLoading || !tenantConfig) {
        setLoadingProfile(false)
        return
      }

      try {
        const profile = await getUserBrandingProfile(user.id.toString(), tenantConfig.id)
        setUserBrandingProfile(profile)
        console.log("Loaded user branding profile:", profile)

        // Initialize branding options with user profile data
        if (profile) {
          setBrandingOptions((prev) => ({
            ...prev,
            selectedBrand: profile.brand || prev.selectedBrand,
            name: prev.name || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email: prev.email || user.email || "",
            phone: prev.phone || "",
          }))
        }
      } catch (error) {
        console.error("Error loading user branding profile:", error)
      } finally {
        setLoadingProfile(false)
      }
    }

    loadUserBrandingProfile()
  }, [user, userLoading, tenantConfig])

  // Load images for a category when it's opened
  const loadImagesForCategory = async (category: string, subCategory?: string) => {
    const folderPath = subCategory
      ? `social-content/unbranded/${category}/${subCategory}`
      : `social-content/unbranded/${category}`
    const cacheKey = subCategory ? `${category}-${subCategory}` : category

    // Check if we already have images for this category
    if (images[cacheKey] && images[cacheKey].length > 0) {
      return
    }

    setLoadingImages((prev) => ({ ...prev, [cacheKey]: true }))

    try {
      const fetchedImages = await fetchCloudinaryImages(folderPath)
      setImages((prev) => ({ ...prev, [cacheKey]: fetchedImages }))
    } catch (error) {
      console.error(`Error loading images for ${folderPath}:`, error)
    } finally {
      setLoadingImages((prev) => ({ ...prev, [cacheKey]: false }))
    }
  }

  // Handle modal open
  const handleOpenModal = (category: string) => {
    setOpenModal(category)
    if (category === "prospecting") {
      loadImagesForCategory(category, activeProspectingTab)
    } else {
      loadImagesForCategory(category)
    }
  }

  // Handle prospecting tab change
  const handleProspectingTabChange = (tab: string) => {
    setActiveProspectingTab(tab)
    loadImagesForCategory("prospecting", tab)
  }

  // Handle branding option changes
  const handleBrandingOptionChange = (field: keyof BrandingOptions, value: any) => {
    setBrandingOptions((prev) => ({ ...prev, [field]: value }))
  }

  // Handle brand this post button click
  const handleBrandThisPost = async (publicId: string) => {
    if (!brandingOptions.wantBranding) {
      // If no branding wanted, just show the original image
      setSelectedImage(publicId)
      setBrandedImageUrl(null)
      return
    }

    setBrandingImage(publicId)
    setBrandedImageUrl(null)

    try {
      // Determine which logo to use based on branding choice
      let logoIdentifier = ""
      if (brandingOptions.brandingChoice === "saved-brand" && userBrandingProfile?.brand) {
        logoIdentifier = userBrandingProfile.brand
      } else if (brandingOptions.brandingChoice === "saved-logo" && userBrandingProfile?.custom_logo_url) {
        // Extract public_id from saved logo URL
        const publicIdMatch = userBrandingProfile.custom_logo_url.match(/\/([^/]+)\.(jpg|jpeg|png|gif|webp)$/i)
        if (publicIdMatch) {
          logoIdentifier = `branding-logos:${publicIdMatch[1]}`
        }
      } else if (brandingOptions.brandingChoice === "dropdown") {
        logoIdentifier = brandingOptions.selectedBrand
      }

      // Prepare contact info if needed
      const contactInfo = brandingOptions.includeContact
        ? {
            name: brandingOptions.name,
            email: brandingOptions.email,
            phone: brandingOptions.phone,
          }
        : null

      // Call server action to apply branding
      const result = await applyBrandingTransformation({
        publicId,
        brandingChoice: brandingOptions.brandingChoice,
        logoIdentifier,
        contactInfo,
      })

      setBrandedImageUrl(result.url)
      setSelectedImage(publicId)
    } catch (error) {
      console.error("Error applying branding:", error)
      // Show original image if branding fails
      setSelectedImage(publicId)
      setBrandedImageUrl(null)
    } finally {
      setBrandingImage(null)
    }
  }

  // Download a branded image
  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      // Fetch the image as a blob to ensure proper download
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error("Failed to fetch image")

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename || "branded-content.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Error downloading image:", error)
      // Fallback: try direct link method
      try {
        const link = document.createElement("a")
        link.href = imageUrl
        link.download = filename || "branded-content.jpg"
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError)
        alert("Download failed. Please try right-clicking the image and selecting 'Save As'")
      }
    }
  }

  // Render branding options section
  const renderBrandingOptions = () => {
    if (!brandingOptions.wantBranding) return null

    // Check if user has branding profile
    const hasProfile = userBrandingProfile && (userBrandingProfile.brand || userBrandingProfile.custom_logo_url)

    return (
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label className="text-lg font-medium">Branding Options:</Label>
            <RadioGroup
              value={brandingOptions.brandingChoice}
              onValueChange={(value: "saved-brand" | "saved-logo" | "dropdown") =>
                handleBrandingOptionChange("brandingChoice", value)
              }
            >
              {/* Show saved brand option if user has a brand in profile */}
              {hasProfile && userBrandingProfile?.brand && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="saved-brand" id="saved-brand" />
                  <Label htmlFor="saved-brand">
                    Use your saved brand: <strong>{userBrandingProfile.brand}</strong>
                  </Label>
                </div>
              )}

              {/* Show saved logo option if user has a custom logo in profile */}
              {hasProfile && userBrandingProfile?.custom_logo_url && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="saved-logo" id="saved-logo" />
                  <Label htmlFor="saved-logo">Use your custom logo from profile</Label>
                  {userBrandingProfile.custom_logo_url && (
                    <div className="ml-4">
                      <Image
                        src={userBrandingProfile.custom_logo_url || "/placeholder.svg"}
                        alt="Saved logo"
                        width={50}
                        height={50}
                        className="object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Show dropdown option ONLY if user has NO profile */}
              {!hasProfile && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dropdown" id="dropdown" />
                  <Label htmlFor="dropdown">Select brand from list</Label>
                </div>
              )}
            </RadioGroup>

            {/* Show dropdown selection if no profile and dropdown is selected */}
            {!hasProfile && brandingOptions.brandingChoice === "dropdown" && (
              <div className="space-y-2">
                <Label htmlFor="selectedBrand">Select a brand</Label>
                <Select
                  value={brandingOptions.selectedBrand}
                  onValueChange={(value) => handleBrandingOptionChange("selectedBrand", value)}
                >
                  <SelectTrigger id="selectedBrand">
                    <SelectValue placeholder="Choose a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandOptions.map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Show link to brand profile if no custom logo */}
            {hasProfile && userBrandingProfile?.brand && !userBrandingProfile?.custom_logo_url && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">Want to use a custom logo?</p>
                <Link
                  href="/profile/branding"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Add it to your brand profile
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <p className="text-xs text-blue-600 mt-1">You can update your branding info there</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-medium">Would you like to add your contact info?</Label>
              <RadioGroup
                value={brandingOptions.includeContact.toString()}
                onValueChange={(value) => handleBrandingOptionChange("includeContact", value === "true")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="contact-yes" />
                  <Label htmlFor="contact-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="contact-no" />
                  <Label htmlFor="contact-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {brandingOptions.includeContact && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={brandingOptions.name}
                    onChange={(e) => handleBrandingOptionChange("name", e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={brandingOptions.email}
                    onChange={(e) => handleBrandingOptionChange("email", e.target.value)}
                    placeholder="Your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={brandingOptions.phone}
                    onChange={(e) => handleBrandingOptionChange("phone", e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render image grid for a category
  const renderImageGrid = (categoryId: string, subCategoryId?: string) => {
    const cacheKey = subCategoryId ? `${categoryId}-${subCategoryId}` : categoryId
    const categoryImages = images[cacheKey] || []
    const isLoading = loadingImages[cacheKey]

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
          <span className="ml-2 text-gray-600">Loading images...</span>
        </div>
      )
    }

    if (categoryImages.length === 0) {
      return <p className="text-center text-gray-500 p-8">No images found in this category.</p>
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {categoryImages.map((image) => (
          <div key={image.public_id} className="relative group">
            <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              <Image
                src={image.secure_url || "/placeholder.svg"}
                alt={image.filename}
                fill
                className="object-contain transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <Button
                  onClick={() => handleBrandThisPost(image.public_id)}
                  disabled={brandingImage === image.public_id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-pink-600 hover:bg-pink-700 text-white"
                >
                  {brandingImage === image.public_id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Branding...
                    </>
                  ) : (
                    "Brand This Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Dynamic Branded Content</CardTitle>
            <CardDescription className="text-pink-100">
              Access our library of ready-to-use social media content with optional custom branding
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {/* Branding Toggle */}
            <div className="mb-6">
              <Label className="text-xl font-medium">Would you like to brand and personalize this content?</Label>
              <div className="mt-2">
                <RadioGroup
                  value={brandingOptions.wantBranding.toString()}
                  onValueChange={(value) => handleBrandingOptionChange("wantBranding", value === "true")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="brand-yes" />
                    <Label htmlFor="brand-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="brand-no" />
                    <Label htmlFor="brand-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {loadingProfile && brandingOptions.wantBranding && (
                <p className="text-sm text-gray-500 mt-2">Loading your branding profile...</p>
              )}

              {!loadingProfile && renderBrandingOptions()}
            </div>

            {/* Content Categories */}
            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">Browse Content Categories</h3>
              <p className="text-gray-600 mb-6">
                Click on any category to browse content, then use the "Brand This Post" button on individual images to
                apply your branding.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Dialog
                    key={category.id}
                    open={openModal === category.id}
                    onOpenChange={(open) => {
                      if (open) {
                        handleOpenModal(category.id)
                      } else {
                        setOpenModal(null)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="h-auto min-h-24 w-full border-2 hover:border-pink-500 hover:bg-pink-50 transition-colors bg-transparent p-4 flex flex-col items-center justify-center">
                        <div className="text-center w-full">
                          <h3 className="text-lg font-medium text-black mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-500 leading-tight break-words overflow-hidden text-ellipsis">
                            {category.description}
                          </p>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                      <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-black">{category.name} Content</DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto overflow-x-auto">
                        {category.id === "prospecting" ? (
                          <Tabs
                            defaultValue={activeProspectingTab}
                            onValueChange={handleProspectingTabChange}
                            className="w-full"
                          >
                            <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4 flex-shrink-0">
                              {category.subCategories?.map((subCategory) => (
                                <TabsTrigger key={subCategory.id} value={subCategory.id}>
                                  {subCategory.name}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            {category.subCategories?.map((subCategory) => (
                              <TabsContent key={subCategory.id} value={subCategory.id}>
                                {renderImageGrid(category.id, subCategory.id)}
                              </TabsContent>
                            ))}
                          </Tabs>
                        ) : (
                          renderImageGrid(category.id)
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => {
            setSelectedImage(null)
            setBrandedImageUrl(null)
          }}
        >
          <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{brandedImageUrl ? "Branded Image Preview" : "Original Image Preview"}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full max-w-[1080px] mx-auto">
              <Image
                src={
                  brandedImageUrl ||
                  Object.values(images)
                    .flat()
                    .find((img) => img.public_id === selectedImage)?.secure_url ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt="Preview"
                width={1080}
                height={1080}
                className="w-full h-auto rounded object-contain"
              />
            </div>
            <div className="mt-4 text-center space-x-4">
              {brandedImageUrl ? (
                <Button
                  onClick={() => downloadImage(brandedImageUrl, "branded-content.jpg")}
                  className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Download Branded Image
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    downloadImage(
                      Object.values(images)
                        .flat()
                        .find((img) => img.public_id === selectedImage)?.secure_url || "",
                      "original-content.jpg",
                    )
                  }
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Download Original Image
                </Button>
              )}
              {!brandedImageUrl && brandingOptions.wantBranding && (
                <Button
                  onClick={() => handleBrandThisPost(selectedImage)}
                  disabled={brandingImage === selectedImage}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
                >
                  {brandingImage === selectedImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Branding...
                    </>
                  ) : (
                    "Brand This Image"
                  )}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
