variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "project_name" {
  type    = string
  default = "realty-explorers"
}

variable "cognito_region" {
  type    = string
  default = "eu-north-1"
}

variable "cognito_user_pool_id" {
  type      = string
  sensitive = true
}

variable "cognito_client_id" {
  type      = string
  sensitive = true
}

variable "cognito_client_secret" {
  type      = string
  sensitive = true
}

variable "cognito_domain" {
  description = "Cognito hosted UI domain, e.g. https://auth.realty-explorers.com"
  type        = string
}

variable "auth_secret" {
  description = "NextAuth secret (random string)"
  type        = string
  sensitive   = true
}

variable "mapbox_api_key" {
  type      = string
  sensitive = true
}

variable "google_api_key" {
  type      = string
  sensitive = true
}

variable "posthog_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "posthog_host" {
  type    = string
  default = "https://app.posthog.com"
}

variable "ably_api_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "projo_api_key" {
  type      = string
  sensitive = true
  default   = ""
}
