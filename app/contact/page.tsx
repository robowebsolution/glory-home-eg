"use client"

"use client"

import type React from "react"
import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { toast } from "sonner"

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Glory Home",
    details: ["5b central axis 6th October, Giza Egypt", "45b central axis 6th October - Giza - Egypt"],
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["01272020575", "01224577773"],
    color: "from-green-500 to-green-600",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@gloryhome-eg.com"],
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Clock,
    title: "Times Of Work",
    details: ["All days of the week From 11AM : 12AM"],
    color: "from-orange-500 to-orange-600",
  },
]

export default function ContactPage() {
  const { isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit message.");
      }

      toast.success("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gray-50 dark:bg-gray-950 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Glory Home
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              GLORY HOME, founded in 2017. We are factory for furniture products and wooden crafts for more than 6 years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <CardContent className="p-8 flex flex-col items-center">
                    <div
                      className={`flex-shrink-0 h-16 w-16 mb-6 rounded-full flex items-center justify-center bg-gradient-to-br ${item.color}`}
                    >
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                    <div className="text-gray-600 dark:text-gray-300 space-y-1">
                      {item.details.map((detail, i) => (
                        <p key={i}>{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form and Map Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-2xl h-full">
                <CardHeader>
                  <CardTitle className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                    <MessageSquare className={`h-6 w-6 text-gray-500 ${isRTL ? "ml-3" : "mr-3"}`} />
                    <span className="text-2xl font-light text-gray-900 dark:text-white">
                      Send us a Message
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className={`space-y-6 ${isRTL ? "rtl" : ""}`}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-100 dark:bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-100 dark:bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="bg-gray-100 dark:bg-gray-800"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="px-8 py-3" disabled={loading}>
                        {loading ? (
                          <>
                            <svg
                              className={`animate-spin h-5 w-5 ${isRTL ? "ml-3" : "-ml-1 mr-3"}`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map Iframe */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-2xl overflow-hidden h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m24!1m12!1m3!1d221000.45132132113!2d31.29261167706407!3d30.061749102773096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m9!3e6!4m3!3m2!1d30.145951999999998!2d31.3340629!4m3!3m2!1d29.9608097!2d30.921599299999997!5e0!3m2!1sar!2seg!4v1754644009478!5m2!1sar!2seg"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '450px' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

