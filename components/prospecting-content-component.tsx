"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Download, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { useTenantConfig } from "@/contexts/tenant-context"
import { getUserBrandingProfile } from "@/app/profile/branding/actions"
import type { UserBrandingProfile } from "@/app/profile/branding/actions"
import { getBrandOptionsForTenant } from "@/lib/tenant-brand-options"
import { fetchCloudinaryImages, applyBrandingTransformation } from "@/app/marketing-hub/dynamic-branded-content/actions"
import type { CloudinaryImage } from "@/app/marketing-hub/dynamic-branded-content/actions"

type BrandingOptions = {
  wantBranding: boolean
  brandingChoice: "saved-brand" | "saved-logo" | "dropdown"
  selectedBrand: string
  includeContact: boolean
  name: string
  email: string
  phone: string
}

type ProspectingContentComponentProps = {
  lane: string // e.g., "fsbo", "expired", "soi", etc.
  title: string // e.g., "FSBO Marketing Materials"
  description: string // e.g., "Marketing materials and follow-up strategies to nurture FSBO relationships"
}

// Map prospecting lanes to Cloudinary folder paths (matching Dynamic Marketing structure)
const laneToFolderMap: Record<string, string> = {
  "fsbo": "social-content/unbranded/prospecting/fsbo",
  "expired": "social-content/unbranded/prospecting/expired",
  "soi": "social-content/unbranded/prospecting/soi", 
  "probate": "social-content/unbranded/prospecting/probate",
  "pre-foreclosure": "social-content/unbranded/prospecting/pre-foreclosure",
  "divorce": "social-content/unbranded/prospecting/divorce",
  "absentee-owners": "social-content/unbranded/prospecting/absentee-owners",
  "first-time-buyers": "social-content/unbranded/prospecting/first-time-buyers",
  "investors": "social-content/unbranded/prospecting/investors",
}

