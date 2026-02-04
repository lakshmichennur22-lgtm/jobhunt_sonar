variable "project" {
  description = "Project name"
  type        = string
}

variable "application" {
  description = "Application name"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
}

variable "location" {
  description = "Azure location"
  type        = string
}

variable "location_short" {
  description = "Short code for location (e.g., weu for West Europe, ea for East Asia)"
  type        = string
}

variable "blockcode" {
  description = "Internal block code or cost center"
  type        = string
}

variable "admin_password" {
  description = "Password for VMs"
  type        = string
}