export default function ProspectingContentComponent({ 
  lane, 
  title, 
  description 
}: ProspectingContentComponentProps) {
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [userBrandingProfile, setUserBrandingProfile] = useState<UserBrandingProfile | null>(null)
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [loadingImages, setLoadingImages] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [brandingImage, setBrandingImage] = useState<string | null>(null)
  const [brandedImageUrl, setBrandedImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

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

  // Ref for branding section to enable auto-scroll
  const brandingSectionRef = useRef<HTMLDivElement>(null)

  // Load user branding profile
  useEffect(() => {
    async function loadUserBrandingProfile() {
      if (!user?.id || userLoading || !tenantConfig) {
        setLoadingProfile(false)
        return
      }

      try {
        const profile = await getUserBrandingProfile(user.id, tenantConfig.id)
        console.log("Loaded user branding profile:", profile)
        setUserBrandingProfile(profile)
        
        // Set default branding options based on profile
        if (profile) {
          setBrandingOptions({
            wantBranding: true,
            brandingChoice: "saved-brand",
            selectedBrand: profile.brand || "dropdown",
            includeContact: true,
            name: profile.name || user.name || "",
            email: profile.email || user.email || "",
            phone: profile.phone || "",
          })
        }
      } catch (error) {
        console.error("Error loading user branding profile:", error)
      } finally {
        setLoadingProfile(false)
      }
    }

    loadUserBrandingProfile()
  }, [user?.id, userLoading, tenantConfig])

  // Load images for this lane
  useEffect(() => {
    async function loadImages() {
      const folderPath = laneToFolderMap[lane]
      console.log(`Loading images for lane: ${lane}, folder: ${folderPath}`)
      
      if (!folderPath) {
        console.error(`No folder mapping found for lane: ${lane}`)
        return
      }

      setLoadingImages(true)
      try {
        const fetchedImages = await fetchCloudinaryImages(folderPath)
        console.log(`Fetched ${fetchedImages.length} images for ${lane}:`, fetchedImages)
        setImages(fetchedImages)
      } catch (error) {
        console.error("Error loading images:", error)
      } finally {
        setLoadingImages(false)
      }
    }

    loadImages()
  }, [lane])

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setBrandingImage(imageUrl)
    setBrandedImageUrl(null)
    
    // Auto-scroll to branding section when image is selected
    setTimeout(() => {
      brandingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }

  const handleGenerateBrandedImage = async () => {
    if (!brandingImage || !brandingOptions.wantBranding) {
      setBrandedImageUrl(brandingImage)
      // Auto-scroll to branding section
      setTimeout(() => {
        brandingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return
    }

    setIsGenerating(true)
    try {
      // Extract public_id from the image URL
      const publicId = brandingImage.split('/').slice(-2).join('/').split('.')[0]
      
      let logoIdentifier = ""
      if (brandingOptions.brandingChoice === "saved-brand" && userBrandingProfile?.logoIdentifier) {
        logoIdentifier = userBrandingProfile.logoIdentifier
      } else if (brandingOptions.brandingChoice === "saved-logo" && userBrandingProfile?.logoIdentifier) {
        logoIdentifier = userBrandingProfile.logoIdentifier
      } else if (brandingOptions.brandingChoice === "dropdown" && brandingOptions.selectedBrand) {
        logoIdentifier = brandingOptions.selectedBrand
      }

      const contactInfo = brandingOptions.includeContact ? {
        name: brandingOptions.name,
        email: brandingOptions.email,
        phone: brandingOptions.phone,
      } : null

      const result = await applyBrandingTransformation({
        publicId,
        brandingChoice: brandingOptions.brandingChoice,
        logoIdentifier,
        contactInfo,
      })

      setBrandedImageUrl(result.url)
      
      // Auto-scroll to branding section after generation
      setTimeout(() => {
        brandingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (error) {
      console.error("Error generating branded image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (brandedImageUrl) {
      const link = document.createElement('a')
      link.href = brandedImageUrl
      link.download = `${lane}-marketing-content.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loadingProfile || loadingImages) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading content...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-black mb-4">{title}</h4>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.public_id}
            className="relative group cursor-pointer"
            onClick={() => handleImageSelect(image.secure_url)}
          >
            <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-colors">
              <Image
                src={image.secure_url}
                alt={image.filename}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleImageSelect(image.secure_url)
                  }}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Image and Branding Options */}
      {selectedImage && (
        <Card ref={brandingSectionRef}>
          <CardHeader>
            <CardTitle className="text-lg">Customize Your Content</CardTitle>
            <CardDescription>
              Apply your branding and contact information to the selected image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                  <Image
                    src={brandedImageUrl || selectedImage}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg border"
                  />
                </div>
              </div>

              {/* Branding Options */}
              <div className="flex-1 space-y-4">
                <div>
                  <Label className="text-base font-medium">Branding Options</Label>
                  <RadioGroup
                    value={brandingOptions.wantBranding ? "yes" : "no"}
                    onValueChange={(value) =>
                      setBrandingOptions(prev => ({ ...prev, wantBranding: value === "yes" }))
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-branding" />
                      <Label htmlFor="no-branding">No Branding (Original)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-branding" />
                      <Label htmlFor="yes-branding">Apply Branding</Label>
                    </div>
                  </RadioGroup>
                </div>

                {brandingOptions.wantBranding && (
                  <>
                    {/* Branding Choice */}
                    <div>
                      <Label className="text-sm font-medium">Branding Source</Label>
                      <RadioGroup
                        value={brandingOptions.brandingChoice}
                        onValueChange={(value: "saved-brand" | "saved-logo" | "dropdown") =>
                          setBrandingOptions(prev => ({ ...prev, brandingChoice: value }))
                        }
                        className="mt-2"
                      >
                        {userBrandingProfile?.logoIdentifier && (
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="saved-brand" id="saved-brand" />
                            <Label htmlFor="saved-brand">Use Saved Brand ({userBrandingProfile.brand})</Label>
                          </div>
                        )}
                        {userBrandingProfile?.logoIdentifier && (
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="saved-logo" id="saved-logo" />
                            <Label htmlFor="saved-logo">Use Saved Logo Only</Label>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dropdown" id="dropdown" />
                          <Label htmlFor="dropdown">Choose from Dropdown</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Brand Selection */}
                    {brandingOptions.brandingChoice === "dropdown" && (
                      <div>
                        <Label htmlFor="brand-select">Select Brand</Label>
                        <Select
                          value={brandingOptions.selectedBrand}
                          onValueChange={(value) =>
                            setBrandingOptions(prev => ({ ...prev, selectedBrand: value }))
                          }
                        >
                          <SelectTrigger>
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

                    {/* Contact Information */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="checkbox"
                          id="include-contact"
                          checked={brandingOptions.includeContact}
                          onChange={(e) =>
                            setBrandingOptions(prev => ({ ...prev, includeContact: e.target.checked }))
                          }
                        />
                        <Label htmlFor="include-contact">Include Contact Information</Label>
                      </div>

                      {brandingOptions.includeContact && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="contact-name">Name</Label>
                            <Input
                              id="contact-name"
                              value={brandingOptions.name}
                              onChange={(e) =>
                                setBrandingOptions(prev => ({ ...prev, name: e.target.value }))
                              }
                              placeholder="Your name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact-email">Email</Label>
                            <Input
                              id="contact-email"
                              type="email"
                              value={brandingOptions.email}
                              onChange={(e) =>
                                setBrandingOptions(prev => ({ ...prev, email: e.target.value }))
                              }
                              placeholder="your@email.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact-phone">Phone</Label>
                            <Input
                              id="contact-phone"
                              value={brandingOptions.phone}
                              onChange={(e) =>
                                setBrandingOptions(prev => ({ ...prev, phone: e.target.value }))
                              }
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateBrandedImage}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate Branded Image"
                  )}
                </Button>

                {/* Preview Button */}
                {brandedImageUrl && (
                  <Button
                    onClick={() => setShowPreviewModal(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview Content
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {images.length === 0 && !loadingImages && (
        <div className="text-center py-8 text-gray-500">
          <p>No content available for this prospecting lane yet.</p>
          <p className="text-sm">Content will be added soon!</p>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-black">Preview Your Branded Content</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
            {brandedImageUrl && (
              <div className="relative max-w-2xl w-full">
                <Image
                  src={brandedImageUrl}
                  alt="Branded content preview"
                  width={800}
                  height={800}
                  className="w-full h-auto rounded-lg border shadow-lg"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 pt-4 border-t">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Image
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPreviewModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
